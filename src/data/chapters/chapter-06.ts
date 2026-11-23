export const chapter06 = {
  id: "chapter-06",
  label: "第 6 章 · 对象、引用与复制",
  lessons: [
    {
      slug: "chapter-06/equality-and-identity",
      label: "6.1 对象的相等与身份",
    },
    {
      slug: "chapter-06/mutation-and-shallow-copy",
      label: "6.2 原地修改与浅复制",
    },
    {
      slug: "chapter-06/mutable-default-values",
      label: "6.3 可变对象与参数默认值",
    },
  ],
  challenge: {
    title: "为两组列表创建独立副本",
    description:
      "给定一个内含两组数据的列表。分别为两组制作独立副本，再给每组追加一个值，保留原数据。",
    instructions: [
      "题目提供 rows、first_value 和 second_value。rows 的两个元素都是列表。",
      "复制两组内层列表，把两个副本放入新的外层列表。",
      "给副本的第一组追加 first_value，给第二组追加 second_value。",
      "第一行打印原列表 rows，第二行打印更新后的副本。",
    ],
    starterCode:
      "# 题目提供 rows、first_value 和 second_value。\n\n# 复制两组数据并追加元素，再打印原列表和副本。\n",
    cases: [
      {
        label: "复制两组普通列表",
        setup: "rows = [[1], [2, 3]]\nfirst_value = 4\nsecond_value = 5",
        expectedOutput: "[[1], [2, 3]]\n[[1, 4], [2, 3, 5]]",
      },
      {
        label: "内层列表为空",
        setup: "rows = [[], []]\nfirst_value = 0\nsecond_value = 1",
        expectedOutput: "[[], []]\n[[0], [1]]",
      },
      {
        label: "两组共享同一个列表",
        setup:
          "shared = [6]\nrows = [shared, shared]\nfirst_value = 7\nsecond_value = 8",
        expectedOutput: "[[6], [6]]\n[[6, 7], [6, 8]]",
      },
    ],
  },
};
