import type { Journey, Category } from "@/shared/types/db";
import Link from "next/link";
import FavoriteToggleButton from "@/features/favorites-toggle/ui/FavoriteToggleButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCreatedAt } from "@/lib/formatCreatedAt"
import { cn } from "@/lib/utils"

export default function JourneysGrid(
    props: {
        journeys: Journey[], 
        favoriteJourneyIds: string[],
        journeyCategoryRelationsMap: Map<string, string[]>,
        categoryMapById: Map<string, Category>

    }) {

        const isCategory = (c: Category | undefined): c is Category => c != null

        return(
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
               
                    {props.journeys.map((journey) => {
                        const categories = Array.from(// 3. "Tekrar listeye çevir" ki .map yapabilelim
                            new Set(props.journeyCategoryRelationsMap.get(journey.id) ?? []),// 1. "ID'leri getir ve tekrarları sil"
                        )
                            .map((categoryId) => props.categoryMapById.get(categoryId))// 2. "ID'leri gerçek bilgilere dönüştür"
                            .filter(isCategory)// 4. "Hatalıları süz"

                        return (
                            <Link href={`/journey/${journey.id}`} key={journey.id}>
                                <Card className="card-dark relative">
                                    <CardHeader>
                                        <CardTitle>{journey.title}</CardTitle>
                                        <CardDescription>
                                        {journey.description || "No description"}
                                        </CardDescription>
                                        <p className="text-xs text-on-dark/55">
                                            Created {formatCreatedAt(journey.created_at)}
                                        </p>
                                    </CardHeader>
                                    <CardContent>

                                
                                    {categories.length > 0 && (
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {categories.map((category) => (
                                                <span
                                                    key={category.id}
                                                    className={cn("badge", category.color)}
                                                >
                                                    <span className="font-medium">{category.title}</span>
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    <div className="absolute right-2 top-2">
                                        <FavoriteToggleButton
                                            journeyId={journey.id}
                                            isFavorite={props.favoriteJourneyIds.includes(journey.id)}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                        )
                    })}
                </ul>
                )
            }