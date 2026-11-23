export const chapter12 = {
  id: "chapter-12",
  label: "第 12 章 · 数据建模与类型标注",
  lessons: [
    { slug: "chapter-12/classes-and-instances", label: "12.1 类与实例" },
    { slug: "chapter-12/data-classes", label: "12.2 用数据类表示记录" },
    { slug: "chapter-12/type-annotations", label: "12.3 类型标注" },
  ],
  challenge: {
    title: "用数据类汇总商品条目",
    description:
      "给定商品条目列表 records。每条数据依次给出名称、数量和整数单价。请用数据类表示条目，再输出总件数和总金额。",
    instructions: [
      "定义数据类 Item，依次声明 name、quantity 和 unit_price 三个字段。",
      "把 records 中的每条数据转换成 Item 实例。总件数是各条目的数量之和，总金额是各条目数量乘以单价后的和。",
      "如果列表为空，总件数和总金额都是 0。按样例格式输出一行。",
    ],
    starterCode:
      "from dataclasses import dataclass\n\n# 题目已提供 records。请定义 Item，计算并输出合计。\n",
    cases: [
      {
        label: "样例商品",
        setup: 'records = [("铅笔", 3, 2), ("尺子", 1, 5)]',
        expectedOutput: "共 4 件，合计 11 元",
      },
      {
        label: "空列表",
        setup: "records = []",
        expectedOutput: "共 0 件，合计 0 元",
      },
      {
        label: "包含零件数的条目",
        setup: 'records = [("笔记本", 2, 7), ("夹子", 0, 3), ("文件夹", 3, 4)]',
        expectedOutput: "共 5 件，合计 26 元",
      },
    ],
  },
};
