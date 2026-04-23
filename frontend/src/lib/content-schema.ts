import type { ContentBlock, ContentValue } from "./content-api"

export type ContentField = {
  key: string
  label: string
  type: "text" | "textarea" | "list"
}

export const CONTENT_FIELDS: Record<string, ContentField[]> = {
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
}

export function getContentFieldKey(
  block: Pick<ContentBlock, "scope" | "slug">,
) {
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
