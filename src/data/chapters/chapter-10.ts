type Registration = {
  name: string;
  confirmed: boolean;
};

function registrationSetup(records: Registration[]) {
  const text = JSON.stringify(records);
  return [
    "from pathlib import Path",
    'source_path = Path("chapter10-registrations.json")',
    `source_path.write_text(${JSON.stringify(text)}, encoding="utf-8")`,
  ].join("\n");
}

export const chapter10 = {
  id: "chapter-10",
  label: "第 10 章 · 文件与 JSON",
  lessons: [
    { slug: "chapter-10/text-files", label: "10.1 用 pathlib 读写文本" },
    { slug: "chapter-10/with-files", label: "10.2 用 with 管理打开的文件" },
    {
      slug: "chapter-10/json-data",
      label: "10.3 用 JSON 保存和读取结构化数据",
    },
  ],
  challenge: {
    title: "生成报名汇总",
    description:
      "你收到了一个 JSON 报名文件。每条记录包含姓名 name 和确认状态 confirmed。读取文件，输出总报名数和已确认的姓名。",
    instructions: [
      "程序已经创建文件，并提供 Path 对象 source_path。用 UTF-8 打开该文件，再用 json.load() 读取报名记录。",
      "收集 confirmed 为 True 的姓名，保留它们在文件中的出现顺序。total 是全部记录的条数，confirmed 是所收集的姓名列表。",
      '用 json.dumps() 生成一行 JSON 并输出。按 total、confirmed 的顺序写字段，设置 ensure_ascii=False，并使用默认空格。例如 {"total": 1, "confirmed": ["林岚"]}。',
    ],
    starterCode: [
      "import json",
      "",
      '# 用 source_path.open("r", encoding="utf-8") 打开报名文件。',
      "# 读取记录，建立汇总字典，再将字典输出为一行 JSON。",
      "",
    ].join("\n"),
    cases: [
      {
        label: "有人确认，有人待确认",
        setup: registrationSetup([
          { name: "林岚", confirmed: true },
          { name: "周晴", confirmed: false },
          { name: "许言", confirmed: true },
        ]),
        expectedOutput: '{"total": 3, "confirmed": ["林岚", "许言"]}',
      },
      {
        label: "名单为空",
        setup: registrationSetup([]),
        expectedOutput: '{"total": 0, "confirmed": []}',
      },
      {
        label: "保留确认顺序",
        setup: registrationSetup([
          { name: "周晴", confirmed: true },
          { name: "林岚", confirmed: true },
        ]),
        expectedOutput: '{"total": 2, "confirmed": ["周晴", "林岚"]}',
      },
    ],
  },
};
