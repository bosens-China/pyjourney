import { chapter02 } from "./chapters/chapter-02.ts";
import { chapter03 } from "./chapters/chapter-03.ts";
import { chapter04 } from "./chapters/chapter-04.ts";
import { chapter05 } from "./chapters/chapter-05.ts";
import { chapter06 } from "./chapters/chapter-06.ts";
import { chapter07 } from "./chapters/chapter-07.ts";
import { chapter08 } from "./chapters/chapter-08.ts";
import { chapter09 } from "./chapters/chapter-09.ts";
import { chapter10 } from "./chapters/chapter-10.ts";
import { chapter11 } from "./chapters/chapter-11.ts";
import { chapter12 } from "./chapters/chapter-12.ts";

export const chapters = [
  {
    id: "chapter-01",
    label: "第 1 章 · 值、变量与表达式",
    lessons: [
      { slug: "chapter-01/first-program", label: "1.1 运行第一行 Python" },
      { slug: "chapter-01/values-and-types", label: "1.2 值与类型" },
      { slug: "chapter-01/names-and-assignment", label: "1.3 名字与赋值" },
      {
        slug: "chapter-01/expressions-and-output",
        label: "1.4 表达式与格式化输出",
      },
    ],
    challenge: {
      title: "计算本周阅读进度",
      description:
        "给定前三天各自的阅读页数和本周目标。计算总页数与完成比例，并按样例格式输出。",
      instructions: [
        "把 monday、tuesday 和 wednesday 相加，得到总页数。",
        "把总页数除以 weekly_goal，得到完成比例。题目提供的目标页数都大于 0。",
        "用 f-string 把比例显示成整数百分比，并按样例格式输出一行。",
      ],
      starterCode:
        "# 题目已提供 monday、tuesday、wednesday 和 weekly_goal。\n\n# 在这里计算总页数和完成比例，再用 print() 输出一行进度。\n",
      cases: [
        {
          label: "样例阅读进度",
          setup: "monday = 18\ntuesday = 24\nwednesday = 30\nweekly_goal = 120",
          expectedOutput: "已读 72 页，完成 60%",
        },
        {
          label: "另一组阅读记录",
          setup: "monday = 11\ntuesday = 0\nwednesday = 30\nweekly_goal = 60",
          expectedOutput: "已读 41 页，完成 68%",
        },
        {
          label: "超过阅读目标",
          setup: "monday = 30\ntuesday = 40\nwednesday = 50\nweekly_goal = 100",
          expectedOutput: "已读 120 页，完成 120%",
        },
      ],
    },
  },
  chapter02,
  chapter03,
  chapter04,
  chapter05,
  chapter06,
  chapter07,
  chapter08,
  chapter09,
  chapter10,
  chapter11,
  chapter12,
];
