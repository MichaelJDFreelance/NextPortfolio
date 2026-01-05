import IconTV from "@portfolio/icons/movies/icon-category-tv";
import IconMovie from "@portfolio/icons/movies/icon-category-movie";
import {Category} from "@/lib/types";

export function CategoryIcon({category}:{category:Category}) {
    switch (category) {
        case "TV Series":
            return (
                <IconTV className={`translate-y-0.25`} />
            )
        case "Movie":
            return (
                <IconMovie className={`translate-y-0.25`} />
            )
        default:
            return (
                <></>
            )
    }
}