import {portfolioStyles} from "@/lib/styles";
import {GraphicLink, WebLink} from "@/components/sections/design/DesignLinks";

export default function Page() {
    return (
        <>
            <header className={`bg-primary w-full flex flex-col items-center justify-center py-25 text-card-foreground gap-6 rounded-lg text-center`}>
                <h1 className={`text-preset-1 max-w-[20ch]`}>App Design</h1>
                <p className={`text-preset-4 max-w-[40ch]`}>
                    Our mobile designs bring intuitive digital solutions
                    to your customers right at their fingertips.
                </p>
            </header>

            <section className={`grid xl:grid-cols-3 gap-7.5 w-full`}>
                <article className={portfolioStyles.container}>
                    <header className={portfolioStyles.header}>
                        <h2 className={portfolioStyles.heading}>AIRFILTER</h2>
                        <p className={portfolioStyles.text}>
                            Solving the problem of poor indoor air quality by filtering the air
                        </p>
                    </header>
                    <picture>
                        <img src="/assets/app-design/desktop/image-airfilter.jpg" alt=""
                             className={portfolioStyles.picture} />
                    </picture>
                </article>

                <article className={portfolioStyles.container}>
                    <header className={portfolioStyles.header}>
                        <h2 className={portfolioStyles.heading}>EYECAM</h2>
                        <p className={portfolioStyles.text}>
                            Product that lets you edit your favorite photos and videos at any time
                        </p>
                    </header>
                    <picture>
                        <img src="/assets/app-design/desktop/image-eyecam.jpg" alt=""
                             className={portfolioStyles.picture} />
                    </picture>
                </article>

                <article className={portfolioStyles.container}>
                    <header className={portfolioStyles.header}>
                        <h2 className={portfolioStyles.heading}>FACEIT</h2>
                        <p className={portfolioStyles.text}>
                            Get to meet your favorite internet superstar with the faceit app
                        </p>
                    </header>
                    <picture>
                        <img src="/assets/app-design/desktop/image-faceit.jpg" alt=""
                             className={portfolioStyles.picture} />
                    </picture>
                </article>

                <article className={portfolioStyles.container}>
                    <header className={portfolioStyles.header}>
                        <h2 className={portfolioStyles.heading}>TODO</h2>
                        <p className={portfolioStyles.text}>
                            A todo app that features cloud sync with light and dark mode
                        </p>
                    </header>
                    <picture>
                        <img src="/assets/app-design/desktop/image-todo.jpg" alt=""
                             className={portfolioStyles.picture} />
                    </picture>
                </article>

                <article className={portfolioStyles.container}>
                    <header className={portfolioStyles.header}>
                        <h2 className={portfolioStyles.heading}>LOOPSTUDIOS</h2>
                        <p className={portfolioStyles.text}>
                            A VR experience app made for Loopstudios
                        </p>
                    </header>
                    <picture>
                        <img src="/assets/app-design/desktop/image-loopstudios.jpg" alt=""
                             className={portfolioStyles.picture} />
                    </picture>
                </article>
            </section>

            <section className={`grid xl:grid-cols-2 gap-x-7.5 gap-y-6 w-full`}>
                <WebLink />

                <GraphicLink />
            </section>
        </>
    );
}