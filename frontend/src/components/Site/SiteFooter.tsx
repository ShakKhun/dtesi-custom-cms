import { asText, type SharedContentEntries } from "@/lib/site-content";

type Props = {
	sharedEntries: SharedContentEntries;
};

export function SiteFooter({ sharedEntries }: Props) {
	const footer = sharedEntries.footer ?? {};

	return (
		// <footer className="border-t border-white/10 bg-stone-950">
		//   <div className="mx-auto grid max-w-7xl gap-4 px-6 py-8 text-sm text-stone-400 md:grid-cols-3">
		//     <p>{asText(footer.copyright_text, "DTESI Conference")}</p>
		//     <p>
		//       {asText(footer.contact_label, "Contact")}:{" "}
		//       {asText(footer.contact_value, "dtesi@iitu.edu.kz")}
		//     </p>
		//     <p>
		//       {asText(footer.location_label, "Location")}:{" "}
		//       {asText(footer.location_value, "Almaty, Kazakhstan")}
		//     </p>
		//   </div>
		// </footer>

		<div className="container">
			<div id="footer">
				<p className="left">
					© DTESI 2024 | <a href="iitu.edu.kz">IITU</a> All rights reserved
				</p>

				<p className="right"></p>

				<div className="cl"></div>
			</div>
		</div>
	);
}
