import {Derived, Store} from "@tanstack/react-store"
import Fuse from "fuse.js";

type RecipesState = {
    recipes: any[] | undefined,
    tags: Record<string, boolean>,
    searchTerm: string,
    sortBy: string,
}

export const recipesStore = new Store<RecipesState>({
    recipes: undefined,
    tags: {},
    searchTerm: "",
    sortBy: "title",
});

const sortOptions: Record<
    NonNullable<RecipesState["sortBy"]>,
    (a: any, b: any) => number
> = {
    title: (a, b) => a.title.localeCompare(b.title),
    createdAt: (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
};

export const filteredRecipes = new Derived<any[]>({
    deps: [recipesStore],
    fn: () => {
        const { recipes, tags, searchTerm, sortBy } = recipesStore.state;

        const activeTags = Object.keys(tags);

        let result = recipes||[];

        // Tag AND filter (every active tag must be present)
        if (activeTags.length) {
            result = result.filter(b => activeTags.every(t => b.tags && b.tags.includes(t)));
        }

        // 2️⃣ Fuzzy search
        if (searchTerm && searchTerm.trim()) {
            const fuse = new Fuse(result, {
                keys: ["title", "url", "tags"],
                threshold: 0.3, // lower = stricter match
            });
            result = fuse.search(searchTerm.trim()).map((res:any) => res.item);
        }

        // Sort
        const sorter = sortOptions?.[sortBy as keyof typeof sortOptions];
        result = sorter ? [...result].sort(sorter) : result;

        return result;
    },
});