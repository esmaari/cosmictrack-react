import { describe, expect, it } from "vitest"
import {
  createCategorySchema,
  createEditStepSchema,
  createForgotPasswordSchema,
  createJourneySchema,
  createLoginSchema,
  createRegisterSchema,
  createResetPasswordSchema,
  createStepSchema,
} from "./formSchemas"

const loginMessages = {
  email: "Invalid email",
  passwordMin: "Password min 6",
}

const registerMessages = {
  ...loginMessages,
  confirmPassword: "Confirm min 6",
  passwordsNoMatch: "Passwords do not match",
}

describe("createLoginSchema", () => {
  const schema = createLoginSchema(loginMessages)

  it("accepts valid credentials", () => {
    expect(schema.safeParse({ email: "a@b.co", password: "secret1" }).success).toBe(true)
  })

  it("rejects invalid email and short password", () => {
    const email = schema.safeParse({ email: "nope", password: "secret1" })
    const password = schema.safeParse({ email: "a@b.co", password: "123" })
    expect(email.success).toBe(false)
    expect(password.success).toBe(false)
  })
})

describe("createRegisterSchema", () => {
  const schema = createRegisterSchema(registerMessages)

  it("accepts matching passwords", () => {
    expect(
      schema.safeParse({
        email: "a@b.co",
        password: "secret1",
        confirm: "secret1",
      }).success,
    ).toBe(true)
  })

  it("rejects mismatched confirm", () => {
    const result = schema.safeParse({
      email: "a@b.co",
      password: "secret1",
      confirm: "other12",
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.includes("confirm"))).toBe(true)
    }
  })
})

describe("createForgotPasswordSchema", () => {
  const schema = createForgotPasswordSchema({ email: "Invalid email" })

  it("accepts a valid email", () => {
    expect(schema.safeParse({ email: "a@b.co" }).success).toBe(true)
  })

  it("rejects invalid email", () => {
    expect(schema.safeParse({ email: "nope" }).success).toBe(false)
  })
})

describe("createResetPasswordSchema", () => {
  const schema = createResetPasswordSchema({
    passwordMin: "Password min 6",
    confirmPassword: "Confirm min 6",
    passwordsNoMatch: "Passwords do not match",
  })

  it("accepts matching passwords", () => {
    expect(schema.safeParse({ password: "secret1", confirm: "secret1" }).success).toBe(true)
  })

  it("rejects mismatched confirm", () => {
    const result = schema.safeParse({ password: "secret1", confirm: "other12" })
    expect(result.success).toBe(false)
  })
})

describe("createJourneySchema", () => {
  const schema = createJourneySchema({
    titleMin: "title min",
    titleMax: "title max",
    descriptionMax: "desc max",
  })

  it("requires title length 3–50", () => {
    expect(schema.safeParse({ title: "ab" }).success).toBe(false)
    expect(schema.safeParse({ title: "abc" }).success).toBe(true)
    expect(schema.safeParse({ title: "x".repeat(51) }).success).toBe(false)
  })

  it("allows optional description up to 200", () => {
    expect(schema.safeParse({ title: "Trip", description: "ok" }).success).toBe(true)
    expect(schema.safeParse({ title: "Trip", description: "x".repeat(201) }).success).toBe(false)
  })
})

describe("createCategorySchema", () => {
  const schema = createCategorySchema({
    titleMin: "title min",
    titleMax: "title max",
    colorRequired: "color required",
    descriptionMax: "desc max",
  })

  it("requires title and color", () => {
    expect(schema.safeParse({ title: "a", color: "bg-cat-energy" }).success).toBe(false)
    expect(schema.safeParse({ title: "Love", color: "" }).success).toBe(false)
    expect(schema.safeParse({ title: "Love", color: "bg-cat-love" }).success).toBe(true)
  })

  it("allows optional description up to 200", () => {
    expect(
      schema.safeParse({ title: "Love", color: "bg-cat-love", description: "ok" }).success,
    ).toBe(true)
    expect(
      schema.safeParse({
        title: "Love",
        color: "bg-cat-love",
        description: "x".repeat(201),
      }).success,
    ).toBe(false)
  })
})

describe("createStepSchema", () => {
  const schema = createStepSchema({
    titleRequired: "title required",
    titleMax: "title max",
    cardsRequired: "cards required",
    noteMax: "note max",
  })

  it("requires title and at least 3 cards", () => {
    expect(
      schema.safeParse({
        title: "Reading",
        cards: [
          { id: 0, isReversed: false },
          { id: 1, isReversed: true },
        ],
      }).success,
    ).toBe(false)

    expect(
      schema.safeParse({
        title: "Reading",
        cards: [
          { id: 0, isReversed: false },
          { id: 1, isReversed: true },
          { id: 2, isReversed: false },
        ],
      }).success,
    ).toBe(true)
  })

  it("enforces note max length", () => {
    expect(
      schema.safeParse({
        title: "Reading",
        cards: [
          { id: 0, isReversed: false },
          { id: 1, isReversed: false },
          { id: 2, isReversed: false },
        ],
        note: "x".repeat(501),
      }).success,
    ).toBe(false)
  })
})

describe("createEditStepSchema", () => {
  const schema = createEditStepSchema({
    titleRequired: "title required",
    titleMax: "title max",
    noteMax: "note max",
  })

  it("validates title without requiring cards", () => {
    expect(schema.safeParse({ title: "" }).success).toBe(false)
    expect(schema.safeParse({ title: "Updated" }).success).toBe(true)
  })
})
