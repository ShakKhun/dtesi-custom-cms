import { OpenAPI } from "@/client"

export type ContentValue = string | string[]

export type ContentBlock = {
  id: string
  scope: string
  slug: string
  title: string
  content: Record<string, ContentValue>
  created_at?: string | null
  updated_at?: string | null
}

export type SitePage = {
  id: string
  slug: string
  title: string
  navigation_title: string
  show_in_navigation: boolean
  navigation_order: number
  is_home: boolean
  created_at?: string | null
  updated_at?: string | null
}

export type PageSection = {
  id: string
  page_id: string
  kind: string
  title: string
  position: number
  content: Record<string, ContentValue>
  created_at?: string | null
  updated_at?: string | null
}

export type CmsPage = SitePage & {
  sections: PageSection[]
}

export type CmsAdminData = {
  shared: ContentBlock[]
  pages: CmsPage[]
}

export type ContentBundle = {
  page: SitePage | null
  sections: PageSection[]
  shared: ContentBlock[]
  navigation: SitePage[]
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

export function getCmsAdminData() {
  return request<CmsAdminData>("/api/v1/content-blocks/admin")
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

export function createSitePage(payload: {
  slug: string
  title: string
  navigation_title: string
  show_in_navigation: boolean
  navigation_order: number
  is_home: boolean
}) {
  return request<SitePage>("/api/v1/content-blocks/pages", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export function updateSitePage(
  pageId: string,
  payload: Partial<{
    slug: string
    title: string
    navigation_title: string
    show_in_navigation: boolean
    navigation_order: number
    is_home: boolean
  }>,
) {
  return request<SitePage>(`/api/v1/content-blocks/pages/${pageId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  })
}

export function createPageSection(
  pageId: string,
  payload: {
    kind: string
    title: string
    position: number
    content: Record<string, ContentValue>
  },
) {
  return request<PageSection>(
    `/api/v1/content-blocks/pages/${pageId}/sections`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  )
}

export function updatePageSection(
  sectionId: string,
  payload: Partial<{
    kind: string
    title: string
    position: number
    content: Record<string, ContentValue>
  }>,
) {
  return request<PageSection>(`/api/v1/content-blocks/sections/${sectionId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  })
}

export function deletePageSection(sectionId: string) {
  return request<{ message: string }>(
    `/api/v1/content-blocks/sections/${sectionId}`,
    {
      method: "DELETE",
    },
  )
}
