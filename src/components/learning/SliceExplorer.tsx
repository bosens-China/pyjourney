import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import Diagram, { sliceIndices, type SliceDiagram } from "./Diagram";
import { Card } from "@/components/ui/card";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";

type Slice = NonNullable<SliceDiagram["slice"]>;
type Mode = "explore" | "bounds" | "characters";

const word = [..."Python"];
const transferWord = [..."banana"];
const transferSlice: Slice = [2, -1];
const target = "yth";
const examples: { label: string; slice: Slice; note: string }[] = [
  {
    label: "含起点，不含终点",
    slice: [0, 2],
    note: "从 P 开始，停在 t 前面。",
  },
  {
    label: "负数下标",
    slice: [-2, null],
    note: "从右数第二个字符 o 开始，省略终点就取到末尾。",
  },
  {
    label: "省略起点",
    slice: [null, 3],
    note: "从第一个字符开始，停在 h 前面。",
  },
  {
    label: "反向切片",
    slice: [null, null, -1],
    note: "步长是 -1，两个端点都省略，从最后一个字符取到第一个。",
  },
];

function expression([start, stop, step = 1]: Slice) {
  const bounds = `${start ?? ""}:${stop ?? ""}`;
  return `word[${step === 1 ? bounds : `${bounds}:${step}`}]`;
}

function collect(items: string[], indices: number[]) {
  return indices.map((index) => items[index]).join("");
}

