"use client"

import Image from "next/image"
import { Link, useRouter } from "@/i18n/navigation"
import { Suspense, useEffect, useMemo, useSyncExternalStore } from "react"
import { useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { useLocale, useTranslations } from "next-intl"
import { z } from "zod"

import { createSupabaseBrowserClient } from "@/core/supabase/browser"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { getAuthCallbackUrl, safeAuthNextPath } from "@/shared/lib/authUrls"
import {
  createForgotPasswordSchema,
  createLoginSchema,
  createRegisterSchema,
} from "@/shared/lib/formSchemas"
import { CosmicInput } from "@/shared/ui/CosmicInput"

function AuthPageContent() {
  const t = useTranslations("auth")
  const tFields = useTranslations("common.fields")
  const tPlaceholders = useTranslations("common.placeholders")
  const tValidation = useTranslations("common.validation")
  const tToast = useTranslations("common.toast")
  const locale = useLocale()

  const loginSchema = useMemo(
    () =>
      createLoginSchema({
        email: tValidation("email"),
        passwordMin: tValidation("passwordMin"),
      }),
    [tValidation],
  )

  const registerSchema = useMemo(
    () =>
      createRegisterSchema({
        email: tValidation("email"),
        passwordMin: tValidation("passwordMin"),
        confirmPassword: tValidation("confirmPassword"),
        passwordsNoMatch: tValidation("passwordsNoMatch"),
      }),
    [tValidation],
  )

  const forgotSchema = useMemo(
    () =>
      createForgotPasswordSchema({
        email: tValidation("email"),
      }),
    [tValidation],
  )

  const supabase = useMemo(() => createSupabaseBrowserClient(), [])
  const router = useRouter()
  const searchParams = useSearchParams()
  const mode = searchParams.get("mode")
  const isRegister = mode === "register"
  const isForgot = mode === "forgot"
  const afterAuthPath = safeAuthNextPath(searchParams.get("next"))
  // Client-only flag for E2E (data-auth-ready) without setState-in-effect.
  const clientReady = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  )

  useEffect(() => {
    if (searchParams.get("error") === "link") {
      toast.error(t("linkError"))
    }
  }, [searchParams, t])

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", password: "", confirm: "" },
  })

  const forgotForm = useForm<z.infer<typeof forgotSchema>>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
  })

  const loginMutation = useMutation({
    mutationFn: async (values: z.infer<typeof loginSchema>) => {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      })
      if (error) throw error
      return true
    },
    onSuccess: () => {
      router.refresh()
      router.push(afterAuthPath)
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : String(error) ?? tToast("unknownError")
      loginForm.setError("root", { message })
    },
  })

  const registerMutation = useMutation({
    mutationFn: async (values: z.infer<typeof registerSchema>) => {
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          emailRedirectTo: getAuthCallbackUrl(locale, afterAuthPath),
        },
      })
      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      if (data.session) {
        router.refresh()
        router.push(afterAuthPath)
        return
      }
      toast.success(t("confirmEmailToast"))
      router.replace("/auth")
      registerForm.reset()
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : String(error) ?? tToast("unknownError")
      registerForm.setError("root", { message })
    },
  })

  const forgotMutation = useMutation({
    mutationFn: async (values: z.infer<typeof forgotSchema>) => {
      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: getAuthCallbackUrl(locale, "/auth/reset"),
      })
      if (error) throw error
      return true
    },
    onSuccess: () => {
      toast.success(t("forgotEmailToast"))
      forgotForm.reset()
      router.replace("/auth")
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : String(error) ?? tToast("unknownError")
      forgotForm.setError("root", { message })
    },
  })

  const title = isForgot ? t("forgotTitle") : isRegister ? t("registerTitle") : t("signInTitle")
  const subtitle = isForgot
    ? t("forgotSubtitle")
    : isRegister
      ? t("registerSubtitle")
      : t("signInSubtitle")

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
          <CardTitle className="text-xl font-semibold text-primary">{title}</CardTitle>
          <CardDescription className="text-primary/70">{subtitle}</CardDescription>
        </CardHeader>
        <CardContent>
          {isForgot ? (
            <Form {...forgotForm}>
              <form
                method="post"
                data-auth-ready={clientReady ? "true" : "false"}
                onSubmit={forgotForm.handleSubmit((v) => {
                  forgotForm.clearErrors("root")
                  forgotMutation.mutate(v)
                })}
                className="stack-card"
              >
                <FormField
                  control={forgotForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>{tFields("email")}</FormLabel>
                      <FormControl>
                        <CosmicInput
                          type="email"
                          autoComplete="email"
                          autoFocus
                          placeholder={tPlaceholders("email")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {forgotForm.formState.errors.root?.message && (
                  <div className="rounded-md border border-error/40 bg-error/10 px-3 py-2 text-sm text-error">
                    {forgotForm.formState.errors.root.message}
                  </div>
                )}
                <Button
                  type="submit"
                  disabled={forgotMutation.isPending}
                  variant="cosmicPrimary"
                  size="cosmicMd"
                  className="w-full"
                >
                  {forgotMutation.isPending ? t("sendingReset") : t("sendResetButton")}
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
          ) : isRegister ? (
            <Form {...registerForm}>
              <form
                method="post"
                data-auth-ready={clientReady ? "true" : "false"}
                onSubmit={registerForm.handleSubmit((v) => {
                  registerForm.clearErrors("root")
                  registerMutation.mutate(v)
                })}
                className="stack-card"
              >
                <FormField
                  control={registerForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>{tFields("email")}</FormLabel>
                      <FormControl>
                        <CosmicInput type="email" placeholder={tPlaceholders("email")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
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
                  control={registerForm.control}
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
                {registerForm.formState.errors.root?.message && (
                  <div className="rounded-md border border-error/40 bg-error/10 px-3 py-2 text-sm text-error">
                    {registerForm.formState.errors.root.message}
                  </div>
                )}
                <Button
                  type="submit"
                  disabled={registerMutation.isPending}
                  variant="cosmicPrimary"
                  size="cosmicMd"
                  className="w-full"
                >
                  {registerMutation.isPending ? t("creatingAccount") : t("createAccountButton")}
                </Button>
                <p className="text-center text-sm text-primary/75">
                  {t("hasAccount")}{" "}
                  <Link
                    href="/auth"
                    className="font-medium text-btn-link-dark underline underline-offset-4 hover:text-btn-link-dark-hover"
                  >
                    {t("signInLink")}
                  </Link>
                </p>
              </form>
            </Form>
          ) : (
            <Form {...loginForm}>
              <form
                method="post"
                data-auth-ready={clientReady ? "true" : "false"}
                onSubmit={loginForm.handleSubmit((v) => {
                  loginForm.clearErrors("root")
                  loginMutation.mutate(v)
                })}
                className="stack-card"
              >
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>{tFields("email")}</FormLabel>
                      <FormControl>
                        <CosmicInput type="email" placeholder={tPlaceholders("email")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={loginForm.control}
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
                {loginForm.formState.errors.root?.message && (
                  <div className="rounded-md border border-error/40 bg-error/10 px-3 py-2 text-sm text-error">
                    {loginForm.formState.errors.root.message}
                  </div>
                )}
                <Button
                  type="submit"
                  disabled={loginMutation.isPending}
                  variant="cosmicPrimary"
                  size="cosmicMd"
                  className="w-full"
                >
                  {loginMutation.isPending ? t("signingIn") : t("loginButton")}
                </Button>
                <p className="text-center text-sm text-primary/75">
                  <Link
                    href="/auth?mode=forgot"
                    className="font-medium text-btn-link-dark underline underline-offset-4 hover:text-btn-link-dark-hover"
                  >
                    {t("forgotPasswordLink")}
                  </Link>
                </p>
                <p className="text-center text-sm text-primary/75">
                  {t("noAccount")}{" "}
                  <Link
                    href="/auth?mode=register"
                    className="font-medium text-btn-link-dark underline underline-offset-4 hover:text-btn-link-dark-hover"
                  >
                    {t("registerLink")}
                  </Link>
                </p>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function AuthFallback() {
  const t = useTranslations("common.actions")
  return (
    <div className="flex min-h-[40vh] flex-1 items-center justify-center bg-app px-4 text-on-dark">
      <p className="text-sm text-on-dark/70">{t("loading")}</p>
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={<AuthFallback />}>
      <AuthPageContent />
    </Suspense>
  )
}
