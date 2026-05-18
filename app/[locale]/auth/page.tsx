"use client"

import Image from "next/image"
import { Link, useRouter } from "@/i18n/navigation"
import { Suspense, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import { createSupabaseBrowserClient } from "@/core/supabase/browser"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { CosmicInput } from "@/shared/ui/CosmicInput"

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

const registerSchema = z
  .object({
    email: z.string().email("Enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirm: z.string().min(6, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  })

function AuthPageContent() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), [])
  const router = useRouter()
  const searchParams = useSearchParams()
  const isRegister = searchParams.get("mode") === "register"

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", password: "", confirm: "" },
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
      router.push("/")
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : String(error) ?? "Unknown error"
      loginForm.setError("root", { message })
    },
  })

  const registerMutation = useMutation({
    mutationFn: async (values: z.infer<typeof registerSchema>) => {
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
      })
      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      if (data.session) {
        router.refresh()
        router.push("/")
        return
      }
      toast.success("Check your email to confirm your account, then sign in.")
      router.replace("/auth")
      registerForm.reset()
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : String(error) ?? "Unknown error"
      registerForm.setError("root", { message })
    },
  })

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-app px-4 py-10 text-on-dark">
      <div className="mx-auto mb-8 flex w-full max-w-md flex-col items-center gap-2 text-center">
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
        <h1 className="heading-3 mb-2 p-4 font-semibold text-on-dark">
          {isRegister ? "Create account" : "Sign in"}
        </h1>
        <p className="text-sm text-on-dark/75">
          {isRegister
            ? "Choose an email and password to register."
            : "Welcome back — use your email and password."}
        </p>
      </div>

      <Card className="mx-auto w-full max-w-md border-border-neutral bg-surface text-primary shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-primary">{isRegister ? "Register" : "Login"}</CardTitle>
          <CardDescription className="text-primary/70">
            {isRegister ? "Create your CosmicTrack account." : "Sign in to continue."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isRegister ? (
            <Form {...registerForm}>
              <form
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
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <CosmicInput type="email" placeholder="you@example.com" {...field} />
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
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <CosmicInput type="password" placeholder="••••••••" {...field} />
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
                      <FormLabel>Confirm password</FormLabel>
                      <FormControl>
                        <CosmicInput type="password" placeholder="••••••••" {...field} />
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
                  {registerMutation.isPending ? "Creating account…" : "Create account"}
                </Button>
                <p className="text-center text-sm text-primary/75">
                  Already have an account?{" "}
                  <Link href="/auth" className="font-medium text-secondary underline-offset-2 hover:underline">
                    Sign in
                  </Link>
                </p>
              </form>
            </Form>
          ) : (
            <Form {...loginForm}>
              <form
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
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <CosmicInput type="email" placeholder="you@example.com" {...field} />
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
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <CosmicInput type="password" placeholder="••••••••" {...field} />
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
                  {loginMutation.isPending ? "Signing in…" : "Login"}
                </Button>
                <p className="text-center text-sm text-primary/75">
                  No account yet?{" "}
                  <Link
                    href="/auth?mode=register"
                    className="text-btn-link-dark  hover:text-btn-link-dark-hover"
                  >
                    Register
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
  return (
    <div className="flex min-h-[40vh] flex-1 items-center justify-center bg-app px-4 text-on-dark">
      <p className="text-sm text-on-dark/70">Loading…</p>
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
