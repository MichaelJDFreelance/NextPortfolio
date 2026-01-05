import IconSearch from "@portfolio/icons/movies/icon-search"
import {useStore} from "@tanstack/react-store";
import {queryStore} from "@/lib/state/movieStore";

export function Search() {
    const query = useStore(queryStore);

    return (
        <div className={`flex gap-8 items-center`}>
            <IconSearch className={`h-8 w-8`} />
            <input value={query} onChange={e=>queryStore.setState(e.target.value)}
                placeholder={"Search for movies or TV series"} className={`flex-1 w-full`} />
        </div>
    );
}