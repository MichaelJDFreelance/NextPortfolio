export type Category = string;
export type Rating = string
export type Entertainment = {
    id?: string;
    "title": string,
    "thumbnail": {
        "trending"?: {
            "small": string,
            "large": string
        },
        "regular": {
            "small": string,
            "medium": string,
            "large": string
        }
    },
    "year": number,
    "category": Category,
    "rating": Rating,
    "isBookmarked": boolean,
    "isTrending": boolean
}