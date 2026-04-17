import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createFileRoute, redirect } from "@tanstack/react-router"
import { LoaderCircle } from "lucide-react"

import { UsersService } from "@/client"
import { ContentEditorCard } from "@/components/Content/ContentEditorCard"
import { Card, CardContent } from "@/components/ui/card"
import useCustomToast from "@/hooks/useCustomToast"
import {
  type ContentValue,
  getContentBlocks,
  updateContentBlock,
} from "@/lib/content-api"
import { deserializeContentValue, getEditableFields } from "@/lib/content-schema"

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
        title: "Content - FastAPI Template",
      },
    ],
  }),
})

function ContentRoute() {
  const queryClient = useQueryClient()
  const { showSuccessToast, showErrorToast } = useCustomToast()
  const { data, isLoading } = useQuery({
    queryKey: ["contentBlocks"],
    queryFn: getContentBlocks,
  })

  const updateMutation = useMutation({
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
      showSuccessToast("Content updated")
      queryClient.invalidateQueries({ queryKey: ["contentBlocks"] })
      queryClient.invalidateQueries({ queryKey: ["contentBundle", "home"] })
    },
    onError: (error) => {
      showErrorToast(error.message)
    },
  })

  if (isLoading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <LoaderCircle className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const blocks = data?.data ?? []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Content</h1>
        <p className="text-muted-foreground">
          Edit the homepage and shared site sections without touching code.
        </p>
      </div>

      <div className="grid gap-6">
        {blocks.map((block) => (
          <ContentEditorCard
            key={block.id}
            block={block}
            isSaving={
              updateMutation.isPending &&
              updateMutation.variables?.blockId === block.id
            }
            onSave={(currentBlock, rawContent) => {
              const content = Object.fromEntries(
                getEditableFields(currentBlock).map((field) => [
                  field.key,
                  deserializeContentValue(rawContent[field.key] ?? "", field.type),
                ]),
              )

              updateMutation.mutate({
                blockId: currentBlock.id,
                title: currentBlock.title,
                content,
              })
            }}
          />
        ))}
      </div>

      {blocks.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-sm text-muted-foreground">
            No content blocks found.
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
