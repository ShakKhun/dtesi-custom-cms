import { OpenAPI } from "@/client"

export type ContentValue = string | string[]

export type ContentBlock = {
  id: string
  scope: "page" | "shared"
  slug: string
  title: string
  content: Record<string, ContentValue>
  created_at?: string | null
  updated_at?: string | null
}

export type ContentBundle = {
  page: ContentBlock | null
  shared: ContentBlock[]
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers)
  headers.set("Content-Type", "application/json")

  const token = localStorage.getItem("access_token")
  if (token) {
    headers.set("Authorization", `Bearer ${token}`)
  }

  const response = await fetch(`${OpenAPI.BASE}${path}`, {
    ...init,
    headers,
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null)
    const message =
      errorBody?.detail || `Request failed with status ${response.status}`
    throw new Error(message)
  }

  return response.json() as Promise<T>
}

export function getContentBundle(pageSlug: string) {
  return request<ContentBundle>(`/api/v1/content-blocks/bundle/${pageSlug}`)
}

export function getContentBlocks() {
  return request<{ data: ContentBlock[]; count: number }>(
    "/api/v1/content-blocks/",
  )
}

export function updateContentBlock(
  blockId: string,
  payload: { title: string; content: Record<string, ContentValue> },
) {
  return request<ContentBlock>(`/api/v1/content-blocks/${blockId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  })
}
