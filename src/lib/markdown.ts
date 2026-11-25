export function markdownCodeBlock(code: string, language = "python") {
  const longestRun = (code.match(/`+/g) ?? []).reduce(
    (longest, run) => Math.max(longest, run.length),
    2,
  );
  const fence = "`".repeat(longestRun + 1);
  return `${fence}${language}\n${code}${code.endsWith("\n") ? "" : "\n"}${fence}`;
}
