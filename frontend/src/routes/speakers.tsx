import { createFileRoute } from "@tanstack/react-router"

import { SitePageScreen } from "@/components/Site/SitePageScreen"

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
  return <SitePageScreen pageSlug="speakers" currentPath="/speakers" />
}
