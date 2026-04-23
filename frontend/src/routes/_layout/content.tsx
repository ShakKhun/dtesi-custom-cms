import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createFileRoute, redirect } from "@tanstack/react-router"
import { LoaderCircle } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

import { UsersService } from "@/client"
import { ContentEditorCard } from "@/components/Content/ContentEditorCard"
import { PageSectionEditorCard } from "@/components/Content/PageSectionEditorCard"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import useCustomToast from "@/hooks/useCustomToast"
import {
  type ContentValue,
  createPageSection,
  createSitePage,
  deletePageSection,
  getCmsAdminData,
  updateContentBlock,
  updatePageSection,
  updateSitePage,
} from "@/lib/content-api"
import {
  deserializeContentValue,
  getEditableFields,
} from "@/lib/content-schema"
import {
  deserializeSectionValue,
  getSectionTemplate,
  SECTION_TEMPLATES,
} from "@/lib/page-section-schema"

export const Route = createFileRoute("/_layout/content")({
  component: ContentRoute,
  beforeLoad: async () => {
    const user = await UsersService.readUserMe()
    if (!user.is_superuser) {
      throw redirect({
        to: "/dashboard",
      })
    }
  },
  head: () => ({
    meta: [
      {
        title: "CMS - FastAPI Template",
      },
    ],
  }),
})

