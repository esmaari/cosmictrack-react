import { createSupabaseServerClient } from "@/core/supabase/server"
import { User } from "@supabase/supabase-js"
import { redirect } from "next/navigation"

export default async function ProtectedLayout({children}: {children: React.ReactNode}) {
  const supabase = await createSupabaseServerClient();
  
  const { data: { user } } = await supabase.auth.getUser() as { data: { user: User } };
  if (!user?.id) {
    redirect("/auth");
  }
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 bg-app px-4 py-6 text-on-dark">
      {children}
    </main>
  )
}