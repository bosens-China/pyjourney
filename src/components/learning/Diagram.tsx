import { useId, type ReactNode } from "react";

export type RefsDiagram = {
  kind: "refs";
  names: { name: string; to: string }[];
  objects: { id: string; label: string; refs?: string[] }[];
  /** 需要强调的名字或对象 id。 */
  highlight?: string[];
};

export type FlowDiagram = {
  kind: "flow";
  direction?: "row" | "column";
  nodes: { id: string; label: string }[];
  /** 分支的连线。可用负数走左侧、正数走右侧，绝对值区分走线。 */
  edges?: [from: string, to: string, lane?: number][];
  /** 分支图按实际经过的顺序填写，可以回到先前的节点。 */
  active: string[];
};

export type SliceDiagram = {
  kind: "slice";
  items: string[];
  /** 与 Python 切片相同：`[start, stop, step]`，`null` 表示省略。 */
  slice?: [number | null, number | null, number?];
  index?: number;
  showBounds?: boolean;
};

export type DiagramSpec = RefsDiagram | FlowDiagram | SliceDiagram;

const BOX_HEIGHT = 32;
const ROW_GAP = 14;
const COLUMN_GAP = 64;

function textWidth(text: string) {
  let width = 0;
  for (const char of text) width += char.charCodeAt(0) < 128 ? 8 : 14;
  return width + 24;
}

function Arrowhead({ id, className }: { id: string; className: string }) {
  return (
    <marker
      id={id}
      viewBox="0 0 10 10"
      refX="9"
      refY="5"
      markerWidth="7"
      markerHeight="7"
      orient="auto-start-reverse"
    >
      <path d="M0 0 L10 5 L0 10 z" className={className} />
    </marker>
  );
}

function Svg({
  width,
  height,
  label,
  markerId,
  children,
}: {
  width: number;
  height: number;
  label: string;
  markerId?: string;
  children: ReactNode;
}) {
  return (
    <svg
      className="block h-auto w-full font-rp-mono text-[13px]"
      style={{ maxWidth: width * 1.3 }}
      viewBox={`-2 -2 ${width + 4} ${height + 4}`}
      role="img"
      aria-label={label}
    >
      {markerId && (
        <defs>
          <Arrowhead id={markerId} className="fill-rp-muted" />
          <Arrowhead id={`${markerId}-on`} className="fill-rp-brand" />
        </defs>
      )}
      {children}
    </svg>
  );
}

type Box = { x: number; y: number; width: number };

function Refs({ names, objects, highlight = [] }: RefsDiagram) {
  const markerId = useId();
  const nested = new Set(objects.flatMap((object) => object.refs ?? []));
  const outer = objects.filter(({ id }) => !nested.has(id));
  const inner = objects.filter(({ id }) => nested.has(id));
  const rows = new Map<string, number>();
  [...outer, ...inner].forEach(({ id }, row) => rows.set(id, row));

  let lastRow = -1;
  const nameColumn = [...names]
    .sort((a, b) => (rows.get(a.to) ?? 0) - (rows.get(b.to) ?? 0))
    .map(({ name, to }) => {
      lastRow = Math.max(lastRow + 1, rows.get(to) ?? 0);
      rows.set(`name:${name}`, lastRow);
      return { id: `name:${name}`, label: name };
    });
  const columns = [nameColumn, outer, inner].filter(
    (column, index) => index === 0 || column.length > 0,
  );

  const boxes = new Map<string, Box>();
  let x = 0;
  let rowCount = 0;
  for (const column of columns) {
    const width = Math.max(...column.map(({ label }) => textWidth(label)));
    for (const { id } of column) {
      const row = rows.get(id) ?? 0;
      boxes.set(id, { x, y: row * (BOX_HEIGHT + ROW_GAP), width });
      rowCount = Math.max(rowCount, row + 1);
    }
    x += width + COLUMN_GAP;
  }
  const height = rowCount * (BOX_HEIGHT + ROW_GAP) - ROW_GAP;

  const edges = [
    ...names.map(({ name, to }) => [`name:${name}`, to, name] as const),
    ...objects.flatMap(({ id, refs = [] }) =>
      refs.map((to) => [id, to, id] as const),
    ),
  ];
  const marked = (id: string) => highlight.includes(id);

  return (
    <Svg
      width={x - COLUMN_GAP}
      height={height}
      label={names.map(({ name, to }) => `${name} 指向 ${to}`).join("，")}
      markerId={markerId}
    >
      {edges.map(([from, to, owner]) => {
        const a = boxes.get(from);
        const b = boxes.get(to);
        if (!a || !b) return null;
        const x1 = a.x + a.width;
        const y1 = a.y + BOX_HEIGHT / 2;
        const x2 = b.x - 2;
        const y2 = b.y + BOX_HEIGHT / 2;
        const bend = (x2 - x1) / 2;
        return (
          <path
            key={`${from}->${to}`}
            d={`M${x1} ${y1} C${x1 + bend} ${y1} ${x2 - bend} ${y2} ${x2} ${y2}`}
            fill="none"
            markerEnd={`url(#${markerId}${marked(owner) ? "-on" : ""})`}
            className={
              marked(owner)
                ? "stroke-rp-brand transition-colors"
                : "stroke-rp-muted transition-colors"
            }
            strokeWidth={marked(owner) ? 2 : 1.25}
          />
        );
      })}
      {columns.flat().map(({ id, label }) => {
        const box = boxes.get(id)!;
        const isName = id.startsWith("name:");
        const on = marked(isName ? id.slice(5) : id);
        return (
          <g key={id}>
            <rect
              x={box.x}
              y={box.y}
              width={box.width}
              height={BOX_HEIGHT}
              rx={isName ? 16 : 6}
              className={`transition-colors ${
                on
                  ? "fill-rp-tint stroke-rp-brand"
                  : isName
                    ? "fill-rp-surface stroke-rp-line"
                    : "fill-rp-soft stroke-rp-line"
              }`}
              strokeWidth={on ? 2 : 1}
            />
            <text
              x={box.x + box.width / 2}
              y={box.y + BOX_HEIGHT / 2}
              textAnchor="middle"
              dominantBaseline="central"
              className={isName ? "fill-rp-brand" : "fill-rp-text"}
            >
              {label}
            </text>
          </g>
        );
      })}
    </Svg>
  );
}

