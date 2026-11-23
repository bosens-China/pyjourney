export type PythonCase = {
  label: string;
  setup: string;
  expectedOutput?: string;
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
};

export type PythonWorkerReply =
  | { type: "ready" }
  | { type: "complete"; results: PythonResult[] }
  | { type: "unavailable" };
