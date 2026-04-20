import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"

import { SiteLayout } from "@/components/Site/SiteLayout"
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
    <SiteLayout
      currentPath="/speakers"
      sharedEntries={sharedEntries}
      sidebar={
        <section className="content-info-box border border-[#dbdbdb] bg-[#fafafa]">
          <h3>{asText(page.notes_title, "Notes")}</h3>
          <p className="mt-4 text-sm leading-7 text-[#5f5f5f]">
            {asText(page.notes_body)}
          </p>
        </section>
      }
    >
      <div className="space-y-8">
        <section className="rounded-[2rem] bg-[linear-gradient(135deg,_rgba(28,25,23,0.96),_rgba(12,10,9,0.92))] p-8 shadow-2xl">
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

        <section className="space-y-6">
          <section className="rounded-[1.5rem] border border-[#dbdbdb] bg-white p-6">
            <h3 className="font-serif text-2xl text-[#1f1f1f]">
              {asText(page.intro_title, "Featured guests")}
            </h3>
            <p className="mt-4 text-sm leading-7 text-[#5f5f5f]">
              {asText(page.intro_body)}
            </p>
          </section>

          <section className="rounded-[1.5rem] border border-[#dbdbdb] bg-white p-6">
            <h3 className="font-serif text-2xl text-[#1f1f1f]">
              {asText(page.speakers_title, "Speaker list")}
            </h3>
            <ul className="mt-4 grid gap-3">
              {speakers.map((speaker) => (
                <li
                  key={speaker}
                  className="rounded-2xl border border-[#dbdbdb] bg-[#f8f8f8] px-4 py-4 text-sm leading-7 text-[#333]"
                >
                  {speaker}
                </li>
              ))}
            </ul>
          </section>
        </section>
      </div>
    </SiteLayout>
  )
}
