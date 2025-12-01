import {ArrowLink} from "@/components/ArrowLink";

export default function StoriesPage() {
    const stories = [{
        title: "The Mountains",
        author: "John Appleseed",
        src: {
            mobile: "/assets/stories/mobile/mountains.jpg",
            tablet: "/assets/stories/mobile/mountains.jpg",
            desktop: "/assets/stories/desktop/mountains.jpg",
        }
    },
        {
            title: "The Mountains",
            author: "John Appleseed",
            src: {
                mobile: "/assets/stories/mobile/mountains.jpg",
                tablet: "/assets/stories/mobile/mountains.jpg",
                desktop: "/assets/stories/desktop/mountains.jpg",
            }
        }] as any[];

    return (
        <main>
            <header className={`flex flex-col-reverse md:grid grid-areas-overlay bg-black text-white`}>
                <div className={`flex flex-col justify-center gap-4 my-18 mx-8 grid-area-overlay z-10 md:max-w-[50%]`}>
                    <span className={`text-preset-4`}>LAST MONTH’S FEATURED STORY</span>
                    <h1 className={`text-preset-h2 uppercase max-w-[12ch]`}>HAZY FULL MOON OF APPALACHIA</h1>
                    <span className={`text-preset-3`}>
                        <time className={`opacity-75`}>March 2nd 2020 </time>
                        by John Appleseed
                    </span>
                    <p className={`text-preset-2 opacity-60`}>
                        The dissected plateau area, while not actually made up of geological mountains, is popularly called
                        &#34;mountains,&#34; especially in eastern Kentucky and West Virginia, and while the ridges are not high,
                        the terrain is extremely rugged.
                    </p>
                    <ArrowLink text={`read the story`} className={`mt-2 uppercase`} />
                </div>
                <picture className={`grid-area-overlay`}>
                    <source media={`(min-width: 80rem)`} srcSet={"/assets/stories/desktop/moon-of-appalacia.jpg"} />
                    <source media={`(min-width: 48rem)`} srcSet={"/assets/stories/tablet/moon-of-appalacia.jpg"} />
                    <img className={`w-full`} src="/assets/stories/mobile/moon-of-appalacia.jpg" alt="Create and share your photo stories." />
                </picture>
            </header>
            <section className={`grid md:grid-cols-2 xl:grid-cols-4`}>
                {stories.map((story) => (
                    <article key={story.id} className={`grid relative grid-areas-overlay 
                    before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-b before:from-black/0 before:to-black/70 before:z-10`}>
                        <div className={`z-20 text-white flex flex-col gap-4 grid-area-overlay px-8 py-10 mt-auto `}>
                            <header className={`flex flex-col gap-1`}>
                                <h2 className={`text-preset-2`}>{story.title}</h2>
                                <span className={`text-preset-3`}>by {story.author}</span>
                            </header>
                            <hr/>
                            <ArrowLink text={`read story`} className={`justify-between uppercase`}/>
                        </div>
                        <picture className={`grid-area-overlay`}>
                            <source media={`(min-width: 80rem)`} srcSet={story.src.desktop} />
                            <source media={`(min-width: 48rem)`} srcSet={story.src.tablet} />
                            <img className={`w-full`} src={story.src.mobile} alt={story.alt} />
                        </picture>
                    </article>
                ))}
            </section>
        </main>
    );
}