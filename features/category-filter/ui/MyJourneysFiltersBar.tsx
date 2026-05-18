import { Link } from "@/i18n/navigation";
import CategoryFilterPicker from "@/features/category-filter/ui/CategoryFilterPicker";
import type { Category } from "@/shared/types/db"
import { Button } from "@/components/ui/button";
import { List, Heart } from "lucide-react";

export default function MyJourneysFiltersBar(
    props: {
        filteredCategoryIds: string[];
        showFavMode: boolean;
        allCategories: Category[]
    }) 
    {

    const params = new URLSearchParams()

    for (const catId of props.filteredCategoryIds) {
        params.append("cat", catId)
    }

    return (
    <>
         <div className="flex items-center gap-2">

                <Button asChild variant={props.showFavMode ? "cosmicTertiaryOnDark" : "cosmicSecondary"}>
                    <Link
                    href={props.filteredCategoryIds 
                        ? `/my-journeys?${params.toString()}`
                        : "/my-journeys"
                    }
                    >
                        <List className="size-4" />
                        Show All
                    </Link>
                </Button>

                <Button asChild variant={props.showFavMode ? "cosmicSecondary" : "cosmicTertiaryOnDark"}>
                    <Link
                    href={props.filteredCategoryIds
                        ? `/my-journeys?fav=1&${params.toString()}`
                        : "/my-journeys?fav=1"
                    }
                    >
                        <Heart className="size-4" />
                        Show Favorites
                    </Link>
                </Button>

                <CategoryFilterPicker 
                    categories={props.allCategories}
                />
                
            </div>
        </>
    )
}