import { useQuery } from "@tanstack/react-query"
import { LoaderCircle } from "lucide-react"

import NotFound from "@/components/Common/NotFound"
import { getContentBundle } from "@/lib/content-api"
import { getSharedContentEntries } from "@/lib/site-content"

import { SiteLayout } from "./SiteLayout"
import { SitePageSections } from "./SitePageSections"

type Props = {
  pageSlug: string
  currentPath: string
}

export function SitePageScreen({ pageSlug, currentPath }: Props) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["contentBundle", pageSlug],
    queryFn: () => getContentBundle(pageSlug),
  })

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f1f1f1]">
        <LoaderCircle className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (isError || !data?.page) {
    return <NotFound />
  }

  const sharedEntries = getSharedContentEntries(data)

  return (
    <SiteLayout
      currentPath={currentPath}
      navigationPages={data.navigation}
      sharedEntries={sharedEntries}
    >
      <SitePageSections sections={data.sections} />
    </SiteLayout>
  )
}
