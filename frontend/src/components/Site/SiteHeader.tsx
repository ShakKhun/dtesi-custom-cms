import { Link } from "@tanstack/react-router"

import { asText, type SharedContentEntries } from "@/lib/site-content"

type Props = {
  currentPath: "/" | "/speakers"
  sharedEntries: SharedContentEntries
}

export function SiteHeader({ currentPath, sharedEntries }: Props) {
  const navigation = sharedEntries.navigation ?? {}
  const header = sharedEntries.header ?? {}

  const navItems = [
    { label: asText(navigation.home_label), to: "/" as const },
    { label: asText(navigation.speakers_label), to: "/speakers" as const },
    { label: asText(navigation.registration_label), to: undefined },
    { label: asText(navigation.program_label), to: undefined },
    { label: asText(navigation.venue_label), to: undefined },
    { label: asText(navigation.proceedings_label), to: undefined },
  ].filter((item) => item.label.length > 0)

  return (
    <header className="border-b border-white/10 bg-stone-950/90 backdrop-blur">
      <h1>hello</h1>
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.35em] text-amber-300/80">
            {asText(header.eyebrow, "International Conference")}
          </p>
          <div>
            <h1 className="font-serif text-2xl text-white sm:text-3xl">
              {asText(header.site_name, "DTESI 2025")}
            </h1>
            <p className="max-w-2xl text-sm text-stone-300 sm:text-base">
              {asText(
                header.tagline,
                "Digital Technologies in Education, Science and Industry",
              )}
            </p>
          </div>
        </div>

        <nav className="flex flex-wrap gap-2 text-sm text-stone-300">
          {navItems.map((item) => {
            if (!item.to) {
              return (
                <span
                  key={item.label}
                  className="rounded-full border border-white/10 px-3 py-1.5"
                >
                  {item.label}
                </span>
              )
            }

            const isActive = item.to === currentPath

            return (
              <Link
                key={item.label}
                to={item.to}
                className={
                  isActive
                    ? "rounded-full bg-amber-300 px-3 py-1.5 font-medium text-stone-950"
                    : "rounded-full border border-white/10 px-3 py-1.5 hover:bg-white/5"
                }
              >
                {item.label}
              </Link>
            )
          })}

          <Link
            to="/login"
            className="rounded-full border border-white/10 px-3 py-1.5 hover:bg-white/5"
          >
            Admin login
          </Link>
        </nav>
      </div>
    </header>
  )
}
