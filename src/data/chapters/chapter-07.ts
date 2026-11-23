export const chapter07 = {
  id: "chapter-07",
  label: "第 7 章 · 遍历、解包与推导式",
  lessons: [
    {
      slug: "chapter-07/unpack-iterables",
      label: "7.1 按顺序解包",
    },
    {
      slug: "chapter-07/enumerate-and-zip",
      label: "7.2 带编号与并排遍历",
    },
    {
      slug: "chapter-07/comprehensions",
      label: "7.3 用推导式构造容器",
    },
  ],
  challenge: {
    title: "筛选并编号配对结果",
    description:
      "把两组数据按位置配对，保留达到下限的项，输出保留的项数和编好序的结果。",
    instructions: [
      "使用 zip() 把 labels 和 values 按位置配对。题目提供的两组数据长度相同。",
      "用列表推导式保留值大于或等于 threshold 的数据对，保持原顺序。",
      "第一行打印符合条件的项数。",
      "给保留的数据对从 1 开始编号，每行按「1. A: 7」的格式输出序号、名称和值。",
    ],
    starterCode:
      "# 题目提供 labels、values 和 threshold。\n\n# 筛选配对结果，再输出项数和编号。\n",
    cases: [
      {
        label: "筛选后保留两项",
        setup: 'labels = ["A", "B", "C"]\nvalues = [7, 2, 9]\nthreshold = 5',
        expectedOutput: "2\n1. A: 7\n2. C: 9",
      },
      {
        label: "恰好达到下限",
        setup: 'labels = ["X", "Y", "Z"]\nvalues = [2, 4, 4]\nthreshold = 4',
        expectedOutput: "2\n1. Y: 4\n2. Z: 4",
      },
      {
        label: "没有符合条件的项",
        setup: 'labels = ["P", "Q"]\nvalues = [1, 2]\nthreshold = 3',
        expectedOutput: "0",
      },
    ],
  },
};
