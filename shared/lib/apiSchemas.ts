import { z } from "zod"

/** Server-side body schemas for `/api/*` write routes (English error strings). */

export const postJourneyBodySchema = z.object({
  journeyId: z.string().min(1).optional().nullable(),
  title: z.string().trim().min(3).max(50),
  description: z.string().trim().max(200).optional().nullable(),
})

export const deleteJourneyBodySchema = z.object({
  journeyId: z.string().min(1),
})

export const postCategoryBodySchema = z.object({
  categoryId: z.string().min(1).optional().nullable(),
  categoryName: z.string().trim().min(2).max(50),
  categoryColor: z.string().trim().min(1),
  categoryDescription: z.string().trim().max(200).optional().nullable(),
})

export const deleteCategoryBodySchema = z.object({
  categoryId: z.string().min(1),
})

export const postStepBodySchema = z.object({
  journeyId: z.string().min(1),
  title: z.string().trim().min(1).max(80),
  note: z.string().max(500).optional().nullable(),
  id: z.string().min(1).optional().nullable(),
  cards: z
    .array(
      z.object({
        id: z.number().int().min(0).max(77),
        isReversed: z.boolean(),
      }),
    )
    .min(3)
    .max(5)
    .optional()
    .nullable(),
  meaning: z.string().optional().nullable(),
})

export const deleteStepBodySchema = z.object({
  stepId: z.string().min(1),
})

export const journeyIdBodySchema = z.object({
  journeyId: z.string().min(1),
})

export const journeyCategoryBodySchema = z.object({
  journeyId: z.string().min(1),
  categoryId: z.string().min(1),
})

export type ParseApiBodyResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string }

export function parseApiBody<T>(
  schema: z.ZodType<T>,
  body: unknown,
): ParseApiBodyResult<T> {
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    const first = parsed.error.issues[0]
    const path = first?.path?.length ? `${first.path.join(".")}: ` : ""
    return { ok: false, error: `${path}${first?.message ?? "Invalid request body"}` }
  }
  return { ok: true, data: parsed.data }
}