function Flow({ nodes, active, edges, direction = "column" }: FlowDiagram) {
  const markerId = useId();
  const row = !edges && direction === "row";
  const gap = row ? 40 : 22;
  const widest = Math.max(...nodes.map(({ label }) => textWidth(label)));
  const boxes = nodes.map(({ label }) => {
    const width = row ? textWidth(label) : widest;
    return { width, offset: 0 };
  });
  const indexById = new Map(nodes.map(({ id }, index) => [id, index]));
  const activeEdges = new Set(
    active.slice(1).map((id, index) => `${active[index]}→${id}`),
  );
  const declaredEdges: NonNullable<FlowDiagram["edges"]> =
    edges ?? nodes.slice(1).map(({ id }, index) => [nodes[index].id, id]);
  const connections = declaredEdges.flatMap(([from, to, lane]) => {
    const start = indexById.get(from);
    const end = indexById.get(to);
    if (start === undefined || end === undefined) return [];
    const key = `${from}→${to}`;
    return [
      {
        key,
        start,
        end,
        lane: lane ?? (end === start + 1 ? 0 : 1),
        lit: edges
          ? activeEdges.has(key)
          : active.includes(from) && active.includes(to),
      },
    ];
  });
  const laneWidth = 18;
  const left = laneWidth * Math.max(0, ...connections.map(({ lane }) => -lane));
  const right = laneWidth * Math.max(0, ...connections.map(({ lane }) => lane));
  let cursor = 0;
  for (const box of boxes) {
    box.offset = cursor;
    cursor += (row ? box.width : BOX_HEIGHT) + gap;
  }
  const total = cursor - gap;
  const pathLabels = edges
    ? active.map((id) => nodes[indexById.get(id) ?? -1]?.label ?? id)
    : nodes.filter(({ id }) => active.includes(id)).map(({ label }) => label);

  return (
    <Svg
      width={row ? total : left + widest + right}
      height={row ? BOX_HEIGHT : total}
      label={`执行经过：${pathLabels.join(" → ")}`}
      markerId={markerId}
    >
      {connections
        .sort((a, b) => Number(a.lit) - Number(b.lit))
        .map(({ key, start, end, lane, lit }) => {
          const from = boxes[start];
          const to = boxes[end];
          const center = left + widest / 2;
          let path: string;
          if (row) {
            path = `M${from.offset + from.width} ${BOX_HEIGHT / 2} H${to.offset - 2}`;
          } else if (lane) {
            const side = lane < 0 ? left : left + widest;
            const outside = side + lane * laneWidth;
            const arrow = side + Math.sign(lane) * 2;
            path = `M${side} ${from.offset + BOX_HEIGHT / 2} H${outside} V${to.offset + BOX_HEIGHT / 2} H${arrow}`;
          } else {
            path = `M${center} ${from.offset + BOX_HEIGHT} V${to.offset - 2}`;
          }
          return (
            <path
              key={key}
              d={path}
              fill="none"
              strokeLinejoin="round"
              markerEnd={`url(#${markerId}${lit ? "-on" : ""})`}
              className={`transition-colors ${lit ? "stroke-rp-brand" : "stroke-rp-line"}`}
              strokeWidth={lit ? 2 : 1.25}
            />
          );
        })}
      {nodes.map(({ id, label }, index) => {
        const box = boxes[index]!;
        const on = active.includes(id);
        const x = row ? box.offset : left;
        const y = row ? 0 : box.offset;
        return (
          <g key={id} className="transition-opacity" opacity={on ? 1 : 0.4}>
            <rect
              x={x}
              y={y}
              width={box.width}
              height={BOX_HEIGHT}
              rx={6}
              className={
                on
                  ? "fill-rp-tint stroke-rp-brand"
                  : "fill-rp-soft stroke-rp-line"
              }
              strokeWidth={on ? 2 : 1}
            />
            <text
              x={x + box.width / 2}
              y={y + BOX_HEIGHT / 2}
              textAnchor="middle"
              dominantBaseline="central"
              className="fill-rp-text"
            >
              {label}
            </text>
          </g>
        );
      })}
    </Svg>
  );
}

