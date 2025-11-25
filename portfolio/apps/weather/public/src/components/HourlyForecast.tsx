function ForecastHour() {
    return (
        <section className={`flex gap-2 items-center bg-neutral-700 py-2.5 px-3 rounded-[8px]`}>
            <h3 className={`text-preset-5 font-medium mr-auto`}>3 PM</h3>
            <span className={`text-preset-7`}>20°</span>
        </section>
    )
}

export function HourlyForecast({className}: { className?: string}) {
    return (
        <article className={`bg-neutral-800 rounded-[20px] py-5 px-4 grid content-start gap-4 ${className}`}>
            <header className={`flex items-center justify-between`}>
                <h2 className={`text-preset-5`}>Hourly Forecast</h2>
                <div className={`text-preset-8 line-height-normal`}>Tuesday</div>
            </header>
            <ForecastHour />
        </article>
    );
}