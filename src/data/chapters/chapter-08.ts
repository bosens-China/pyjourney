export const chapter08 = {
  id: "chapter-08",
  label: "第 8 章 · 迭代器与生成器",
  lessons: [
    {
      slug: "chapter-08/iter-and-next",
      label: "8.1 逐项取值的迭代器",
    },
    {
      slug: "chapter-08/generators-with-yield",
      label: "8.2 用 yield 逐项交出结果",
    },
    {
      slug: "chapter-08/generator-expressions",
      label: "8.3 用生成器表达式按需计算",
    },
  ],
  challenge: {
    title: "逐项生成相邻差值",
    description:
      "给定一个整数列表，定义生成器函数，按顺序产出每一对相邻数字中后一个数减前一个数的结果。",
    instructions: [
      "定义生成器函数 adjacent_differences(values)，可以用 iter() 和 next() 先取第一个数字。",
      "遍历剩余数字，用 yield 交出当前数字减前一个数字的差值，再更新记录的前一个数字。",
      "如果列表里少于两个数字，生成器应直接结束。",
      "编辑器已写好两次输出。第一行先取首个差值，耗尽时显示 None。第二行将尚未取出的差值显示为列表。",
    ],
    starterCode:
      "def adjacent_differences(values):\n    # 逐项产出相邻数字的差值。\n    yield 0\n\n\ndifferences = adjacent_differences(values)\nprint(next(differences, None))\nprint(list(differences))\n",
    cases: [
      {
        label: "列表中有三对相邻数字",
        setup: "values = [3, 8, 5, 9]",
        expectedOutput: "5\n[-3, 4]",
      },
      {
        label: "相邻数字相同",
        setup: "values = [4, 4]",
        expectedOutput: "0\n[]",
      },
      {
        label: "空列表",
        setup: "values = []",
        expectedOutput: "None\n[]",
      },
    ],
  },
};
