import { useQuery } from "@tanstack/react-query";
import {useLocation} from "@/context/LocationContext";
import {buildWeatherUrl} from "@/lib/weatherParams";

const fetchWeather = async (lat: number, lng: number) => {
    const res = await fetch(buildWeatherUrl(lat, lng));
    if (!res.ok) throw new Error("Failed to fetch weather");
    return res.json();
};

export const useWeather = () => {
    const { choice } = useLocation();

    return useQuery({
        queryKey: ["weather", choice?.lat, choice?.lng],
        queryFn: () => fetchWeather(choice.lat, choice.lng),
        enabled: !!choice, // only run if a choice is set
        staleTime: 1000 * 60, // cache for 1 min
    });
};