import {Search} from "@/components/Search";
import {DetailedForecast} from "@/components/DetailedForecast";
import {DailyForecast} from "@/components/DailyForecast";
import {HourlyForecast} from "@/components/HourlyForecast";

export default function Page() {
    return (
        <>
            <h1 className={`text-preset-2 text-neutral-0 text-center`}>How’s the sky looking today?</h1>
            <main className={`mx-auto grid content-start gap-8 xl:grid-areas-[search_search|detailed_hourly|daily_hourly]`}>
                <Search className={`xl:grid-area-[search]`} />
                <DetailedForecast className={`xl:grid-area-[detailed]`} />
                <DailyForecast className={`xl:grid-area-[daily]`} />
                <HourlyForecast className={`xl:grid-area-[hourly] xl:w-[384px]`} />
            </main>
        </>
    );
}