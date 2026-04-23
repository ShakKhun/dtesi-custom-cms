import { asText, type SharedContentEntries } from "@/lib/site-content";

type Props = {
	sharedEntries: SharedContentEntries;
};

export function SiteFooter({ sharedEntries }: Props) {
	const footer = sharedEntries.footer ?? {};

	return (
		<div className="container">
			<div
				id="footer"
				className=""
			>
				{/* <p>
					{asText(footer.copyright_text, "(c) DTESI Conference")} |{" "}
					<a href="https://iitu.edu.kz">IITU</a>
				</p>

				<p>
					{asText(footer.contact_label, "Contact")}:{" "}
					{asText(footer.contact_value, "dtesi@iitu.edu.kz")}
				</p> */}
				<p className="left">
					© DTESI 2024 | <a href="iitu.edu.kz">IITU</a> All rights reserved
				</p>

				<p className="right"></p>

				<div className="cl"></div>
			</div>
		</div>
	);
}
