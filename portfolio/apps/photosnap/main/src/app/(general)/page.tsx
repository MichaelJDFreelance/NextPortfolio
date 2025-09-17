import {ArrowLink} from "@/components/ArrowLink";

export default function HomePage()  {
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
        <main className={`max-w-[1080px] mx-auto`}>
            <header className={`flex flex-col-reverse md:flex-row bg-black text-white`}>
                <div className={`flex flex-col gap-4 my-18 justify-center`}>
                    <div className={`h-fit relative px-8`}>
                        <div className={`absolute bg-gradient-to-tr from-yellow-500 via-pink-800 to-blue-500 h-full w-1.5 left-0`}></div>
                        <h1 className={`text-preset-h2 uppercase max-w-[15ch]`}>Create and share your photo stories. </h1>
                        <p className={`text-preset-2 opacity-60 max-w-[50ch]`}>
                            Photosnap is a platform for photographers and visual storytellers. We make it easy to share photos,
                            tell stories and connect with others.
                        </p>
                        <ArrowLink colorStyle={`light`} text={`get an invite`} className={`mt-2 uppercase`} />
                    </div>
                </div>
                <picture className={`md:ml-auto`}>
                    <source media={`(min-width: 80rem)`} srcSet={`/assets/home/desktop/create-and-share.jpg`} />
                    <source media={`(min-width: 48rem)`} srcSet={`/assets/home/tablet/create-and-share.jpg`} />
                    <img className={`w-full`} src="/assets/home/mobile/create-and-share.jpg" alt="Create and share your photo stories." />
                </picture>
            </header>
            <article className={`flex flex-col-reverse md:flex-row-reverse`}>
                <div className={`flex flex-col gap-4 mx-8 my-20 justify-center`}>
                    <h2 className={`text-preset-h2 max-w-[12ch]`}>BEAUTIFUL STORIES EVERY TIME</h2>
                    <p className={`opacity-60 text-preset-2 !leading-[25px] max-w-[50ch]`}>
                        We provide design templates to ensure your stories look terrific. Easily add photos, text, embed
                        maps and media from other networks. Then share your story with everyone.
                    </p>
                    <ArrowLink text={`VIEW THE STORIES`} className={`mt-2`} />
                </div>
                <picture className={`md:mr-auto`}>
                    <source media={`(min-width: 80rem)`} srcSet={`/assets/home/desktop/beautiful-stories.jpg`} />
                    <source media={`(min-width: 48rem)`} srcSet={`/assets/home/tablet/beautiful-stories.jpg`} />
                    <img className={`w-full`} src="/assets/home/mobile/beautiful-stories.jpg" alt="Experience the beauty of your stories." />
                </picture>
            </article>
            <article className={`flex flex-col-reverse md:flex-row`}>
                <div className={`flex flex-col gap-4 mx-8 my-20 justify-center`}>
                    <h2 className={`text-preset-h2 max-w-[12ch]`}>DESIGNED FOR EVERYONE</h2>
                    <p className={`opacity-60 text-preset-2 !leading-[25px] max-w-[50ch]`}>
                        Photosnap can help you create stories that resonate with your audience.  Our tool is designed for
                        photographers of all levels, brands, businesses you name it.
                    </p>
                    <ArrowLink text={`VIEW THE STORIES`} className={`mt-2`} />
                </div>
                <picture className={`md:ml-auto`}>
                    <source media={`(min-width: 80rem)`} srcSet={`/assets/home/desktop/designed-for-everyone.jpg`} />
                    <source media={`(min-width: 48rem)`} srcSet={`/assets/home/tablet/designed-for-everyone.jpg`} />
                    <img className={`w-full`} src="/assets/home/mobile/designed-for-everyone.jpg" alt="Empowers you to share experiences" />
                </picture>
            </article>
            <section className={`grid md:grid-cols-2 xl:grid-cols-4`}>
                {stories.map((story) => (
                    <article key={story.id} className={`group grid relative grid-areas-[overlay] hover:translate-y-[-10px]
                    before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-b before:from-black/0 before:to-black/70 before:z-10`}>
                        <div className={`absolute bg-gradient-to-tr from-yellow-500 via-pink-800 to-blue-500 h-0 group-hover:h-1.5 w-full top-full`}></div>
                        <div className={`z-20 text-white flex flex-col gap-4 grid-area-[overlay] px-8 py-10 mt-auto `}>
                            <header className={`flex flex-col gap-1`}>
                                <h2 className={`text-preset-2`}>{story.title}</h2>
                                <span className={`text-preset-3`}>by {story.author}</span>
                            </header>
                            <hr/>
                            <ArrowLink colorStyle={`light`} text={`read story`} className={`justify-between uppercase`}/>
                        </div>
                        <picture className={`grid-area-[overlay]`}>
                            <source media={`(min-width: 80rem)`} srcSet={story.src.desktop} />
                            <source media={`(min-width: 48rem)`} srcSet={story.src.tablet} />
                            <img className={`w-full`} src={story.src.mobile} alt={story.alt} />
                        </picture>
                    </article>
                ))}
            </section>
            <article>
                <ul className={`grid xl:grid-cols-3 gap-14 py-20 px-8 text-center`}>
                    <li className={`flex flex-col-reverse gap-12 items-center`}>
                        <div className={`flex flex-col gap-4`}>
                            <h2 className={`text-preset-1`}>100% Responsive</h2>
                            <p className={`text-preset-2 opacity-60 !leading-[25px] max-w-[50ch]`}>
                                No matter which the device you’re on, our site is fully responsive and stories look
                                beautiful on any screen.
                            </p>
                        </div>
                        <div className={`w-18 h-18 flex items-center`}>
                            <img src="/assets/features/desktop/responsive.svg" alt="Create and share your photo stories." />
                        </div>
                    </li>
                    <li className={`flex flex-col-reverse gap-12 items-center`}>
                        <div className={`flex flex-col gap-4`}>
                            <h2 className={`text-preset-1`}>No Photo Upload Limit</h2>
                            <p className={`text-preset-2 opacity-60 !leading-[25px] max-w-[50ch]`}>
                                Our tool has no limits on uploads or bandwidth. Freely upload in bulk and share all of
                                your stories in one go.
                            </p>
                        </div>
                        <div className={`w-18 h-18 flex items-center`}>
                            <img src="/assets/features/desktop/no-limit.svg" alt="Create and share your photo stories." />
                        </div>
                    </li>
                    <li className={`flex flex-col-reverse gap-12 items-center`}>
                        <div className={`flex flex-col gap-4`}>
                            <h2 className={`text-preset-1`}>Available to Embed</h2>
                            <p className={`text-preset-2 opacity-60 !leading-[25px] max-w-[50ch]`}>
                                Embed Tweets, Facebook posts, Instagram media, Vimeo or YouTube videos, Google Maps,
                                and more.
                            </p>
                        </div>
                        <div className={`w-18 h-18 flex items-center`}>
                            <img src="/assets/features/desktop/embed.svg" alt="Create and share your photo stories." />
                        </div>
                    </li>
                </ul>
            </article>
        </main>
    );
};