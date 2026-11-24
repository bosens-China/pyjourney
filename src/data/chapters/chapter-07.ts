import meta from "@/content/docs/chapter-07/_meta.json";
import { lessonsOf } from "../lessons.ts";

export const chapter07 = {
  id: "chapter-07",
  label: "第 7 章 · 类与类型",
  lessons: lessonsOf("chapter-07", meta),
  challenge: {
    starterCode:
      "from dataclasses import dataclass, FrozenInstanceError\n\n# 已给定：rows 是一组 (名称, 单价, 数量)\n\n# TODO 1：定义冻结的数据类 Item，字段依次是 name: str、price: int、qty: int\n# TODO 2：给 Item 加一个方法 total()，返回 price * qty\n\nitems = [Item(name, price, qty) for name, price, qty in rows]\nfor item in items:\n    print(f'{item.name} x{item.qty} = {item.total()}')\nprint(f'合计 {sum([item.total() for item in items])}')\n\ntry:\n    items[0].qty = 99\nexcept FrozenInstanceError:\n    print('订单项不可修改')\n",
    solution:
      "from dataclasses import dataclass, FrozenInstanceError\n\n@dataclass(frozen=True, slots=True)\nclass Item:\n    name: str\n    price: int\n    qty: int\n\n    def total(self) -> int:\n        return self.price * self.qty\n\nitems = [Item(name, price, qty) for name, price, qty in rows]\nfor item in items:\n    print(f'{item.name} x{item.qty} = {item.total()}')\nprint(f'合计 {sum([item.total() for item in items])}')\n\ntry:\n    items[0].qty = 99\nexcept FrozenInstanceError:\n    print('订单项不可修改')\n",
    checks: [
      {
        message: "用 @dataclass(frozen=True) 装饰 Item",
        test: "any(c.name == 'Item' and any(isinstance(d, ast.Call) and name_of(d) == 'dataclass' and any(k.arg == 'frozen' and getattr(k.value, 'value', None) is True for k in d.keywords) for d in c.decorator_list) for c in nodes(ast.ClassDef))",
      },
      {
        message: "字段依次标注为 name: str、price: int、qty: int",
        test: "any(c.name == 'Item' and [(name_of(s.target), name_of(s.annotation)) for s in c.body if isinstance(s, ast.AnnAssign)] == [('name', 'str'), ('price', 'int'), ('qty', 'int')] for c in nodes(ast.ClassDef))",
      },
      {
        message: "不手写 __init__，交给数据类生成",
        test: "not any(f.name == '__init__' for f in nodes(ast.FunctionDef))",
      },
    ],
    cases: [
      {
        label: "两份订单项",
        setup: "rows = [('手册', 30, 2), ('键盘', 200, 1)]",
        expectedOutput: "手册 x2 = 60\n键盘 x1 = 200\n合计 260\n订单项不可修改",
      },
      {
        label: "一份订单项",
        setup: "rows = [('笔', 5, 10)]",
        expectedOutput: "笔 x10 = 50\n合计 50\n订单项不可修改",
      },
    ],
  },
};
