import {LetsTalk} from "@/components/sections/contact/LetsTalk";

export default function Page() {
    return (
        <main className={`flex flex-col gap-8 w-full`}>
            <article className={`flex max-xl:flex-col gap-7.5 w-full`}>
                <section className={`grid grid-cols-2 gap-x-7.5 gap-y-6 bg-secondary content-center px-24`}>
                    <h2 className={`col-span-2 text-preset-2 text-primary`}>Canada</h2>
                    <address className={`not-italic`}>
                        <h2 className={`font-bold`}>Designo Central Office</h2>
                        3886 Wellington Street<br/>Toronto, Ontario M9C 3J5
                    </address>
                    <address className={`not-italic`}>
                        <h2 className={`font-bold`}>Contact</h2>
                        <dl className={`flex flex-col`}>
                            <div className={`flex`}>
                                <dt>P:</dt>
                                <dd>+1 253-863-8967</dd>
                            </div>
                            <div className={`flex`}>
                                <dt>M:</dt>
                                <dd>contact@designo.co</dd>
                            </div>
                        </dl>
                    </address>
                </section>
                <picture className="flex-1">
                    <source media="(min-width: 1280px)" srcSet="/assets/locations/desktop/image-map-canada.png" />
                    <img
                        src="/assets/locations/tablet/image-map-canada.png"
                        alt=""
                        className="w-full  object-cover"
                    />
                </picture>
            </article>

            <article className={`flex flex-row-reverse max-xl:flex-col gap-7.5 w-full`}>
                <section className={`grid grid-cols-2 gap-x-7.5 gap-y-6 bg-secondary content-center px-24`}>
                    <h2 className={`col-span-2 text-preset-2 text-primary`}>Canada</h2>
                    <address className={`not-italic`}>
                        <h2 className={`font-bold`}>Designo Central Office</h2>
                        3886 Wellington Street<br/>Toronto, Ontario M9C 3J5
                    </address>
                    <address className={`not-italic`}>
                        <h2 className={`font-bold`}>Contact</h2>
                        <dl className={`flex flex-col`}>
                            <div className={`flex`}>
                                <dt>P:</dt>
                                <dd>+1 253-863-8967</dd>
                            </div>
                            <div className={`flex`}>
                                <dt>M:</dt>
                                <dd>contact@designo.co</dd>
                            </div>
                        </dl>
                    </address>
                </section>
                <picture className="flex-1">
                    <source media="(min-width: 1280px)" srcSet="/assets/locations/desktop/image-map-canada.png" />
                    <img
                        src="/assets/locations/tablet/image-map-canada.png"
                        alt=""
                        className="w-full  object-cover"
                    />
                </picture>
            </article>

            <article className={`flex max-xl:flex-col gap-7.5 w-full`}>
                <section className={`grid grid-cols-2 gap-x-7.5 gap-y-6 bg-secondary content-center px-24`}>
                    <h2 className={`col-span-2 text-preset-2 text-primary`}>Canada</h2>
                    <address className={`not-italic`}>
                        <h2 className={`font-bold`}>Designo Central Office</h2>
                        3886 Wellington Street<br/>Toronto, Ontario M9C 3J5
                    </address>
                    <address className={`not-italic`}>
                        <h2 className={`font-bold`}>Contact</h2>
                        <dl className={`flex flex-col`}>
                            <div className={`flex`}>
                                <dt>P:</dt>
                                <dd>+1 253-863-8967</dd>
                            </div>
                            <div className={`flex`}>
                                <dt>M:</dt>
                                <dd>contact@designo.co</dd>
                            </div>
                        </dl>
                    </address>
                </section>
                <picture className="flex-1">
                    <source media="(min-width: 1280px)" srcSet="/assets/locations/desktop/image-map-canada.png" />
                    <img
                        src="/assets/locations/tablet/image-map-canada.png"
                        alt=""
                        className="w-full  object-cover"
                    />
                </picture>
            </article>

            <LetsTalk />
        </main>
    );
}