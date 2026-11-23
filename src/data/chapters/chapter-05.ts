export const chapter05 = {
  id: "chapter-05",
  label: "第 5 章 · 函数与参数",
  lessons: [
    {
      slug: "chapter-05/define-and-call",
      label: "5.1 定义和调用函数",
    },
    {
      slug: "chapter-05/positional-and-keyword-arguments",
      label: "5.2 位置参数与关键字参数",
    },
    {
      slug: "chapter-05/defaults-and-local-names",
      label: "5.3 默认值与局部名字",
    },
  ],
  challenge: {
    title: "封装费用计算",
    description:
      "用一个函数计算数量、单价和附加费产生的总费用。输出使用默认附加费和指定附加费的结果。",
    instructions: [
      "定义 total_cost(quantity, unit_price, fee=0)，用 return 交回数量乘单价再加附加费的结果。",
      "第一行用位置参数传入 quantity 和 unit_price，省略 fee，打印函数返回值。",
      "第二行用关键字参数传入 quantity、unit_price 和 handling_fee，后者是 fee 的值，打印函数返回值。",
    ],
    starterCode:
      "def total_cost(quantity, unit_price, fee=0):\n    # 计算费用并返回。\n    return 0\n\n\n# 题目提供 quantity、unit_price 和 handling_fee。\n# 调用函数两次，按要求分别打印结果。\n",
    cases: [
      {
        label: "基础费用与附加费用",
        setup: "quantity = 3\nunit_price = 5\nhandling_fee = 2",
        expectedOutput: "15\n17",
      },
      {
        label: "数量为零",
        setup: "quantity = 0\nunit_price = 10\nhandling_fee = 4",
        expectedOutput: "0\n4",
      },
      {
        label: "附加费为零",
        setup: "quantity = 6\nunit_price = 4\nhandling_fee = 0",
        expectedOutput: "24\n24",
      },
    ],
  },
};
