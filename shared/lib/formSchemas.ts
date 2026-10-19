import { z } from "zod"

/** Message bags — pass next-intl strings in UI, fixed EN in unit tests. */

export type LoginSchemaMessages = {
  email: string
  passwordMin: string
}

export type RegisterSchemaMessages = LoginSchemaMessages & {
  confirmPassword: string
  passwordsNoMatch: string
}

export type JourneySchemaMessages = {
  titleMin: string
  titleMax: string
  descriptionMax: string
}

export type CategorySchemaMessages = {
  titleMin: string
  titleMax: string
  colorRequired: string
  descriptionMax: string
}

export type StepSchemaMessages = {
  titleRequired: string
  titleMax: string
  cardsRequired: string
  noteMax: string
}

export function createLoginSchema(m: LoginSchemaMessages) {
  return z.object({
    email: z.string().email(m.email),
    password: z.string().min(6, m.passwordMin),
  })
}

export function createRegisterSchema(m: RegisterSchemaMessages) {
  return z
    .object({
      email: z.string().email(m.email),
      password: z.string().min(6, m.passwordMin),
      confirm: z.string().min(6, m.confirmPassword),
    })
    .refine((data) => data.password === data.confirm, {
      message: m.passwordsNoMatch,
      path: ["confirm"],
    })
}

export type ForgotPasswordSchemaMessages = {
  email: string
}

export function createForgotPasswordSchema(m: ForgotPasswordSchemaMessages) {
  return z.object({
    email: z.string().email(m.email),
  })
}

export type ResetPasswordSchemaMessages = {
  passwordMin: string
  confirmPassword: string
  passwordsNoMatch: string
}

export function createResetPasswordSchema(m: ResetPasswordSchemaMessages) {
  return z
    .object({
      password: z.string().min(6, m.passwordMin),
      confirm: z.string().min(6, m.confirmPassword),
    })
    .refine((data) => data.password === data.confirm, {
      message: m.passwordsNoMatch,
      path: ["confirm"],
    })
}

export function createJourneySchema(m: JourneySchemaMessages) {
  return z.object({
    title: z.string().min(3, { message: m.titleMin }).max(50, { message: m.titleMax }),
    description: z.string().max(200, { message: m.descriptionMax }).optional(),
  })
}

export function createCategorySchema(m: CategorySchemaMessages) {
  return z.object({
    title: z.string().min(2, { message: m.titleMin }).max(50, { message: m.titleMax }),
    color: z.string().min(1, { message: m.colorRequired }),
    description: z.string().max(200, { message: m.descriptionMax }).optional(),
  })
}

export function createStepSchema(m: StepSchemaMessages) {
  return z.object({
    title: z.string().min(1, { message: m.titleRequired }).max(80, { message: m.titleMax }),
    cards: z
      .array(z.object({ id: z.number(), isReversed: z.boolean() }))
      .min(3, { message: m.cardsRequired }),
    meaning: z.string().optional(),
    note: z.string().max(500, { message: m.noteMax }).optional(),
  })
}

export function createEditStepSchema(m: Pick<StepSchemaMessages, "titleRequired" | "titleMax" | "noteMax">) {
  return z.object({
    title: z.string().min(1, { message: m.titleRequired }).max(80, { message: m.titleMax }),
    note: z.string().max(500, { message: m.noteMax }).optional(),
  })
}
