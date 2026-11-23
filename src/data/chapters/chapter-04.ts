export const chapter04 = {
  id: "chapter-04",
  label: "第 4 章 · 字典与集合",
  lessons: [
    { slug: "chapter-04/dictionaries", label: "4.1 用键读写字典" },
    {
      slug: "chapter-04/dictionary-aggregation",
      label: "4.2 遍历字典并累计数据",
    },
    { slug: "chapter-04/sets", label: "4.3 用集合去重和检查成员" },
  ],
  challenge: {
    title: "汇总分类页数和书目数量",
    description: "计算每个类别的阅读页数，再统计一共记录了多少本不同的书。",
    instructions: [
      "readings 中每项按 (类别, 书名, 页数) 排列。把页数累计到对应类别。",
      "按类别首次出现的顺序，每个类别输出一行“类别 N 页”。",
      "同一个书名可以出现在多条记录或多个类别中，统计书目数量时只算一次。",
      "最后输出一行“共记录 N 本书”。当 readings 为空时，只输出这一行。",
    ],
    starterCode:
      "# 题目已提供 readings，其中每条记录包含类别、书名和页数。\n\n# 记录各类别的总页数和每个不同的书名。\n",
    cases: [
      {
        label: "分类累计并合并重复书目",
        setup:
          'readings = [("小说", "夜航", 12), ("散文", "山间", 8), ("小说", "夜航", 15), ("小说", "海边", 6), ("散文", "山间", 4)]',
        expectedOutput: "小说 33 页\n散文 12 页\n共记录 3 本书",
      },
      {
        label: "同本书出现在不同类别",
        setup:
          'readings = [("随笔", "海边", 5), ("纪实", "海边", 4), ("随笔", "山间", 7)]',
        expectedOutput: "随笔 12 页\n纪实 4 页\n共记录 2 本书",
      },
      {
        label: "空记录",
        setup: "readings = []",
        expectedOutput: "共记录 0 本书",
      },
    ],
  },
};
