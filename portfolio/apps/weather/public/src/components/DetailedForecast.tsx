"use client"

import {useLocation} from "@/context/LocationContext";
import {useWeather} from "@/hooks/fetchWeather";

export function DetailedForecast({className}: { className?: string}) {
    const {currentTime, choice:city} = useLocation();
    const { data, isLoading, error } = useWeather();

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Something went wrong.</p>;

    return (
        <article className={`grid content-start gap-5 ${className}`}>
            <h2 className={`sr-only`}>Detailed Forecast</h2>
            <section className={`flex max-xl:flex-col items-center gap-4 px-6 py-10 rounded-[20px] h-[286px]
                    bg-gradient-to-br from-blue-500 to-blue-700
                    bg-[url(/assets/images/bg-today-small.svg)] md:bg-[url(/assets/images/bg-today-large.svg)] bg-no-repeat bg-cover bg-center`}>
                <header className={`flex-1 grid gap-3 content-start max-xl:justify-items-center text-preset-4`}>
                    <h3 className={`text-center`}>{city?.name}, {city?.country}</h3>
                    <time className={`text-preset-6 opacity-80`}>{currentTime}</time>
                </header>
                <section className={`flex items-center justify-around gap-5`}>
                    <img src="/assets/images/icon-rain.webp" className={`w-30`} />
                    <span className={`text-preset-1 font-dm-sans md:pr-4`}>{data?.current?.temperature_2m?.toFixed(0)}°</span>
                </section>
            </section>
            <dl className={`grid grid-cols-2 gap-4 md:grid-cols-4`}>
                <div className={`grid content-start gap-6 bg-neutral-800 p-5 rounded-[12px]`}>
                    <dt className={`text-preset-6`}>Feels Like</dt>
                    <dd className={`text-preset-3`}>{data?.current?.apparent_temperature}°</dd>
                </div>
                <div className={`grid content-start gap-6 bg-neutral-800 p-5 rounded-[12px]`}>
                    <dt className={`text-preset-6`}>Humidity</dt>
                    <dd className={`text-preset-3`}>{data?.current?.relative_humidity_2m}%</dd>
                </div>
                <div className={`grid content-start gap-6 bg-neutral-800 p-5 rounded-[12px]`}>
                    <dt className={`text-preset-6`}>Wind</dt>
                    <dd className={`text-preset-3`}>{data?.current?.wind_speed_10m} km/h</dd>
                </div>
                <div className={`grid content-start gap-6 bg-neutral-800 p-5 rounded-[12px]`}>
                    <dt className={`text-preset-6`}>Precipitation</dt>
                    <dd className={`text-preset-3`}>{data?.current?.rain} mm</dd>
                </div>
            </dl>
        </article>
    );
}