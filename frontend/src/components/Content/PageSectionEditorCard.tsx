import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { LoadingButton } from "@/components/ui/loading-button"
import type { PageSection } from "@/lib/content-api"
import {
  getSectionFields,
  serializeSectionValue,
} from "@/lib/page-section-schema"

type Props = {
  section: PageSection
  isSaving: boolean
  isDeleting: boolean
  onSave: (
    section: PageSection,
    payload: {
      title: string
      position: number
      content: Record<string, string>
    },
  ) => void
  onDelete: (section: PageSection) => void
}

export function PageSectionEditorCard({
  section,
  isSaving,
  isDeleting,
  onSave,
  onDelete,
}: Props) {
  const fields = getSectionFields(section)
  const [title, setTitle] = useState(section.title)
  const [position, setPosition] = useState(String(section.position))
  const [contentValues, setContentValues] = useState<Record<string, string>>({})

  useEffect(() => {
    setTitle(section.title)
    setPosition(String(section.position))
    setContentValues(
      Object.fromEntries(
        fields.map((field) => [
          field.key,
          serializeSectionValue(section.content[field.key]),
        ]),
      ),
    )
  }, [fields, section])

  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader>
        <CardTitle>{section.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <span className="text-sm font-medium text-foreground">
            Section title
          </span>
          <Input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <span className="text-sm font-medium text-foreground">Order</span>
          <Input
            type="number"
            min={0}
            value={position}
            onChange={(event) => setPosition(event.target.value)}
          />
        </div>

        {fields.map((field) => {
          const value = contentValues[field.key] ?? ""
          const commonClassName =
            "min-h-24 rounded-md border border-input bg-background px-3 py-2 text-sm"

          return (
            <div key={field.key} className="grid gap-2">
              <span className="text-sm font-medium text-foreground">
                {field.label}
              </span>
              {field.type === "text" ? (
                <Input
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
                  className={commonClassName}
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
            </div>
          )
        })}

        <div className="flex flex-wrap justify-end gap-3">
          <Button
            variant="destructive"
            type="button"
            disabled={isDeleting}
            onClick={() => onDelete(section)}
          >
            Delete section
          </Button>
          <LoadingButton
            loading={isSaving}
            onClick={() =>
              onSave(section, {
                title,
                position: Number(position) || 0,
                content: Object.fromEntries(
                  fields.map((field) => [
                    field.key,
                    contentValues[field.key] ?? "",
                  ]),
                ),
              })
            }
          >
            Save section
          </LoadingButton>
        </div>
      </CardContent>
    </Card>
  )
}
