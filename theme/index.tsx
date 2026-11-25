import { useLocation } from "@rspress/core/runtime";
import {
  HomeLayout as DefaultHomeLayout,
  type HomeLayoutProps,
} from "@rspress/core/theme-original";
import HomeContent from "@/content/docs/index.mdx";
import { chapters } from "@/data/chapters";
import { getCustomMDXComponent } from "./runnable-code";

export { CodeButtonGroup, getCustomMDXComponent } from "./runnable-code";

const appendix = { link: "/engineering", text: "附录：工程实践" };

const lessonPages = [
  { link: "/preface", text: "前言" },
  ...chapters.flatMap(({ lessons }) =>
    lessons.map(({ slug, label }) => ({ link: `/${slug}`, text: label })),
  ),
  appendix,
];

const canonicalPath = (path: string) =>
  path
    .replace(/\/index\.html$/, "/")
    .replace(/\.html$/, "")
    .replace(/\/+$/, "") || "/";

export function HomeLayout(props: HomeLayoutProps) {
  return (
    <DefaultHomeLayout
      {...props}
      beforeFeatures={
        <div className="mx-auto max-w-6xl px-5 pb-10 sm:px-10">
          <section className="rp-doc max-w-2xl" aria-label="Python 示例">
            <HomeContent components={getCustomMDXComponent()} />
          </section>
        </div>
      }
    />
  );
}

export function usePrevNextPage() {
  const { pathname } = useLocation();
  const path = canonicalPath(pathname);
  const lessonIndex = lessonPages.findIndex(({ link }) => link === path);

  if (lessonIndex >= 0) {
    return {
      prevPage: lessonIndex > 0 ? lessonPages[lessonIndex - 1] : null,
      nextPage: lessonPages[lessonIndex + 1] ?? null,
    };
  }

  const challengeIndex = chapters.findIndex(
    (chapter) => path === `/challenge/${chapter.id}`,
  );
  if (challengeIndex >= 0) {
    const lastLesson = chapters[challengeIndex].lessons.at(-1);
    const nextLesson = chapters[challengeIndex + 1]?.lessons[0];
    return {
      prevPage: lastLesson
        ? { link: `/${lastLesson.slug}`, text: lastLesson.label }
        : null,
      nextPage: nextLesson
        ? { link: `/${nextLesson.slug}`, text: nextLesson.label }
        : appendix,
    };
  }

  return { prevPage: null, nextPage: null };
}

export * from "@rspress/core/theme-original";
