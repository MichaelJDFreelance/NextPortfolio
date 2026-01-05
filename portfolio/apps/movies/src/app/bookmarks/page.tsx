"use client"

import {Search} from "@/components/Search";
import {Entertainment} from "@/lib/types";
import {Item} from "@/components/Item";
import {isBookmarked, isMovie, isTV, searchResults} from "@/lib/state/movieStore";
import {useStore} from "@tanstack/react-store";

export default function Home() {
    const movies = useStore(searchResults);

  return (
    <div className="flex min-h-screen items-center w-full">
      <main className="flex min-h-screen w-full flex-col gap-10 p-8">
          <Search />
          <section className={`flex flex-col gap-6`}>
              <h2 className={`text-preset-1`}>Bookmarked Movies</h2>
              <div className={`grid grid-cols-4 gap-10`}>
                  {movies.filter(isBookmarked).filter(isMovie).map((item:Entertainment) => (
                      <Item item={item} key={item.title} />
                  ))}
              </div>
          </section>
          <section className={`flex flex-col gap-6`}>
              <h2 className={`text-preset-1`}>Bookmarked TV Series</h2>
              <div className={`grid grid-cols-4 gap-10`}>
                  {movies.filter(isBookmarked).filter(isTV).map((item:Entertainment) => (
                      <Item item={item} key={item.title} />
                  ))}
              </div>
          </section>
      </main>
    </div>
  );
}
