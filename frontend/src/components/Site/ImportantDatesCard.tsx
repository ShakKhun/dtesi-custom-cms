import { asText, asTextList, type SharedContentEntries } from "@/lib/site-content"

type Props = {
  sharedEntries: SharedContentEntries
}

export function ImportantDatesCard({ sharedEntries }: Props) {
  const dates = sharedEntries["important-dates"] ?? {}
  const items = asTextList(dates.items)

  return (
    <section className="rounded-[1.5rem] border border-white/10 bg-amber-300/10 p-6">
      <h3 className="font-serif text-2xl text-white">
        {asText(dates.title, "Important dates")}
      </h3>
      <ul className="mt-4 space-y-3 text-sm leading-7 text-amber-50/90">
        {items.map((item) => (
          <li key={item} className="border-b border-white/10 pb-3 last:border-0">
            {item}
          </li>
        ))}
      </ul>
    </section>
  )
}
