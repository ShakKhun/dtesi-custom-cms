import { useEffect, useState } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingButton } from "@/components/ui/loading-button"
import { getEditableFields, serializeContentValue } from "@/lib/content-schema"
import type { ContentBlock } from "@/lib/content-api"

type Props = {
  block: ContentBlock
  isSaving: boolean
  onSave: (block: ContentBlock, content: Record<string, string>) => void
}

export function ContentEditorCard({ block, isSaving, onSave }: Props) {
  const fields = getEditableFields(block)
  const [title, setTitle] = useState(block.title)
  const [contentValues, setContentValues] = useState<Record<string, string>>({})

  useEffect(() => {
    setTitle(block.title)
    setContentValues(
      Object.fromEntries(
        fields.map((field) => [
          field.key,
          serializeContentValue(block.content[field.key]),
        ]),
      ),
    )
  }, [block, fields])

  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader>
        <CardTitle>{block.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <label className="grid gap-2">
          <span className="text-sm font-medium text-foreground">Block title</span>
          <input
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </label>

        {fields.map((field) => {
          const value = contentValues[field.key] ?? ""
          const commonClassName =
            "rounded-md border border-input bg-background px-3 py-2 text-sm"

          return (
            <label key={field.key} className="grid gap-2">
              <span className="text-sm font-medium text-foreground">
                {field.label}
              </span>
              {field.type === "text" ? (
                <input
                  className={`h-10 ${commonClassName}`}
                  value={value}
                  onChange={(event) =>
                    setContentValues((current) => ({
                      ...current,
                      [field.key]: event.target.value,
                    }))
                  }
                />
              ) : (
                <textarea
                  className={`${commonClassName} min-h-28 resize-y`}
                  value={value}
                  onChange={(event) =>
                    setContentValues((current) => ({
                      ...current,
                      [field.key]: event.target.value,
                    }))
                  }
                />
              )}
              {field.type === "list" ? (
                <span className="text-xs text-muted-foreground">
                  One item per line
                </span>
              ) : null}
            </label>
          )
        })}

        <div className="flex justify-end">
          <LoadingButton
            loading={isSaving}
            onClick={() => onSave({ ...block, title }, contentValues)}
          >
            Save block
          </LoadingButton>
        </div>
      </CardContent>
    </Card>
  )
}
