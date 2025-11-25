"use client";

import { useState } from "react";
import Fuse from "fuse.js";
import { useCombobox } from "downshift";
import cities from "@/cities15000.json";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import { useLocation } from "@/context/LocationContext";

countries.registerLocale(enLocale);

type City = {
    id?: string | number;
    name: string;
    loc: string; // country code
    pop: number;
    lat: number;
    lng: number;
};

const fuse = new Fuse(cities, {
    keys: ["name"],
    threshold: 0.4,
    findAllMatches: true,
    minMatchCharLength: 3,
    shouldSort: true,
    sortFn: (a, b) => {
        const scoreA = a.score;
        const scoreB = b.score;

        if (scoreA !== scoreB) {
            return scoreA - scoreB; // lower = better match
        }

        const popA = Number(a.item.pop) || 0;
        const popB = Number(b.item.pop) || 0;
        return popB - popA; // higher population first
    },
});

export function Search({ className }: { className?: string }) {
    const { setChoice } = useLocation();
    const [results, setResults] = useState<City[]>([]);

    const {
        isOpen,
        getMenuProps,
        getInputProps,
        getItemProps,
        highlightedIndex,
        inputValue,
    } = useCombobox<City>({
        items: results,
        itemToString: (item) =>
            item
                ? `${item.name}, ${countries.getName(item.loc, "en")}`
                : "",
        onInputValueChange: ({ inputValue }) => {
            if (!inputValue || inputValue.trim().length === 0) {
                setResults([]);
                return;
            }
            const found = fuse.search(inputValue, { limit: 50 }).map((r) => r.item);

            // sort by population descending, top 10
            const sorted = found
                .sort((a, b) => b.pop - a.pop)
                .slice(0, 10);

            setResults(sorted);
        },
        onSelectedItemChange: ({ selectedItem }) => {
            if (selectedItem) {
                setChoice({
                    ...selectedItem,
                    country: countries.getName(selectedItem.loc, "en"),
                });
            }
        },
    });

    return (
        <div className={`relative flex flex-col gap-3 ${className}`}>
            {/* Input */}
            <input
                {...getInputProps({
                    placeholder: "Search for a place...",
                })}
                className="flex-1 py-4 px-6 bg-neutral-800 rounded-[12px]
          text-preset-5 font-normal text-neutral-200
          placeholder:text-neutral-400 focus:outline-none"
            />

            {/* Dropdown */}
            <ul
                {...getMenuProps()}
                className="absolute top-full mt-2 w-full z-10 bg-neutral-900 rounded-[12px] shadow-lg max-h-64 overflow-y-auto"
            >
                {isOpen &&
                    results.map((city, index) => {
                        const countryName = countries.getName(city.loc, "en");
                        return (
                            <li
                                key={
                                    city.id ??
                                    `${city.name}-${city.loc}-${city.lat}-${city.lng}`
                                }
                                {...getItemProps({ item: city, index })}
                                className={`px-4 py-2 cursor-pointer text-neutral-200
                  ${highlightedIndex === index ? "bg-neutral-800 text-white" : "hover:bg-neutral-800"}
                `}
                            >
                                {city.name}, {countryName}{" "}
                                <span className="text-neutral-400 text-sm">
                  (pop {city.pop.toLocaleString()})
                </span>
                            </li>
                        );
                    })}
            </ul>

            {/* No results */}
            {isOpen && results.length === 0 && inputValue?.trim() !== "" && (
                <div className="absolute top-full mt-2 w-full z-10 bg-neutral-900 rounded-[12px] shadow-lg">
                    <div className="px-4 py-3 text-neutral-400">No results found.</div>
                </div>
            )}
        </div>
    );
}
