import {Derived, Store} from "@tanstack/react-store";
import Fuse from "fuse.js";

type BookmarkProps = {
    bookmarks: any[],
    tags: Record<string, string>
    sortBy: string|undefined,
    searchTerm: string|undefined,
}

export const bookmarkStore = new Store<BookmarkProps>({
    bookmarks: [],
    tags: {},
    sortBy: undefined,
    searchTerm: undefined,
})

export const updateSearchTerm = (term: string) => {
    bookmarkStore.setState(prev=>{
        return {
            ...prev,
            searchTerm: term
        }
    })
}

export const setTag = (tagName: string, shouldInclude: boolean) => {
    bookmarkStore.setState(prev=>{
        const {[tagName]: _, ...rest} = prev.tags;
        return {
            ...prev,
            tags: shouldInclude ? {
                ...prev.tags,
                [tagName]: tagName
            } : rest
        }
    })
}

const sortOptions: Record<
    NonNullable<BookmarkProps["sortBy"]>,
    (a: any, b: any) => number
> = {
    title: (a, b) => a.title.localeCompare(b.title),
    createdAt: (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
};

// ✅ Derived: filtered + searched + sorted bookmarks
export const filteredBookmarks = new Derived<any[]>({
    deps: [bookmarkStore],
    fn: () => {
        const { bookmarks, tags, searchTerm, sortBy } = bookmarkStore.state;

        const activeTags = Object.keys(tags);

        let result = bookmarks;

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
            result = fuse.search(searchTerm.trim()).map((res) => res.item);
        }

        // Sort
        const sorter = sortOptions?.[sortBy as keyof typeof sortOptions];
        result = sorter ? [...result].sort(sorter) : result;

        return result;
    },
});

// Must mount once (e.g., at app startup)
filteredBookmarks.mount();

export const filteredTags = new Derived<any[]>({
    deps: [bookmarkStore],
    fn: () => {
        return filteredBookmarks.state?.reduce((acc, bookmark) => {
            if (bookmark.tags && Array.isArray(bookmark.tags)) {
                for (const tag of bookmark.tags) {
                    acc[tag] = (acc[tag] || 0) + 1;
                }
                return acc;
            }
            return acc;
        }, {})
    }
})

filteredTags.mount();