import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { CalendarDays, MapPin, ScrollText } from "lucide-react"

import { SiteLayout } from "@/components/Site/SiteLayout"
import { getContentBundle } from "@/lib/content-api"
import { asText, asTextList, getSharedContentEntries } from "@/lib/site-content"

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      {
        title: "DTESI Conference",
      },
    ],
  }),
})

function HomePage() {
  const { data } = useQuery({
    queryKey: ["contentBundle", "home"],
    queryFn: () => getContentBundle("home"),
  })

  const page = data?.page?.content ?? {}
  const sharedEntries = getSharedContentEntries(data)

  const workshops = asTextList(page.workshops)
  const footer = sharedEntries.footer ?? {}

  return (
    <SiteLayout
      currentPath="/"
      sharedEntries={sharedEntries}
      sidebar={
        <section className="content-info-box border border-[#dbdbdb] bg-[#fafafa]">
          <h3>{asText(page.intro_title, "About the conference")}</h3>
          <p className="mt-4 text-sm leading-7 text-[#5f5f5f]">
            {asText(page.intro_body)}
          </p>
        </section>
      }
    >
      <div className="space-y-6">
        <section className="rounded-[2rem] bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.18),_transparent_35%),linear-gradient(135deg,_rgba(28,25,23,0.96),_rgba(12,10,9,0.92))] p-8 shadow-2xl">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-200/80">
            {asText(page.hero_title, "Conference")}
          </p>
          <h2 className="mt-3 max-w-4xl font-serif text-4xl leading-tight text-white sm:text-5xl">
            {asText(
              page.hero_subtitle,
              "Digital Technologies in Education, Science and Industry",
            )}
          </h2>
          <div className="mt-6 flex flex-wrap gap-4 text-sm text-stone-200">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2">
              <CalendarDays className="size-4" />
              {asText(page.hero_date, "November 19-20, 2025, Almaty")}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2">
              <MapPin className="size-4" />
              {asText(footer.location_value, "Almaty, Kazakhstan")}
            </span>
          </div>
          <p className="mt-8 max-w-3xl text-base leading-8 text-stone-300">
            {asText(
              page.intro_body,
              "The conference brings together scientists, lecturers, and researchers to discuss the latest scientific results in the digital development of society.",
            )}
          </p>
          <p className="mt-4 text-sm font-medium tracking-wide text-amber-200">
            {asText(page.anniversary_note)}
          </p>
        </section>

        <div className="grid gap-6 xl:grid-cols-2">
          <section className="rounded-[1.5rem] border border-[#dbdbdb] bg-white p-6">
            <h3 className="font-serif text-2xl text-[#1f1f1f]">
              {asText(page.workshops_title, "Conference workshops")}
            </h3>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-[#5f5f5f]">
              {workshops.map((workshop) => (
                <li
                  key={workshop}
                  className="rounded-2xl bg-[#f5f5f5] px-4 py-3"
                >
                  {workshop}
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-[1.5rem] border border-[#dbdbdb] bg-white p-6">
            <h3 className="font-serif text-2xl text-[#1f1f1f]">
              {asText(page.submission_title, "Submission")}
            </h3>
            <p className="mt-4 text-sm leading-7 text-[#5f5f5f]">
              {asText(page.submission_body)}
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#ead8a4] bg-[#fff7df] px-4 py-2 text-sm text-[#6b5a20]">
              <ScrollText className="size-4" />
              Template and submission links can be added next
            </div>
          </section>
        </div>

        <section className="rounded-[1.5rem] border border-[#dbdbdb] bg-white p-6">
          <h3 className="font-serif text-2xl text-[#1f1f1f]">
            {asText(page.venue_title, "Venue")}
          </h3>
          <p className="mt-4 text-sm leading-7 text-[#5f5f5f]">
            {asText(page.venue_body)}
          </p>
        </section>
      </div>
    </SiteLayout>
  )
}
