import type { ContentBlock, ContentValue } from "./content-api"

export type ContentField = {
  key: string
  label: string
  type: "text" | "textarea" | "list"
}

export const CONTENT_FIELDS: Record<string, ContentField[]> = {
  "shared/navigation": [
    { key: "home_label", label: "Home label", type: "text" },
    { key: "speakers_label", label: "Speakers label", type: "text" },
    { key: "registration_label", label: "Registration label", type: "text" },
    { key: "program_label", label: "Program label", type: "text" },
    { key: "venue_label", label: "Venue label", type: "text" },
    { key: "proceedings_label", label: "Proceedings label", type: "text" },
  ],
  "shared/header": [
    { key: "eyebrow", label: "Eyebrow", type: "text" },
    { key: "site_name", label: "Site name", type: "text" },
    { key: "tagline", label: "Tagline", type: "textarea" },
  ],
  "shared/footer": [
    { key: "copyright_text", label: "Copyright text", type: "text" },
    { key: "contact_label", label: "Contact label", type: "text" },
    { key: "contact_value", label: "Contact value", type: "text" },
    { key: "location_label", label: "Location label", type: "text" },
    { key: "location_value", label: "Location value", type: "text" },
  ],
  "shared/important-dates": [
    { key: "title", label: "Section title", type: "text" },
    { key: "items", label: "Items", type: "list" },
  ],
  "page/home": [
    { key: "hero_title", label: "Hero title", type: "text" },
    { key: "hero_subtitle", label: "Hero subtitle", type: "textarea" },
    { key: "hero_date", label: "Hero date", type: "text" },
    { key: "intro_title", label: "Intro title", type: "text" },
    { key: "intro_body", label: "Intro body", type: "textarea" },
    { key: "anniversary_note", label: "Anniversary note", type: "text" },
    { key: "workshops_title", label: "Workshops title", type: "text" },
    { key: "workshops", label: "Workshops", type: "list" },
    { key: "submission_title", label: "Submission title", type: "text" },
    { key: "submission_body", label: "Submission body", type: "textarea" },
    { key: "venue_title", label: "Venue title", type: "text" },
    { key: "venue_body", label: "Venue body", type: "textarea" },
  ],
  "page/speakers": [
    { key: "hero_title", label: "Hero title", type: "text" },
    { key: "hero_subtitle", label: "Hero subtitle", type: "textarea" },
    { key: "intro_title", label: "Intro title", type: "text" },
    { key: "intro_body", label: "Intro body", type: "textarea" },
    { key: "speakers_title", label: "Speakers title", type: "text" },
    { key: "speakers", label: "Speakers", type: "list" },
    { key: "notes_title", label: "Notes title", type: "text" },
    { key: "notes_body", label: "Notes body", type: "textarea" },
  ],
}

export function getContentFieldKey(block: Pick<ContentBlock, "scope" | "slug">) {
  return `${block.scope}/${block.slug}`
}

export function getEditableFields(block: Pick<ContentBlock, "scope" | "slug">) {
  return CONTENT_FIELDS[getContentFieldKey(block)] ?? []
}

export function serializeContentValue(value: ContentValue | undefined) {
  if (Array.isArray(value)) {
    return value.join("\n")
  }
  return value ?? ""
}

export function deserializeContentValue(
  value: string,
  type: ContentField["type"],
): ContentValue {
  if (type === "list") {
    return value
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean)
  }
  return value
}
