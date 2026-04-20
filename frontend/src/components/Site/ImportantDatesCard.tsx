import {
  asText,
  asTextList,
  type SharedContentEntries,
} from "@/lib/site-content"

type Props = {
  sharedEntries: SharedContentEntries
}

export function ImportantDatesCard({ sharedEntries }: Props) {
  const dates = sharedEntries["important-dates"] ?? {}
  const items = asTextList(dates.items)

  return (
    <section className="info">
      <div className="info-box">
        <h3 className="mb-3 border-bottom pb-2 text-xl font-semibold">
          {asText(dates.title, "Important dates")}
        </h3>
        <div className="info-content">
          {items.map((item) => (
            <div className="info-item" key={item}>
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
