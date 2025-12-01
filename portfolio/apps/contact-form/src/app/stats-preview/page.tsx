export default function Page() {
    return (
        <div className={`min-h-screen bg-background min-w-screen stats-preview flex items-center justify-center`}>
            <main>
                <article className={`flex max-md:flex-col-reverse bg-card-foreground text-white rounded-sm max-w-[1110px]`}>
                    <section className={`flex flex-col gap-10 md:gap-18 p-18 max-md:items-center max-md:text-center`}>
                        <header className={`flex flex-col gap-6 max-md:items-center max-md:text-center`}>
                            <h1 className={`text-lg max-md:max-w-[13ch]`}>Get <span className={`text-primary`}>insights</span> that help your business grow.</h1>
                            <p className={`text-sm opacity-75 max-w-[28ch] md:max-w-[40ch]`}>Discover the benefits of data analytics and make better decisions regarding revenue,
                                customer experience, and overall efficiency.</p>
                        </header>

                        <dl className={`flex max-md:flex-col gap-6 md:gap-4`}>
                           <div className={`flex flex-col-reverse gap-0.5`}>
                               <dt className={`text-sm opacity-60 uppercase`}>Companies</dt>
                               <dd className={`text-md`}>10k+</dd>
                           </div>
                            <div className={`flex flex-col-reverse gap-0.5`}>
                                <dt className={`text-sm opacity-60 uppercase`}>Templates</dt>
                                <dd className={`text-md`}>314</dd>
                            </div>
                            <div className={`flex flex-col-reverse gap-0.5`}>
                                <dt className={`text-sm opacity-60 uppercase`}>Queries</dt>
                                <dd className={`text-md`}>12M+</dd>
                            </div>
                        </dl>
                    </section>
                </article>
            </main>
        </div>
    );
}