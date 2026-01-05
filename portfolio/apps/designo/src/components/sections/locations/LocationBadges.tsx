export function LocationBadges() {
    return (
        <section className={`grid xl:grid-cols-3 gap-21 w-full`}>
            <h2 className={`sr-only`}>Our locations</h2>

            <article className={`flex flex-col-reverse gap-12 items-center text-center`}>
                <header className={`flex flex-col gap-8`}>
                    <h2 className={`text-accent`}>CANADA</h2>
                    <button className={`bg-primary text-card-foreground p-4.5 rounded-lg`}>SEE LOCATION</button>
                </header>
                <picture className={`div rounded-full bg-secondary`}>
                    <img src="/assets/shared/desktop/illustration-canada.svg" alt="" className="w-full h-full object-cover" />
                </picture>
            </article>

            <article className={`flex flex-col-reverse gap-12 items-center text-center`}>
                <header className={`flex flex-col gap-8`}>
                    <h2 className={`text-accent`}>AUSTRALIA</h2>
                    <button className={`bg-primary text-card-foreground p-4.5 rounded-lg`}>SEE LOCATION</button>
                </header>
                <picture className={`div rounded-full bg-secondary`}>
                    <img src="/assets/shared/desktop/illustration-australia.svg" alt="" className="w-full h-full object-cover" />
                </picture>
            </article>

            <article className={`flex flex-col-reverse gap-12 items-center text-center`}>
                <header className={`flex flex-col gap-8`}>
                    <h2 className={`text-accent`}>UNITED KINGDOM</h2>
                    <button className={`bg-primary text-card-foreground p-4.5 rounded-lg`}>SEE LOCATION</button>
                </header>
                <picture className={`div rounded-full bg-secondary`}>
                    <img src="/assets/shared/desktop/illustration-united-kingdom.svg" alt="" className="w-full h-full object-cover" />
                </picture>
            </article>
        </section>
    );
}