function ContentRoute() {
  const queryClient = useQueryClient()
  const { showSuccessToast, showErrorToast } = useCustomToast()
  const [selectedPageId, setSelectedPageId] = useState<string>("")
  const [newPageSlug, setNewPageSlug] = useState("")
  const [newPageTitle, setNewPageTitle] = useState("")
  const [newPageNavigationTitle, setNewPageNavigationTitle] = useState("")
  const [newSectionKind, setNewSectionKind] = useState(
    SECTION_TEMPLATES[0]?.kind ?? "",
  )

  const { data, isLoading } = useQuery({
    queryKey: ["cmsAdminData"],
    queryFn: getCmsAdminData,
  })

  const pages = data?.pages ?? []
  const sharedBlocks = data?.shared ?? []

  useEffect(() => {
    if (!selectedPageId && pages[0]) {
      setSelectedPageId(pages[0].id)
    }
    if (
      selectedPageId &&
      !pages.some((page) => page.id === selectedPageId) &&
      pages[0]
    ) {
      setSelectedPageId(pages[0].id)
    }
  }, [pages, selectedPageId])

  const selectedPage = useMemo(
    () => pages.find((page) => page.id === selectedPageId) ?? null,
    [pages, selectedPageId],
  )

  const updateSharedMutation = useMutation({
    mutationFn: ({
      blockId,
      title,
      content,
    }: {
      blockId: string
      title: string
      content: Record<string, ContentValue>
    }) =>
      updateContentBlock(blockId, {
        title,
        content,
      }),
    onSuccess: () => {
      showSuccessToast("Shared content updated")
      queryClient.invalidateQueries({ queryKey: ["cmsAdminData"] })
      queryClient.invalidateQueries({ queryKey: ["contentBundle"] })
    },
    onError: (error) => {
      showErrorToast(error.message)
    },
  })

  const createPageMutation = useMutation({
    mutationFn: createSitePage,
    onSuccess: (page) => {
      showSuccessToast("Page created")
      setSelectedPageId(page.id)
      setNewPageSlug("")
      setNewPageTitle("")
      setNewPageNavigationTitle("")
      queryClient.invalidateQueries({ queryKey: ["cmsAdminData"] })
      queryClient.invalidateQueries({ queryKey: ["contentBundle"] })
    },
    onError: (error) => showErrorToast(error.message),
  })

  const updatePageMutation = useMutation({
    mutationFn: ({
      pageId,
      payload,
    }: {
      pageId: string
      payload: Parameters<typeof updateSitePage>[1]
    }) => updateSitePage(pageId, payload),
    onSuccess: () => {
      showSuccessToast("Page updated")
      queryClient.invalidateQueries({ queryKey: ["cmsAdminData"] })
      queryClient.invalidateQueries({ queryKey: ["contentBundle"] })
    },
    onError: (error) => showErrorToast(error.message),
  })

  const createSectionMutation = useMutation({
    mutationFn: ({ pageId, kind }: { pageId: string; kind: string }) => {
      const template = getSectionTemplate(kind)
      if (!template) {
        throw new Error("Section template not found")
      }

      return createPageSection(pageId, {
        kind: template.kind,
        title: template.defaultTitle,
        position: selectedPage?.sections.length ?? 0,
        content: template.defaultContent,
      })
    },
    onSuccess: () => {
      showSuccessToast("Section added")
      queryClient.invalidateQueries({ queryKey: ["cmsAdminData"] })
      queryClient.invalidateQueries({ queryKey: ["contentBundle"] })
    },
    onError: (error) => showErrorToast(error.message),
  })

  const updateSectionMutation = useMutation({
    mutationFn: ({
      sectionId,
      payload,
    }: {
      sectionId: string
      payload: Parameters<typeof updatePageSection>[1]
    }) => updatePageSection(sectionId, payload),
    onSuccess: () => {
      showSuccessToast("Section updated")
      queryClient.invalidateQueries({ queryKey: ["cmsAdminData"] })
      queryClient.invalidateQueries({ queryKey: ["contentBundle"] })
    },
    onError: (error) => showErrorToast(error.message),
  })

  const deleteSectionMutation = useMutation({
    mutationFn: deletePageSection,
    onSuccess: () => {
      showSuccessToast("Section deleted")
      queryClient.invalidateQueries({ queryKey: ["cmsAdminData"] })
      queryClient.invalidateQueries({ queryKey: ["contentBundle"] })
    },
    onError: (error) => showErrorToast(error.message),
  })

  if (isLoading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <LoaderCircle className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">CMS</h1>
        <p className="text-muted-foreground">
          Create pages, add reusable page blocks, and edit shared site content
          without touching code.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create Page</CardTitle>
          <CardDescription>
            New pages will appear in the header automatically when navigation is
            enabled.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="grid gap-2">
            <span className="text-sm font-medium">Slug</span>
            <Input
              placeholder="program"
              value={newPageSlug}
              onChange={(event) => setNewPageSlug(event.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <span className="text-sm font-medium">Page title</span>
            <Input
              placeholder="Program Page"
              value={newPageTitle}
              onChange={(event) => setNewPageTitle(event.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <span className="text-sm font-medium">Navigation label</span>
            <Input
              placeholder="Program"
              value={newPageNavigationTitle}
              onChange={(event) =>
                setNewPageNavigationTitle(event.target.value)
              }
            />
          </div>
          <div className="md:col-span-3">
            <Button
              disabled={
                createPageMutation.isPending ||
                !newPageSlug.trim() ||
                !newPageTitle.trim() ||
                !newPageNavigationTitle.trim()
              }
              onClick={() =>
                createPageMutation.mutate({
                  slug: newPageSlug.trim(),
                  title: newPageTitle.trim(),
                  navigation_title: newPageNavigationTitle.trim(),
                  show_in_navigation: true,
                  navigation_order: pages.length,
                  is_home: false,
                })
              }
            >
              Create page
            </Button>
          </div>
        </CardContent>
      </Card>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Pages</h2>
          <p className="text-sm text-muted-foreground">
            Pick a page to edit its metadata and sections.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {pages.map((page) => (
            <Button
              key={page.id}
              variant={page.id === selectedPageId ? "default" : "outline"}
              onClick={() => setSelectedPageId(page.id)}
            >
              {page.navigation_title}
            </Button>
          ))}
        </div>
      </section>

      {selectedPage ? (
        <Card key={selectedPage.id}>
          <CardHeader>
            <CardTitle>Page Settings</CardTitle>
            <CardDescription>
              Control the page URL, title, and whether it appears in the header.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <span className="text-sm font-medium">Slug</span>
              <Input
                defaultValue={selectedPage.slug}
                onBlur={(event) =>
                  updatePageMutation.mutate({
                    pageId: selectedPage.id,
                    payload: { slug: event.target.value.trim() },
                  })
                }
              />
            </div>
            <div className="grid gap-2">
              <span className="text-sm font-medium">Page title</span>
              <Input
                defaultValue={selectedPage.title}
                onBlur={(event) =>
                  updatePageMutation.mutate({
                    pageId: selectedPage.id,
                    payload: { title: event.target.value.trim() },
                  })
                }
              />
            </div>
            <div className="grid gap-2">
              <span className="text-sm font-medium">Navigation label</span>
              <Input
                defaultValue={selectedPage.navigation_title}
                onBlur={(event) =>
                  updatePageMutation.mutate({
                    pageId: selectedPage.id,
                    payload: { navigation_title: event.target.value.trim() },
                  })
                }
              />
            </div>
            <div className="grid gap-2">
              <span className="text-sm font-medium">Navigation order</span>
              <Input
                type="number"
                defaultValue={selectedPage.navigation_order}
                onBlur={(event) =>
                  updatePageMutation.mutate({
                    pageId: selectedPage.id,
                    payload: {
                      navigation_order: Number(event.target.value) || 0,
                    },
                  })
                }
              />
            </div>
            <label className="flex items-center gap-3 text-sm font-medium">
              <input
                type="checkbox"
                defaultChecked={selectedPage.show_in_navigation}
                onChange={(event) =>
                  updatePageMutation.mutate({
                    pageId: selectedPage.id,
                    payload: { show_in_navigation: event.target.checked },
                  })
                }
              />
              Show in header
            </label>
            <label className="flex items-center gap-3 text-sm font-medium">
              <input
                type="checkbox"
                defaultChecked={selectedPage.is_home}
                onChange={(event) =>
                  updatePageMutation.mutate({
                    pageId: selectedPage.id,
                    payload: { is_home: event.target.checked },
                  })
                }
              />
              Use as homepage
            </label>
          </CardContent>
        </Card>
      ) : null}

      {selectedPage ? (
        <Card key={`${selectedPage.id}-add-block`}>
          <CardHeader>
            <CardTitle>Add Block</CardTitle>
            <CardDescription>
              Choose one of the existing public block types and add it to this
              page.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 md:flex-row md:items-end">
            <div className="grid flex-1 gap-2">
              <span className="text-sm font-medium">Block type</span>
              <select
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                value={newSectionKind}
                onChange={(event) => setNewSectionKind(event.target.value)}
              >
                {SECTION_TEMPLATES.map((template) => (
                  <option key={template.kind} value={template.kind}>
                    {template.label}
                  </option>
                ))}
              </select>
            </div>
            <Button
              disabled={createSectionMutation.isPending}
              onClick={() =>
                createSectionMutation.mutate({
                  pageId: selectedPage.id,
                  kind: newSectionKind,
                })
              }
            >
              Add block
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {selectedPage ? (
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Page Blocks</h2>
            <p className="text-sm text-muted-foreground">
              Edit the blocks that build the selected page.
            </p>
          </div>
          <div className="grid gap-6">
            {[...selectedPage.sections]
              .sort((left, right) => left.position - right.position)
              .map((section) => (
                <PageSectionEditorCard
                  key={section.id}
                  section={section}
                  isSaving={
                    updateSectionMutation.isPending &&
                    updateSectionMutation.variables?.sectionId === section.id
                  }
                  isDeleting={
                    deleteSectionMutation.isPending &&
                    deleteSectionMutation.variables === section.id
                  }
                  onSave={(currentSection, rawPayload) => {
                    const template = getSectionTemplate(currentSection.kind)
                    const content = Object.fromEntries(
                      (template?.fields ?? []).map((field) => [
                        field.key,
                        deserializeSectionValue(
                          rawPayload.content[field.key] ?? "",
                          field.type,
                        ),
                      ]),
                    )

                    updateSectionMutation.mutate({
                      sectionId: currentSection.id,
                      payload: {
                        title: rawPayload.title,
                        position: rawPayload.position,
                        content,
                      },
                    })
                  }}
                  onDelete={(currentSection) =>
                    deleteSectionMutation.mutate(currentSection.id)
                  }
                />
              ))}
          </div>
        </section>
      ) : null}

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Shared Content</h2>
          <p className="text-sm text-muted-foreground">
            These blocks stay global for every page.
          </p>
        </div>
        <div className="grid gap-6">
          {sharedBlocks.map((block) => (
            <ContentEditorCard
              key={block.id}
              block={block}
              isSaving={
                updateSharedMutation.isPending &&
                updateSharedMutation.variables?.blockId === block.id
              }
              onSave={(currentBlock, rawContent) => {
                const content = Object.fromEntries(
                  getEditableFields(currentBlock).map((field) => [
                    field.key,
                    deserializeContentValue(
                      rawContent[field.key] ?? "",
                      field.type,
                    ),
                  ]),
                )

                updateSharedMutation.mutate({
                  blockId: currentBlock.id,
                  title: currentBlock.title,
                  content,
                })
              }}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
