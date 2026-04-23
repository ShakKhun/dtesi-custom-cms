import type { ContentValue, PageSection } from "./content-api"

export type SectionField = {
  key: string
  label: string
  type: "text" | "textarea" | "list"
}

export type SectionTemplate = {
  kind: string
  label: string
  description: string
  fields: SectionField[]
  defaultTitle: string
  defaultContent: Record<string, ContentValue>
}

export const SECTION_TEMPLATES: SectionTemplate[] = [
  {
    kind: "hero",
    label: "Hero",
    description: "Large opening block with title, subtitle, badges, and note.",
    defaultTitle: "Hero Section",
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "text" },
      { key: "title", label: "Title", type: "text" },
      { key: "subtitle", label: "Subtitle", type: "textarea" },
      { key: "badges", label: "Badges", type: "list" },
      { key: "note", label: "Note", type: "text" },
    ],
    defaultContent: {
      eyebrow: "New page",
      title: "Page title",
      subtitle: "Describe the page here.",
      badges: [],
      note: "",
    },
  },
  {
    kind: "text",
    label: "Text Block",
    description: "Standard content card with heading and paragraph text.",
    defaultTitle: "Text Section",
    fields: [
      { key: "heading", label: "Heading", type: "text" },
      { key: "body", label: "Body", type: "textarea" },
    ],
    defaultContent: {
      heading: "Section heading",
      body: "Add your content here.",
    },
  },
  {
    kind: "list",
    label: "List Block",
    description: "Section with heading and one item per line.",
    defaultTitle: "List Section",
    fields: [
      { key: "heading", label: "Heading", type: "text" },
      { key: "items", label: "Items", type: "list" },
    ],
    defaultContent: {
      heading: "List heading",
      items: ["First item", "Second item"],
    },
  },
  {
    kind: "callout",
    label: "Callout",
    description:
      "Highlighted block for submission notes, reminders, or notices.",
    defaultTitle: "Callout Section",
    fields: [
      { key: "heading", label: "Heading", type: "text" },
      { key: "body", label: "Body", type: "textarea" },
      { key: "badge", label: "Badge text", type: "text" },
    ],
    defaultContent: {
      heading: "Important note",
      body: "Add the important message here.",
      badge: "",
    },
  },
]

export function getSectionTemplate(kind: string) {
  return SECTION_TEMPLATES.find((template) => template.kind === kind)
}

export function getSectionFields(
  section: Pick<PageSection, "kind"> | { kind: string },
) {
  return getSectionTemplate(section.kind)?.fields ?? []
}

export function serializeSectionValue(value: ContentValue | undefined) {
  if (Array.isArray(value)) {
    return value.join("\n")
  }
  return value ?? ""
}

export function deserializeSectionValue(
  value: string,
  type: SectionField["type"],
): ContentValue {
  if (type === "list") {
    return value
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean)
  }
  return value
}
