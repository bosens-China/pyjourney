export const chapter03 = {
  id: "chapter-03",
  label: "第 3 章 · 字符串、列表与元组",
  lessons: [
    {
      slug: "chapter-03/string-and-slices",
      label: "3.1 用索引和切片读取字符串",
    },
    { slug: "chapter-03/lists", label: "3.2 用列表保存和更新一组值" },
    { slug: "chapter-03/tuples", label: "3.3 用元组保存位置固定的值" },
  ],
  challenge: {
    title: "整理补录后的阅读记录",
    description:
      "把一条补录追加到当天的阅读记录，去掉书名两端的空白，再依次输出有效条目。",
    instructions: [
      "records 是一个列表，每条记录都是 (书名, 页数)。把 new_record 追加到列表末尾。",
      "去掉每个书名两端的空白。跳过清理后书名为空或页数小于等于 0 的记录。",
      "保留有效记录的原有顺序，从 1 开始连续编号。按样例格式输出每条记录。",
      "如果没有有效记录，只输出一行“没有有效记录”。",
    ],
    starterCode:
      "# 题目已提供 records 和 new_record。\n\n# 追加新记录，清理和筛选，再输出有效记录。\n",
    cases: [
      {
        label: "清理空白并跳过零页记录",
        setup:
          'records = [(" 散文 ", 18), ("历史", 0), (" 科幻", 24)]\nnew_record = (" 游记 ", 9)',
        expectedOutput: "1. 散文 18 页\n2. 科幻 24 页\n3. 游记 9 页",
      },
      {
        label: "空列表接收第一条记录",
        setup: 'records = []\nnew_record = ("小说", 7)',
        expectedOutput: "1. 小说 7 页",
      },
      {
        label: "展示没有有效记录时的提示",
        setup: 'records = [(" ", 10), ("诗集", 0)]\nnew_record = ("", 3)',
        expectedOutput: "没有有效记录",
      },
    ],
  },
};
