import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"

import { ImportantDatesCard } from "@/components/Site/ImportantDatesCard"
import { SiteFooter } from "@/components/Site/SiteFooter"
import { SiteHeader } from "@/components/Site/SiteHeader"
import { getContentBundle } from "@/lib/content-api"
import { asText, asTextList, getSharedContentEntries } from "@/lib/site-content"

export const Route = createFileRoute("/speakers")({
  component: SpeakersPage,
  head: () => ({
    meta: [
      {
        title: "Speakers - DTESI Conference",
      },
    ],
  }),
})

function SpeakersPage() {
  const { data } = useQuery({
    queryKey: ["contentBundle", "speakers"],
    queryFn: () => getContentBundle("speakers"),
  })

  const page = data?.page?.content ?? {}
  const sharedEntries = getSharedContentEntries(data)

  const speakers = asTextList(page.speakers)

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      <SiteHeader currentPath="/speakers" sharedEntries={sharedEntries} />

      <main className="mx-auto max-w-7xl space-y-8 px-6 py-10">
        <section className="rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,_rgba(28,25,23,0.96),_rgba(12,10,9,0.92))] p-8 shadow-2xl">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-200/80">
            {asText(page.hero_title, "Speakers")}
          </p>
          <h2 className="mt-3 max-w-4xl font-serif text-4xl leading-tight text-white sm:text-5xl">
            {asText(
              page.hero_subtitle,
              "Meet the invited speakers and guests of DTESI 2025.",
            )}
          </h2>
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6">
            <section className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6">
              <h3 className="font-serif text-2xl text-white">
                {asText(page.intro_title, "Featured guests")}
              </h3>
              <p className="mt-4 text-sm leading-7 text-stone-300">
                {asText(page.intro_body)}
              </p>
            </section>

            <section className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6">
              <h3 className="font-serif text-2xl text-white">
                {asText(page.speakers_title, "Speaker list")}
              </h3>
              <ul className="mt-4 grid gap-3">
                {speakers.map((speaker) => (
                  <li
                    key={speaker}
                    className="rounded-2xl border border-white/10 bg-stone-900/70 px-4 py-4 text-sm leading-7 text-stone-200"
                  >
                    {speaker}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <aside className="space-y-6">
            <ImportantDatesCard sharedEntries={sharedEntries} />

            <section className="rounded-[1.5rem] border border-white/10 bg-amber-300/10 p-6">
              <h3 className="font-serif text-2xl text-white">
                {asText(page.notes_title, "Notes")}
              </h3>
              <p className="mt-4 text-sm leading-7 text-amber-50/90">
                {asText(page.notes_body)}
              </p>
            </section>
          </aside>
        </section>
      </main>

      <SiteFooter sharedEntries={sharedEntries} />
    </div>
  )
}
