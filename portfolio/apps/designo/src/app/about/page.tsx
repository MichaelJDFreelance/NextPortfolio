import {LetsTalk} from "@/components/sections/contact/LetsTalk";
import {LocationBadges} from "@/components/sections/locations/LocationBadges";

export default function Page() {
    return (
        <main className="flex w-full flex-col items-center gap-15 font-sans ">
            <header className={`flex flex-row max-xl:flex-col-reverse w-full rounded-lg overflow-hidden`}>
                <header className={`flex flex-col gap-8 justify-center bg-primary text-card-foreground px-24 py-16`}>
                    <h1 className={`text-preset-1`}>About Us</h1>
                    <p className={``}>
                        Founded in 2010, we are a creative agency that produces lasting results for our clients. We’ve
                        partnered with many startups, corporations, and nonprofits alike to craft designs that make
                        real impact. We’re always looking forward to creating brands, products, and digital experiences
                        that connect with our clients’ audiences.
                    </p>
                </header>
                <picture className="flex-1 min-w-[40%]">
                    <source media="(min-width: 1280px)" srcSet="/assets/about/desktop/image-about-hero.jpg" />
                    <source media="(min-width: 768px)" srcSet="/assets/about/tablet/image-about-hero.jpg" />
                    <img
                        src="/assets/about/mobile/image-about-hero.jpg"
                        alt=""
                        className="w-full h-full object-cover"
                    />
                </picture>
            </header>

            <article className={`flex flex-row-reverse max-xl:flex-col-reverse w-full rounded-lg overflow-hidden`}>
                <header className={`flex flex-col gap-8 justify-center bg-secondary text-card-foreground px-24 py-16`}>
                    <h1 className={`text-preset-2 text-primary`}>World-class talent</h1>
                    <div className={`flex flex-col gap-[1lh] text-accent`}>
                        <p>
                            We are a crew of strategists, problem-solvers, and technologists. Every design is thoughtfully
                            crafted from concept to launch, ensuring success in its given market. We are constantly updating
                            our skills in a myriad of platforms.
                        </p>
                        <p>
                            Our team is multi-disciplinary and we are not merely interested in form — content and meaning
                            are just as important. We give great importance to craftsmanship, service, and prompt delivery.
                            Clients have always been impressed with our high-quality outcomes that encapsulates their
                            brand’s story and mission.
                        </p>
                    </div>
                </header>
                <picture className="flex-1 min-w-[40%]">
                    <source media="(min-width: 1280px)" srcSet="/assets/about/desktop/image-world-class-talent.jpg" />
                    <source media="(min-width: 768px)" srcSet="/assets/about/tablet/image-world-class-talent.jpg" />
                    <img
                        src="/assets/about/mobile/image-world-class-talent.jpg"
                        alt=""
                        className="w-full h-full object-cover"
                    />
                </picture>
            </article>

            <LocationBadges />

            <article className={`flex flex-row-reverse max-xl:flex-col-reverse w-full rounded-lg overflow-hidden`}>
                <header className={`flex flex-col gap-8 justify-center bg-secondary text-card-foreground px-24 py-16`}>
                    <h1 className={`text-preset-2 text-primary`}>The real deal</h1>
                    <div className={`flex flex-col gap-[1lh] text-accent`}>
                        <p>
                            As strategic partners in our clients’ businesses, we are ready to take on any challenge as
                            our own. Solving real problems require empathy and collaboration, and we strive to bring a
                            fresh perspective to every opportunity. We make design and technology more accessible and
                            give you tools to measure success.
                        </p>
                        <p>
                            We are visual storytellers in appealing and captivating ways. By combining business and
                            marketing strategies, we inspire audiences to take action and drive real results.
                        </p>
                    </div>
                </header>
                <picture className="flex-1 min-w-[40%]">
                    <source media="(min-width: 1280px)" srcSet="/assets/about/desktop/image-real-deal.jpg" />
                    <source media="(min-width: 768px)" srcSet="/assets/about/tablet/image-real-deal.jpg" />
                    <img
                        src="/assets/about/mobile/image-real-deal.jpg"
                        alt=""
                        className="w-full h-full object-cover"
                    />
                </picture>
            </article>

            <LetsTalk />
        </main>
    );
}