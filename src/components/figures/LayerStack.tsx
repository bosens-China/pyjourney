import { Card } from "@/components/ui/card";
interface Layer {
  title: string;
  items: string[];
  note: string;
}

interface LayerStackProps {
  label: string;
  layers: Layer[];
}

export default function LayerStack({ label, layers }: LayerStackProps) {
  if (import.meta.env.SSG_MD) {
    const items = layers.map(({ title, items, note }) => {
      const tools = items.map((item) => `\`${item}\``).join("、");
      return `- **${title}** ${tools}。${note}`;
    });
    return <>{`\n\n**${label}**\n\n${items.join("\n")}\n\n`}</>;
  }

  return (
    <Card asChild className="my-6 gap-3">
      <figure>
        <figcaption className="font-semibold text-rp-text">{label}</figcaption>
        <ol className="grid gap-2">
          {layers.map(({ title, items, note }, index) => (
            <li
              key={title}
              className="grid gap-2 rounded-lg border border-rp-line bg-rp-soft px-4 py-3 sm:grid-cols-[6rem_1fr] sm:items-center"
              style={{ marginInline: `${index * 0.75}rem` }}
            >
              <span className="text-sm font-semibold text-rp-brand">
                {title}
              </span>
              <div className="grid gap-1.5">
                <div className="flex flex-wrap gap-1.5">
                  {items.map((item) => (
                    <code
                      key={item}
                      className="rounded-md border border-rp-line bg-rp-surface px-2 py-0.5 font-rp-mono text-xs text-rp-text"
                    >
                      {item}
                    </code>
                  ))}
                </div>
                <p className="text-sm text-rp-muted">{note}</p>
              </div>
            </li>
          ))}
        </ol>
      </figure>
    </Card>
  );
}
