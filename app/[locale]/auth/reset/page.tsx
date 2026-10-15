"use client"

import Image from "next/image"
import { Link, useRouter } from "@/i18n/navigation"
import { useMemo } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { useTranslations } from "next-intl"
import { z } from "zod"

import { createSupabaseBrowserClient } from "@/core/supabase/browser"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { createResetPasswordSchema } from "@/shared/lib/formSchemas"
import { CosmicInput } from "@/shared/ui/CosmicInput"

export default function ResetPasswordPage() {
  const t = useTranslations("auth")
  const tFields = useTranslations("common.fields")
  const tPlaceholders = useTranslations("common.placeholders")
  const tValidation = useTranslations("common.validation")
  const tToast = useTranslations("common.toast")
  const router = useRouter()
  const supabase = useMemo(() => createSupabaseBrowserClient(), [])

  const schema = useMemo(
    () =>
      createResetPasswordSchema({
        passwordMin: tValidation("passwordMin"),
        confirmPassword: tValidation("confirmPassword"),
        passwordsNoMatch: tValidation("passwordsNoMatch"),
      }),
    [tValidation],
  )

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { password: "", confirm: "" },
  })

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof schema>) => {
      const { error } = await supabase.auth.updateUser({ password: values.password })
      if (error) throw error
      return true
    },
    onSuccess: () => {
      toast.success(t("resetSuccessToast"))
      router.refresh()
      router.push("/my-journeys")
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : String(error) ?? tToast("unknownError")
      form.setError("root", { message })
    },
  })

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-app px-4 py-10 text-on-dark">
      <div className="mx-auto mb-6 flex w-full max-w-md flex-col items-center gap-3 text-center">
        <div className="relative mx-auto h-14 w-[180px]">
          <Image
            src="/logos/Logo_CT_Badge.png"
            alt="CosmicTrack"
            fill
            className="object-contain object-center"
            sizes="180px"
            priority
          />
        </div>
      </div>

      <Card className="mx-auto w-full max-w-md border-border-neutral bg-surface text-primary shadow-lg">
        <CardHeader className="space-y-2">
          <CardTitle className="text-xl font-semibold text-primary">{t("resetTitle")}</CardTitle>
          <CardDescription className="text-primary/70">{t("resetSubtitle")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((v) => {
                form.clearErrors("root")
                mutation.mutate(v)
              })}
              className="stack-card"
            >
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>{tFields("password")}</FormLabel>
                    <FormControl>
                      <CosmicInput type="password" placeholder={tPlaceholders("password")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirm"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>{tFields("confirmPassword")}</FormLabel>
                    <FormControl>
                      <CosmicInput type="password" placeholder={tPlaceholders("password")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {form.formState.errors.root?.message && (
                <div className="rounded-md border border-error/40 bg-error/10 px-3 py-2 text-sm text-error">
                  {form.formState.errors.root.message}
                </div>
              )}
              <Button
                type="submit"
                disabled={mutation.isPending}
                variant="cosmicPrimary"
                size="cosmicMd"
                className="w-full"
              >
                {mutation.isPending ? t("resettingPassword") : t("resetButton")}
              </Button>
              <p className="text-center text-sm text-primary/75">
                <Link
                  href="/auth"
                  className="font-medium text-btn-link-dark underline underline-offset-4 hover:text-btn-link-dark-hover"
                >
                  {t("backToSignIn")}
                </Link>
              </p>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
