import {
	asText,
	asTextList,
	type SharedContentEntries,
} from "@/lib/site-content";

type Props = {
	sharedEntries: SharedContentEntries;
};

export function ImportantDatesCard({ sharedEntries }: Props) {
	const dates = sharedEntries["important-dates"] ?? {};
	const items = asTextList(dates.items);

	return (
		// <section >
		//   <h3 >
		//     {asText(dates.title, "Important dates")}
		//   </h3>
		// <ul className="mt-4 space-y-3 text-sm leading-7 text-amber-50/90">
		//   {items.map((item) => (
		//     <li key={item} className="border-b border-white/10 pb-3 last:border-0">
		//       {item}
		//     </li>
		//   ))}
		// </ul>
		// </section>
		<div className="info">
			<div className="info-box">
				<h3 className="border-bottom pb-2 mb-3">{asText(dates.title, "Important dates")}</h3>
				<div className="info-content">
					{items.map((item) => (
						<div className="info-item" key={item}>
							{item}
						</div>
					))}
				</div>
				{/* <div className="info-content">
					<div className="info-item">
						Submission deadline:
						<b>
							<strike> August 18 </strike>September 14, 2025
						</b>
					</div>
					<div className="info-item">
						Acceptance Notifications:
						<b>
							<strike> September 30 </strike>, November 3, 2025
						</b>
					</div>
					<div className="info-item">
						Registration and payment:
						<b>
							<strike>October 7</strike>, November 9, 2025
						</b>
					</div>
				</div> */}
			</div>
		</div>
	);
}
