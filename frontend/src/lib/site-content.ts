import type { ContentBundle, ContentValue } from "@/lib/content-api"

export type ContentMap = Record<string, ContentValue>
export type SharedContentEntries = Record<string, ContentMap>

export function getSharedContentEntries(bundle?: ContentBundle | null): SharedContentEntries {
  return Object.fromEntries(
    (bundle?.shared ?? []).map((block) => [block.slug, block.content]),
  )
}

export function asText(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback
}

export function asTextList(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : []
}
