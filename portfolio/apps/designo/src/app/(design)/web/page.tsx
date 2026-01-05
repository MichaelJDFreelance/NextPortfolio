import {AppLink, GraphicLink} from "@/components/sections/design/DesignLinks";
import {portfolioStyles} from "@/lib/styles";

export default function Page() {
    return (
        <>
            <header className={`bg-primary w-full flex flex-col items-center justify-center py-25 text-card-foreground gap-6 rounded-lg text-center`}>
                <h1 className={`text-preset-1 max-w-[20ch]`}>Web Design</h1>
                <p className={`text-preset-4 max-w-[40ch]`}>
                    We build websites that serve as powerful marketing tools
                    and bring memorable brand experiences.
                </p>
            </header>

            <section className={`grid xl:grid-cols-3 gap-7.5 w-full`}>
                <article className={portfolioStyles.container}>
                    <header className={portfolioStyles.header}>
                        <h2 className={portfolioStyles.heading}>EXPRESS</h2>
                        <p className={portfolioStyles.text}>
                            A multi-carrier shipping website for ecommerce businesses
                        </p>
                    </header>
                    <picture>
                        <img src="/assets/web-design/desktop/image-express.jpg" alt=""
                             className={portfolioStyles.picture} />
                    </picture>
                </article>

                <article className={portfolioStyles.container}>
                    <header className={portfolioStyles.header}>
                        <h2 className={portfolioStyles.heading}>TRANSFER</h2>
                        <p className={portfolioStyles.text}>
                            Site for low-cost money transfers and sending money within seconds
                        </p>
                    </header>
                    <picture>
                        <img src="/assets/web-design/desktop/image-transfer.jpg" alt=""
                             className={portfolioStyles.picture} />
                    </picture>
                </article>

                <article className={portfolioStyles.container}>
                    <header className={portfolioStyles.header}>
                        <h2 className={portfolioStyles.heading}>PHOTON</h2>
                        <p className={portfolioStyles.text}>
                            A state-of-the-art music player with high-resolution audio and DSP effects
                        </p>
                    </header>
                    <picture>
                        <img src="/assets/web-design/desktop/image-photon.jpg" alt=""
                             className={portfolioStyles.picture} />
                    </picture>
                </article>

                <article className={portfolioStyles.container}>
                    <header className={portfolioStyles.header}>
                        <h2 className={portfolioStyles.heading}>BUILDER</h2>
                        <p className={portfolioStyles.text}>
                            Connects users with local contractors based on their location
                        </p>
                    </header>
                    <picture>
                        <img src="/assets/web-design/desktop/image-builder.jpg" alt=""
                             className={portfolioStyles.picture} />
                    </picture>
                </article>

                <article className={portfolioStyles.container}>
                    <header className={portfolioStyles.header}>
                        <h2 className={portfolioStyles.heading}>BLOGR</h2>
                        <p className={portfolioStyles.text}>
                            Blogr is a platform for creating an online blog or publication
                        </p>
                    </header>
                    <picture>
                        <img src="/assets/web-design/desktop/image-blogr.jpg" alt=""
                             className={portfolioStyles.picture} />
                    </picture>
                </article>

                <article className={portfolioStyles.container}>
                    <header className={portfolioStyles.header}>
                        <h2 className={portfolioStyles.heading}>CAMP</h2>
                        <p className={portfolioStyles.text}>
                            Get expert training in coding, data, design, and digital marketing
                        </p>
                    </header>
                    <picture>
                        <img src="/assets/web-design/desktop/image-camp.jpg" alt=""
                             className={portfolioStyles.picture} />
                    </picture>
                </article>

            </section>

            <section className={`grid xl:grid-cols-2 gap-x-7.5 gap-y-6 w-full`}>
                 <AppLink />

                <GraphicLink />
            </section>
        </>
    );
}