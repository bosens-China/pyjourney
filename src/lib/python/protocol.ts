export type PythonCase = {
  label: string;
  setup: string;
  expectedOutput?: string;
};

/**
 * `test` 是一个 Python 表达式，对读者代码的语法树求值。可用的名字：
 * `ast`、`tree`、`nodes(kind)`、`has(kind)`、`name_of(node)`、`calls(name)`。
 */
export type PythonCheck = {
  test: string;
  message: string;
};

export type PythonResult = {
  stdout: string;
  stderr: string;
  truncated: boolean;
  error?: string;
};

export type PythonWorkerRequest = {
  code: string;
  setups: string[];
  checks: PythonCheck[];
};

export type PythonWorkerReply =
  | { type: "ready" }
  | {
      type: "complete";
      results: PythonResult[];
      checks: boolean[] | null;
    }
  | { type: "unavailable" };
