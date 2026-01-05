import {AppLink, WebLink} from "@/components/sections/design/DesignLinks";
import {portfolioStyles} from "@/lib/styles";

export default function Page() {
    return (
        <>
            <header className={`bg-primary w-full flex flex-col items-center justify-center py-25 text-card-foreground gap-6 rounded-lg text-center`}>
                <h1 className={`text-preset-1 max-w-[20ch]`}>Graphic Design</h1>
                <p className={`text-preset-4 max-w-[40ch]`}>
                    We deliver eye-catching branding materials that are
                    tailored to meet your business objectives.
                </p>
            </header>

            <section className={`grid xl:grid-cols-3 gap-7.5 w-full`}>
                <article className={portfolioStyles.container}>
                    <header className={portfolioStyles.header}>
                        <h2 className={portfolioStyles.heading}>TIM BROWN</h2>
                        <p className={portfolioStyles.text}>
                            A book cover designed for Tim Brown’s new release, ‘Change’
                        </p>
                    </header>
                    <picture>
                        <img src="/assets/graphic-design/desktop/image-change.jpg" alt=""
                             className={portfolioStyles.picture} />
                    </picture>
                </article>

                <article className={portfolioStyles.container}>
                    <header className={portfolioStyles.header}>
                        <h2 className={portfolioStyles.heading}>BOXED WATER</h2>
                        <p className={portfolioStyles.text}>
                            A simple packaging concept made for Boxed Water
                        </p>
                    </header>
                    <picture>
                        <img src="/assets/graphic-design/desktop/image-boxed-water.jpg" alt=""
                             className={portfolioStyles.picture} />
                    </picture>
                </article>

                <article className={portfolioStyles.container}>
                    <header className={portfolioStyles.header}>
                        <h2 className={portfolioStyles.heading}>SCIENCE!</h2>
                        <p className={portfolioStyles.text}>
                            A poster made in collaboration with the Federal Art Project
                        </p>
                    </header>
                    <picture>
                        <img src="/assets/graphic-design/desktop/image-science.jpg" alt=""
                             className={portfolioStyles.picture} />
                    </picture>
                </article>
            </section>

            <section className={`grid xl:grid-cols-2 gap-x-7.5 gap-y-6 w-full`}>
                <WebLink />

                <AppLink />
            </section>
        </>
    );
}