import { createFileRoute } from "@tanstack/react-router"

import { SitePageScreen } from "@/components/Site/SitePageScreen"

export const Route = createFileRoute("/$slug")({
  component: DynamicPage,
})

function DynamicPage() {
  const { slug } = Route.useParams()

  return <SitePageScreen pageSlug={slug} currentPath={`/${slug}`} />
}
