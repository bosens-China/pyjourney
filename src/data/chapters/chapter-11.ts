export const chapter11 = {
  id: "chapter-11",
  label: "第 11 章 · 模块与测试",
  lessons: [
    {
      slug: "chapter-11/modules-and-imports",
      label: "11.1 把可复用的代码放进模块",
    },
    { slug: "chapter-11/entry-points", label: "11.2 用 main 组织程序入口" },
    { slug: "chapter-11/testing-functions", label: "11.3 给函数写小测试" },
  ],
  challenge: {
    title: "计算打包需要的箱数",
    description:
      "每箱有固定容量，最后一箱可以装不满。写一个可复用的函数计算箱数，并用几条断言检查容易出错的输入。",
    instructions: [
      "用标准库 math 的 ceil() 编写 boxes_needed(items, capacity)。items 是物品总数，capacity 是每箱容量。测试中的容量都是正整数。",
      "用 assert 检查 0 件物品、刚好装满一箱和超出一箱 1 件的情况。三个结果分别是 0、1、2。",
      "程序提供当前订单的 items 和 capacity。调用函数并输出一行“需要 3 箱”这样的文本，数字随输入变化。",
    ],
    starterCode: [
      "import math",
      "",
      "",
      "def boxes_needed(items, capacity):",
      "    # 计算箱数，并返回整数。",
      "    pass",
      "",
      "",
      "# 写下三条断言，再用 items 和 capacity 计算当前订单。",
      "",
    ].join("\n"),
    cases: [
      {
        label: "最后一箱有空位",
        setup: "items = 25\ncapacity = 12",
        expectedOutput: "需要 3 箱",
      },
      {
        label: "没有物品",
        setup: "items = 0\ncapacity = 8",
        expectedOutput: "需要 0 箱",
      },
      {
        label: "刚好装满",
        setup: "items = 24\ncapacity = 12",
        expectedOutput: "需要 2 箱",
      },
    ],
  },
};
