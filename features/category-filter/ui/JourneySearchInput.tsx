'use client'
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

export default function JourneySearchInput() {

    const router = useRouter()
    const searchParams = useSearchParams()

    const handleInput = (searchItem: string) => {
    
        const basePath = "/my-journeys"
        const params = new URLSearchParams(searchParams.toString())
        
        if(searchItem.length > 0){
            params.set("q", searchItem)
            router.push(params.toString() ? `${basePath}?${params.toString()}` : basePath)
            router.refresh()
        } else {
            params.delete("q")
            router.push(params.toString() ? `${basePath}?${params.toString()}` : basePath)
            router.refresh()
        }   
    }
    return(
        <div className="relative w-full max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
            <input
                type="text"
                id="searchTerm"
                placeholder="Search journeys..."
                onChange={(e) => handleInput(e.target.value)}
                className="h-9 w-full rounded-lg border border-zinc-200 bg-white pl-9 pr-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-600 dark:focus:ring-zinc-800"
            />
        </div>
    )
}