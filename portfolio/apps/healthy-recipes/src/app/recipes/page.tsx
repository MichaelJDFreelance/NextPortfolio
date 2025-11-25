import {createClient} from "@supabase/supabase-js";
import {RecipeList} from "@/components/RecipeList";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"


export default async function Page() {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const recipes = await supabase.from("fem_recipes").select("*");

    return (
        <main className={`flex flex-col gap-20`}>
            <header className={`flex flex-col gap-3 items-center`}>
                <h1 className={`text-neutral-900 text-preset-2-mobile md:text-preset-2`}>
                    Explore our simple, healthy recipes</h1>
                <p className={`text-neutral-800 text-preset-6`}>
                    Discover eight quick, whole-food dishes that fit real-life schedules and taste amazing. Use the
                    search bar to find a recipe by name or ingredient, or simply scroll the list and let something
                    delicious catch your eye.
                </p>
            </header>
            <section className={`flex flex-col gap-6`}>
                <div className={`flex items-center gap-4`}>
                    <Select>
                        <SelectTrigger className="py-2.5 px-4 bg-white">
                            <SelectValue placeholder="Max Prep Time" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="dark">Dark</SelectItem>
                            <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select>
                        <SelectTrigger className="py-2.5 px-4 bg-white">
                            <SelectValue placeholder="Max Cook Time" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="dark">Dark</SelectItem>
                            <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                    </Select>
                    <input className="py-2.5 px-4 bg-white rounded-button ml-auto" type="text"
                           placeholder="Search by name or ingredient…" />
                </div>
                <div className={`grid lg:grid-cols-3`}>
                    <RecipeList initialRecipes={recipes?.data||[]} />
                </div>
            </section>
        </main>
    );
}