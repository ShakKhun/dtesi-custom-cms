import { createFileRoute } from "@tanstack/react-router"

import { SitePageScreen } from "@/components/Site/SitePageScreen"

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
  return <SitePageScreen pageSlug="home" currentPath="/" />
}
