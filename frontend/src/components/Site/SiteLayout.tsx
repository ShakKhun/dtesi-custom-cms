import type { ReactNode } from "react"

import type { SitePage } from "@/lib/content-api"
import type { SharedContentEntries } from "@/lib/site-content"
import { cn } from "@/lib/utils"

import { ImportantDatesCard } from "./ImportantDatesCard"
import { SiteFooter } from "./SiteFooter"
import { SiteHeader } from "./SiteHeader"

type Props = {
  children: ReactNode
  currentPath: string
  navigationPages: SitePage[]
  sharedEntries: SharedContentEntries
  sidebar?: ReactNode
  contentClassName?: string
  mainClassName?: string
  sidebarClassName?: string
}

export function SiteLayout({
  children,
  currentPath,
  navigationPages,
  sharedEntries,
  sidebar,
  contentClassName,
  mainClassName,
  sidebarClassName,
}: Props) {
  return (
    <div className="min-h-screen bg-[#f1f1f1] text-[#333]">
      <div className="main-container">
        <SiteHeader
          currentPath={currentPath}
          navigationPages={navigationPages}
          sharedEntries={sharedEntries}
        />

        <main
          className={cn(
            "flex flex-col gap-10 px-6 pb-10 lg:flex-row lg:px-10",
            mainClassName,
          )}
        >
          <section className={cn("min-w-0 flex-1 pt-8", contentClassName)}>
            {children}
          </section>

          <aside
            className={cn(
              "w-full space-y-6 lg:max-w-[300px] lg:shrink-0 lg:border-l lg:border-[#dbdbdb] pt-8 ",
              sidebarClassName,
            )}
          >
            <ImportantDatesCard sharedEntries={sharedEntries} />
            {sidebar}
          </aside>
        </main>
      </div>

      <SiteFooter sharedEntries={sharedEntries} />
    </div>
  )
}
