import { asText, type SharedContentEntries } from "@/lib/site-content"

type Props = {
  sharedEntries: SharedContentEntries
}

export function SiteFooter({ sharedEntries }: Props) {
  const footer = sharedEntries.footer ?? {}

  return (
    <div className="container">
      <div
        id="footer"
        className="flex flex-col gap-2 text-left sm:flex-row sm:items-center sm:justify-between"
      >
        <p>
          {asText(footer.copyright_text, "(c) DTESI Conference")} |{" "}
          <a href="https://iitu.edu.kz">IITU</a>
        </p>

        <p>
          {asText(footer.contact_label, "Contact")}:{" "}
          {asText(footer.contact_value, "dtesi@iitu.edu.kz")}
        </p>
      </div>
    </div>
  )
}
