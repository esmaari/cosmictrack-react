import { createSupabaseServerClient } from "@/core/supabase/server"
import { getCategoriesByUserId } from "@/entities/category/api/getCategoriesByUserId"
import { redirect } from "@/i18n/navigation"
import { getLocale } from "next-intl/server"
import CategoriesManageList from "@/features/category-manage/ui/CategoriesManageList"

export default async function CategoriesPage() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const userId = user?.id

  if (!userId) {
    return redirect({ href: "/auth", locale: await getLocale() })
  }

  const categories = await getCategoriesByUserId(userId)

  return <CategoriesManageList categories={categories} />
}
