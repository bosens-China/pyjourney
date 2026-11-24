type MetaItem = { type: string; name?: string; label: string };

export function lessonsOf(chapterId: string, meta: MetaItem[]) {
  return meta.flatMap(({ type, name, label }) =>
    type === "file" && name ? [{ slug: `${chapterId}/${name}`, label }] : [],
  );
}
