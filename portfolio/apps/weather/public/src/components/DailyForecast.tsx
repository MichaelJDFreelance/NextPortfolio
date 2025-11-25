function ForecastDay() {
    return (
        <section className={`flex flex-col gap-4 items-center py-4 px-2.5 bg-neutral-800 rounded-[12px]`}>
            <h3 className={`text-preset-5 font-medium`}>Tue</h3>
            <img src="/assets/images/icon-rain.webp" />
            <span className={`w-full flex justify-between text-preset-7`}>
                <span>20°</span>
                <span>14°</span>
            </span>
        </section>
    )
}

export function DailyForecast({className}: { className?: string}) {
    return (
        <article className={`grid content-start gap-4 ${className}`}>
            <h2 className={`text-preset-5`}>Daily Forecast</h2>
            <section className={`grid grid-cols-3 gap-4 md:grid-cols-7`}>
                <ForecastDay />
                <ForecastDay />
                <ForecastDay />
                <ForecastDay />
                <ForecastDay />
                <ForecastDay />
                <ForecastDay />
            </section>
        </article>
    );
}