function sliceBounds(
  length: number,
  [start, stop, step = 1]: [number | null, number | null, number?],
) {
  if (step === 0) throw new RangeError("切片步长不能为 0");
  const forward = step > 0;
  const lower = forward ? 0 : -1;
  const upper = forward ? length : length - 1;
  const normalize = (value: number) =>
    Math.min(Math.max(value < 0 ? value + length : value, lower), upper);
  return {
    from: start === null ? (forward ? lower : upper) : normalize(start),
    to: stop === null ? (forward ? upper : lower) : normalize(stop),
    step,
  };
}

export function sliceIndices(
  length: number,
  slice: NonNullable<SliceDiagram["slice"]>,
) {
  const { from, to, step } = sliceBounds(length, slice);
  const picked: number[] = [];
  if (step > 0) {
    for (let i = from; i < to; i += step) picked.push(i);
  } else {
    for (let i = from; i > to; i += step) picked.push(i);
  }
  return picked;
}

function Slice({ items, slice, index, showBounds }: SliceDiagram) {
  const cell = 44;
  const bounds = showBounds && slice ? sliceBounds(items.length, slice) : null;
  const top = bounds ? 36 : 20;
  const width = items.length * cell + 20;
  const picked = new Set(
    slice
      ? sliceIndices(items.length, slice)
      : index === undefined
        ? []
        : [index < 0 ? index + items.length : index],
  );
  // 向左取字符时，端点画在对应字符的右侧。
  const shift = bounds && bounds.step < 0 ? 1 : 0;
  const markers = bounds
    ? [
        {
          label: "起点",
          position: bounds.from + shift,
          y: 11,
          edge: top,
          end: false,
        },
        {
          label: "终点",
          position: bounds.to + shift,
          y: top + cell + 33,
          edge: top + cell,
          end: true,
        },
      ]
    : [];
  const selection = picked.size
    ? `选中下标 ${[...picked].join("、")}`
    : "未选中字符";

  return (
    <Svg
      width={width}
      height={top + cell + (bounds ? 39 : 22)}
      label={
        bounds && slice
          ? `起点 ${slice[0] ?? "省略"}，终点 ${slice[1] ?? "省略"}。${selection}`
          : selection
      }
    >
      <g transform="translate(10 0)">
        {items.map((item, i) => (
          <g key={i}>
            <rect
              x={i * cell}
              y={top}
              width={cell}
              height={cell}
              className={`transition-colors ${
                picked.has(i)
                  ? "fill-rp-tint stroke-rp-brand"
                  : "fill-rp-soft stroke-rp-line"
              }`}
              strokeWidth={picked.has(i) ? 2 : 1}
            />
            <text
              x={i * cell + cell / 2}
              y={top + cell / 2}
              textAnchor="middle"
              dominantBaseline="central"
              className="fill-rp-text"
            >
              {item}
            </text>
            <text
              x={i * cell}
              y={top - 8}
              textAnchor="middle"
              className="fill-rp-muted text-[11px]"
            >
              {i}
            </text>
            <text
              x={i * cell}
              y={top + cell + 16}
              textAnchor="middle"
              className="fill-rp-muted text-[11px]"
            >
              {i - items.length}
            </text>
          </g>
        ))}
        <text
          x={items.length * cell}
          y={top - 8}
          textAnchor="middle"
          className="fill-rp-muted text-[11px]"
        >
          {items.length}
        </text>
        {markers.map(({ label, position, y, edge, end }) => {
          const x = position * cell;
          const anchor =
            position === 0
              ? "start"
              : position === items.length
                ? "end"
                : "middle";
          return (
            <g key={label}>
              <text
                x={x}
                y={y}
                textAnchor={anchor}
                className="fill-rp-brand text-[11px] font-semibold"
              >
                {label}
              </text>
              <line
                x1={x}
                x2={x}
                y1={edge}
                y2={edge + (end ? -9 : 9)}
                className="stroke-rp-brand"
                strokeWidth={2}
              />
            </g>
          );
        })}
      </g>
    </Svg>
  );
}

export default function Diagram({ diagram }: { diagram: DiagramSpec }) {
  return (
    <div className="flex justify-center overflow-x-auto rounded-lg border border-rp-line px-4 py-4">
      {diagram.kind === "refs" ? (
        <Refs {...diagram} />
      ) : diagram.kind === "flow" ? (
        <Flow {...diagram} />
      ) : (
        <Slice {...diagram} />
      )}
    </div>
  );
}
