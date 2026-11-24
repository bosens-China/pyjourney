import { Link } from "@rspress/core/theme-original";
import { chapters } from "@/data/chapters";

export default function BookContents() {
  return (
    <section
      className="rp-not-doc mx-auto grid max-w-6xl gap-6 px-5 pt-4 pb-16 sm:px-10"
      aria-labelledby="book-contents"
    >
      <h2 id="book-contents" className="text-2xl font-semibold text-rp-text">
        目录
      </h2>
      <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {chapters.map(({ id, label, lessons }) => {
          const [number, title] = label.split(" · ");
          return (
            <li
              key={id}
              className="grid content-start gap-3 rounded-xl border border-rp-line bg-rp-surface p-5"
            >
              <div>
                <p className="text-xs text-rp-muted">{number}</p>
                <h3 className="text-lg font-semibold text-rp-text">{title}</h3>
              </div>
              <ol className="grid gap-1 text-sm">
                {lessons.map(({ slug, label: lesson }) => (
                  <li key={slug}>
                    <Link
                      href={`/${slug}`}
                      className="text-rp-muted hover:text-rp-brand"
                    >
                      {lesson}
                    </Link>
                  </li>
                ))}
              </ol>
              <Link
                href={`/challenge/${id}`}
                className="text-sm font-medium text-rp-brand"
              >
                章末挑战 →
              </Link>
            </li>
          );
        })}
        <li className="grid content-start gap-3 rounded-xl border border-rp-line bg-rp-surface p-5">
          <div>
            <p className="text-xs text-rp-muted">附录</p>
            <h3 className="text-lg font-semibold text-rp-text">工程实践</h3>
          </div>
          <p className="text-sm text-rp-muted">
            用 uv 管理 Python 和依赖，用 Ruff、ty、pytest
            检查代码，再把它们接进编辑器。
          </p>
          <Link
            href="/engineering"
            className="text-sm font-medium text-rp-brand"
          >
            阅读附录 →
          </Link>
        </li>
      </ol>
      <p className="text-sm text-rp-muted">
        全书以 Python 3.15 官方文档为准。页内练习运行在浏览器里的 Pyodide
        上，同样是 Python 3.15。
      </p>
    </section>
  );
}
