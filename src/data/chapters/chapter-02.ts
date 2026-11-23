export const chapter02 = {
  id: "chapter-02",
  label: "第 2 章 · 判断与循环",
  lessons: [
    { slug: "chapter-02/conditions", label: "2.1 用条件选择执行路径" },
    { slug: "chapter-02/for-and-range", label: "2.2 用 for 遍历和计数" },
    {
      slug: "chapter-02/while-and-loop-control",
      label: "2.3 用 while 重复，按条件停止",
    },
  ],
  challenge: {
    title: "统计阅读达标天数",
    description:
      "按日历顺序检查一段阅读计划，跳过休息日，统计读够目标页数的天数。",
    instructions: [
      "遍历第 1 天到第 day_count 天。编号等于 rest_day 的那一天休息，略过该天的统计。rest_day 为 0 时，每天都安排阅读。",
      "第一天的计划页数是 first_pages。以后每往后一天多读 2 页，休息日也算在日历编号中。",
      "当天页数达到或超过 daily_target 就计为达标。最后按样例格式输出一行达标天数。",
    ],
    starterCode:
      "# 题目已提供 day_count、first_pages、daily_target 和 rest_day。\n\n# 按顺序检查每一天，最后输出达标天数。\n",
    cases: [
      {
        label: "有休息日的阅读计划",
        setup:
          "day_count = 6\nfirst_pages = 10\ndaily_target = 16\nrest_day = 5",
        expectedOutput: "达标 2 天",
      },
      {
        label: "唯一达标日恰好休息",
        setup:
          "day_count = 4\nfirst_pages = 12\ndaily_target = 18\nrest_day = 4",
        expectedOutput: "达标 0 天",
      },
      {
        label: "第一天恰好达到目标",
        setup:
          "day_count = 1\nfirst_pages = 18\ndaily_target = 18\nrest_day = 0",
        expectedOutput: "达标 1 天",
      },
    ],
  },
};
