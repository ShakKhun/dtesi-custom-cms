import type { PageSection } from "@/lib/content-api"
import { asText, asTextList } from "@/lib/site-content"

type Props = {
  sections: PageSection[]
}

export function SitePageSections({ sections }: Props) {
  return (
    <div className="space-y-6">
      {sections.map((section) => {
        if (section.kind === "hero") {
          const badges = asTextList(section.content.badges)

          return (
            <section
              key={section.id}
              className="rounded-[2rem] bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.18),_transparent_35%),linear-gradient(135deg,_rgba(28,25,23,0.96),_rgba(12,10,9,0.92))] p-8 shadow-2xl"
            >
              <p className="text-sm uppercase tracking-[0.3em] text-amber-200/80">
                {asText(section.content.eyebrow, "Page")}
              </p>
              <h2 className="mt-3 max-w-4xl font-serif text-4xl leading-tight text-white sm:text-5xl">
                {asText(section.content.title)}
              </h2>
              {badges.length > 0 ? (
                <div className="mt-6 flex flex-wrap gap-3 text-sm text-stone-200">
                  {badges.map((badge) => (
                    <span
                      key={badge}
                      className="rounded-full border border-white/10 px-4 py-2"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              ) : null}
              {asText(section.content.subtitle) ? (
                <p className="mt-8 max-w-3xl text-base leading-8 text-stone-300">
                  {asText(section.content.subtitle)}
                </p>
              ) : null}
              {asText(section.content.note) ? (
                <p className="mt-4 text-sm font-medium tracking-wide text-amber-200">
                  {asText(section.content.note)}
                </p>
              ) : null}
            </section>
          )
        }

        if (section.kind === "list") {
          const items = asTextList(section.content.items)

          return (
            <section
              key={section.id}
              className="rounded-[1.5rem] border border-[#dbdbdb] bg-white p-6"
            >
              <h3 className="font-serif text-2xl text-[#1f1f1f]">
                {asText(section.content.heading, section.title)}
              </h3>
              <ul className="mt-4 grid gap-3">
                {items.map((item) => (
                  <li
                    key={item}
                    className="rounded-2xl border border-[#dbdbdb] bg-[#f8f8f8] px-4 py-4 text-sm leading-7 text-[#333]"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          )
        }

        if (section.kind === "callout") {
          return (
            <section
              key={section.id}
              className="rounded-[1.5rem] border border-[#ead8a4] bg-[#fff7df] p-6"
            >
              <h3 className="font-serif text-2xl text-[#4f4116]">
                {asText(section.content.heading, section.title)}
              </h3>
              <p className="mt-4 text-sm leading-7 text-[#6b5a20]">
                {asText(section.content.body)}
              </p>
              {asText(section.content.badge) ? (
                <div className="mt-6 inline-flex rounded-full border border-[#ead8a4] px-4 py-2 text-sm font-medium text-[#6b5a20]">
                  {asText(section.content.badge)}
                </div>
              ) : null}
            </section>
          )
        }

        return (
          <section
            key={section.id}
            className="rounded-[1.5rem] border border-[#dbdbdb] bg-white p-6"
          >
            <h3 className="font-serif text-2xl text-[#1f1f1f]">
              {asText(section.content.heading, section.title)}
            </h3>
            <p className="mt-4 text-sm leading-7 text-[#5f5f5f]">
              {asText(section.content.body)}
            </p>
          </section>
        )
      })}
    </div>
  )
}
