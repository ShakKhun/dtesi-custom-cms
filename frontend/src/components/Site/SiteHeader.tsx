import { Link } from "@tanstack/react-router"

import { asText, type SharedContentEntries } from "@/lib/site-content"

type Props = {
  currentPath: string
  sharedEntries: SharedContentEntries
}

export function SiteHeader({ currentPath, sharedEntries }: Props) {
  const navigation = sharedEntries.navigation ?? {}
  const header = sharedEntries.header ?? {}

  const navItems = [
    { label: asText(navigation.home_label, "Home"), to: "/" as const },
    {
      label: asText(navigation.speakers_label, "Speakers"),
      to: "/speakers" as const,
    },
    {
      label: asText(navigation.registration_label, "Registration"),
      to: undefined,
    },
    { label: asText(navigation.program_label, "Program"), to: undefined },
    { label: asText(navigation.venue_label, "Venue"), to: undefined },
    {
      label: asText(navigation.proceedings_label, "Proceedings"),
      to: undefined,
    },
  ].filter((item) => item.label.length > 0)

  return (
    <header className="px-6 pb-8 lg:px-10">
      <div className="flex flex-col gap-5 px-1 py-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#7f7f7f]">
            {asText(header.eyebrow, "International Conference")}
          </p>
          <div className="space-y-2">
            <h1 className="font-serif text-3xl leading-tight text-[#1f1f1f] sm:text-4xl">
              {asText(header.site_name, "DTESI 2025")}
            </h1>
            <p className="max-w-3xl text-sm leading-7 text-[#5f5f5f] sm:text-base">
              {asText(
                header.tagline,
                "Digital Technologies in Education, Science and Industry",
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center">
          <Link
            to="/login"
            className="inline-flex rounded border border-[#dbdbdb] px-4 py-2 text-sm font-semibold text-[#333] transition hover:bg-[#efefef]"
          >
            Admin login
          </Link>
        </div>
      </div>

      <nav aria-label="Primary">
        {navItems.map((item) => {
          if (!item.to) {
            return (
              <div
                key={item.label}
                className="cursor-default border-r border-[#dbdbdb] px-[25px] py-[15px]"
              >
                <div>{item.label}</div>
              </div>
            )
          }

          const isActive = item.to === currentPath

          return (
            <Link
              key={item.label}
              to={item.to}
              className={isActive ? "nav-active" : undefined}
            >
              <div>{item.label}</div>
            </Link>
          )
        })}
      </nav>
    </header>
  )
}
