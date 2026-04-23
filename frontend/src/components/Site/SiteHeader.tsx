import { Link } from "@tanstack/react-router";

import type { SitePage } from "@/lib/content-api";
import { asText, type SharedContentEntries } from "@/lib/site-content";

type Props = {
	currentPath: string;
	navigationPages: SitePage[];
	sharedEntries: SharedContentEntries;
};

export function SiteHeader({
	currentPath,
	navigationPages,
	sharedEntries,
}: Props) {
	const header = sharedEntries.header ?? {};

	const navItems = navigationPages.filter((page) => page.show_in_navigation);

	return (
		<header className="">
			{/* <div className="flex flex-col gap-5 px-1 py-6 lg:flex-row lg:items-start lg:justify-between">
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
			</div> */}

			<nav aria-label="Primary">
				{navItems.map((item) => {
					const isHome = item.is_home;
					const isActive = isHome
						? currentPath === "/"
						: currentPath === `/${item.slug}`;

					if (isHome) {
						return (
							<Link
								key={item.id}
								to="/"
								className={isActive ? "nav-active" : undefined}
							>
								<div>{item.navigation_title}</div>
							</Link>
						);
					}

					return (
						<Link
							key={item.id}
							to="/$slug"
							params={{ slug: item.slug }}
							className={isActive ? "nav-active" : undefined}
						>
							<div>{item.navigation_title}</div>
						</Link>
					);
				})}

				<Link
					to="/login"
					className=""
				>
					Admin login
				</Link>
			</nav>
		</header>
	);
}