function Bounds({
  slice,
  onChange,
  showStep = false,
}: {
  slice: Slice;
  onChange: (slice: Slice) => void;
  showStep?: boolean;
}) {
  const [start, stop, step] = slice;
  const positions = Array.from(
    { length: word.length * 2 + 1 },
    (_, index) => index - word.length,
  );
  const bounds = [
    {
      label: "起点 start",
      value: start,
      update: (value: number | null): Slice => [value, stop, step],
    },
    {
      label: "终点 stop",
      value: stop,
      update: (value: number | null): Slice => [start, value, step],
    },
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {bounds.map(({ label, value, update }) => (
        <label key={label} className="grid gap-1 text-sm font-medium">
          {label}
          <NativeSelect
            value={value ?? ""}
            onChange={(event) => {
              const choice = event.currentTarget.value;
              onChange(update(choice === "" ? null : Number(choice)));
            }}
          >
            <NativeSelectOption value="">省略</NativeSelectOption>
            {positions.map((position) => (
              <NativeSelectOption key={position} value={position}>
                {position}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </label>
      ))}
      {showStep && (
        <label className="grid gap-1 text-sm font-medium">
          步长 step
          <NativeSelect
            value={step ?? 1}
            onChange={(event) =>
              onChange([start, stop, Number(event.currentTarget.value)])
            }
          >
            {[-3, -2, -1, 1, 2, 3].map((choice) => (
              <NativeSelectOption key={choice} value={choice}>
                {choice}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </label>
      )}
    </div>
  );
}

function boundsHint(slice: Slice, picked: number[]) {
  const [start] = slice;
  const first = start === null ? 0 : start < 0 ? word.length + start : start;
  if (first !== 1) return "先把起点移到 y 前面，切片会包含起点对应的字符。";
  if (picked.includes(4))
    return "终点越过了 o。把终点移到 o 前面，切片会在这里停下。";
  return "把终点放到 h 后面，切片会包含 h。";
}

export default function SliceExplorer() {
  const [mode, setMode] = useState<Mode>("explore");
  const [explore, setExplore] = useState<Slice>(examples[0].slice);
  const [note, setNote] = useState<string | null>(examples[0].note);
  const [trial, setTrial] = useState<Slice>([null, null]);
  const [selected, setSelected] = useState<number[]>([]);
  const [checked, setChecked] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (mode !== "explore") heading.current?.focus();
  }, [mode]);

  function changeMode(next: Mode) {
    setChecked(false);
    setMode(next);
  }

  function startPractice() {
    setTrial([null, null]);
    setSelected([]);
    changeMode("bounds");
  }

  const isExplore = mode === "explore";
  const isTransfer = mode === "characters";
  const items = isTransfer ? transferWord : word;
  const slice = isExplore ? explore : isTransfer ? transferSlice : trial;
  const picked = sliceIndices(items.length, slice);
  const result = collect(items, picked);
  const correct = isTransfer
    ? selected.length === picked.length &&
      picked.every((index) => selected.includes(index))
    : result === target;

  return (
    <Card asChild className="my-6">
      <section aria-label="探索字符串切片">
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="选择切片活动"
        >
          <Button
            variant={isExplore ? "default" : "outline"}
            aria-pressed={isExplore}
            onClick={() => changeMode("explore")}
          >
            自由探索
          </Button>
          <Button
            variant={!isExplore ? "default" : "outline"}
            aria-pressed={!isExplore}
            onClick={startPractice}
          >
            试一试
          </Button>
        </div>

        {isExplore ? (
          <>
            <p className="text-sm text-rp-muted">
              调整起点、终点和步长，观察切片按什么顺序取字符。
            </p>
            <div
              className="flex flex-wrap gap-2"
              role="group"
              aria-label="切片示例"
            >
              {examples.map((example) => (
                <Button
                  variant="outline"
                  key={example.label}
                  aria-pressed={note === example.note}
                  onClick={() => {
                    setExplore(example.slice);
                    setNote(example.note);
                  }}
                >
                  {example.label}
                </Button>
              ))}
            </div>
            <Bounds
              slice={explore}
              showStep
              onChange={(next) => {
                setExplore(next);
                setNote(null);
              }}
            />
          </>
        ) : (
          <h3 ref={heading} tabIndex={-1} className="font-semibold">
            {isTransfer
              ? "2 / 2 · 选出切片取得的字符"
              : "1 / 2 · 从 Python 中取出 yth"}
          </h3>
        )}

        {!isExplore && !isTransfer && (
          <Bounds
            slice={trial}
            onChange={(next) => {
              setTrial(next);
              setChecked(false);
            }}
          />
        )}

        <div
          className="grid gap-2"
          aria-live={isExplore ? "polite" : undefined}
        >
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 font-rp-mono text-sm">
            <code>word = {JSON.stringify(items.join(""))}</code>
            <code>{expression(slice)}</code>
            {isExplore && <samp>结果：{JSON.stringify(result)}</samp>}
          </div>
          {isExplore && picked.length > 0 && (
            <p className="text-sm text-rp-muted">
              依次取出下标 <code>{picked.join(" → ")}</code>
            </p>
          )}
          {isExplore && note && <p className="text-sm text-rp-muted">{note}</p>}
          {isExplore || checked ? (
            <Diagram
              diagram={{ kind: "slice", items, slice, showBounds: true }}
            />
          ) : !isTransfer ? (
            <Diagram diagram={{ kind: "slice", items }} />
          ) : null}
        </div>

        {isTransfer && (
          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-label="选择结果中的字符"
          >
            {items.map((item, index) => {
              const pressed = selected.includes(index);
              return (
                <Button
                  key={index}
                  variant={pressed ? "default" : "outline"}
                  aria-label={`下标 ${index}，字符 ${item}`}
                  aria-pressed={pressed}
                  className="min-h-11 min-w-11 font-rp-mono"
                  onClick={() => {
                    setSelected((previous) =>
                      previous.includes(index)
                        ? previous.filter((position) => position !== index)
                        : [...previous, index],
                    );
                    setChecked(false);
                  }}
                >
                  {index} · {item}
                </Button>
              );
            })}
          </div>
        )}

        {!isExplore && (
          <>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => setChecked(true)}>检查</Button>
              {checked && correct && (
                <Button
                  variant="outline"
                  onClick={
                    isTransfer ? startPractice : () => changeMode("characters")
                  }
                >
                  {isTransfer ? "再练一次" : "下一题"}
                </Button>
              )}
            </div>
            <div role="status">
              {checked && (
                <p className="rounded-md bg-rp-soft px-3 py-2 text-sm">
                  <strong>{correct ? "答对了。" : "再试一次。"}</strong>{" "}
                  <span>
                    实际结果是 <samp>{JSON.stringify(result)}</samp>。
                  </span>{" "}
                  {isTransfer
                    ? "从下标 2 的 n 开始，停在最后一个 a 前面。"
                    : correct
                      ? "起点在 y 前面，终点在 o 前面。"
                      : boundsHint(slice, picked)}
                </p>
              )}
            </div>
          </>
        )}
      </section>
    </Card>
  );
}
