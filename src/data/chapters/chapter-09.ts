export const chapter09 = {
  id: "chapter-09",
  label: "第 9 章 · 异常与错误处理",
  lessons: [
    { slug: "chapter-09/reading-tracebacks", label: "9.1 从异常回溯定位问题" },
    {
      slug: "chapter-09/handling-exceptions",
      label: "9.2 用 try 和 except 处理异常",
    },
    {
      slug: "chapter-09/raising-exceptions",
      label: "9.3 用 raise 声明失败条件",
    },
  ],
  challenge: {
    title: "盘点库存数量",
    description:
      "账表中的数量都是文本。有些记录还待补充，有些填了负数。请统计有效库存，并报告有几条记录无效。",
    instructions: [
      "程序提供数量文本列表 texts。编写 parse_quantity(text)，用 int() 转换文本，遇到负数时引发 ValueError。",
      "逐条解析记录。捕获 ValueError 时把无效记录数加一，再处理剩下的记录。把转换成功的数量加进合计。",
      "输出两行。第一行的格式是“库存合计 19”，第二行的格式是“无效记录 2”。数字随输入变化。",
    ],
    starterCode: [
      "def parse_quantity(text):",
      "    # 转换文本，再检验数量是否大于或等于零。",
      "    pass",
      "",
      "",
      "total = 0",
      "invalid = 0",
      "# 遍历 texts，调用 parse_quantity()，再输出统计结果。",
      "",
    ].join("\n"),
    cases: [
      {
        label: "有效数量和无效记录混合",
        setup: 'texts = ["12", "待定", "-3", "7"]',
        expectedOutput: "库存合计 19\n无效记录 2",
      },
      {
        label: "零、空白和空字符串",
        setup: 'texts = [" 0 ", " 12 ", "", "-2"]',
        expectedOutput: "库存合计 12\n无效记录 2",
      },
      {
        label: "没有有效记录",
        setup: 'texts = ["缺失", "-1", "2.5"]',
        expectedOutput: "库存合计 0\n无效记录 3",
      },
    ],
  },
};
