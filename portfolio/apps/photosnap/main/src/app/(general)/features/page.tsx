import {BetaInvite} from "@/components/BetaInvite";

export default function FeaturesPage() {
    return (
        <main className={`flex flex-col gap-16 max-w-[1080px] mx-auto`}>
            <header className={`flex flex-col-reverse md:flex-row bg-black text-white`}>
                <div className={`flex flex-col gap-4 my-18 justify-center relative`}>
                    <div className={`h-fit relative px-8`}>
                        <div className={`absolute bg-gradient-to-tr from-yellow-500 via-pink-800 to-blue-500 h-full w-1.5 left-0`}></div>
                        <h1 className={`text-preset-h2 uppercase max-w-[15ch]`}>FEATURES </h1>
                        <p className={`text-preset-2 opacity-60 max-w-[35ch] !leading-[25px]`}>
                            We make sure all of our features are designed to be loved by every aspiring and even professional
                            photograpers who wanted to share their stories.
                        </p>
                    </div>
                </div>
                <picture className={`md:ml-auto`}>
                    <source media={`(min-width: 80rem)`} srcSet={`/assets/features/desktop/hero.jpg`} />
                    <source media={`(min-width: 48rem)`} srcSet={`/assets/features/tablet/hero.jpg`} />
                    <img className={`w-full`} src="/assets/features/mobile/hero.jpg" alt="Create and share your photo stories." />
                </picture>
            </header>
            <article>
                <ul className={`grid md:grid-cols-2 xl:grid-cols-3 gap-14 py-20 px-8 text-center`}>
                    <li className={`flex flex-col-reverse gap-12 items-center`}>
                        <div className={`flex flex-col gap-4`}>
                            <h2 className={`text-preset-1`}>100% Responsive</h2>
                            <p className={`text-preset-2 opacity-60 !leading-[25px] max-w-[33ch]`}>
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
                            <p className={`text-preset-2 opacity-60 !leading-[25px] max-w-[33ch]`}>
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
                            <p className={`text-preset-2 opacity-60 !leading-[25px] max-w-[33ch]`}>
                                Embed Tweets, Facebook posts, Instagram media, Vimeo or YouTube videos, Google Maps,
                                and more.
                            </p>
                        </div>
                        <div className={`w-18 h-18 flex items-center`}>
                            <img src="/assets/features/desktop/embed.svg" alt="Create and share your photo stories." />
                        </div>
                    </li>
                    <li className={`flex flex-col-reverse gap-12 items-center`}>
                        <div className={`flex flex-col gap-4`}>
                            <h2 className={`text-preset-1`}>Custom Domain</h2>
                            <p className={`text-preset-2 opacity-60 !leading-[25px] max-w-[33ch]`}>
                                With Photosnap subscriptions you can host your stories on your own domain. You can also
                                remove our branding!
                            </p>
                        </div>
                        <div className={`w-18 h-18 flex items-center`}>
                            <img src="/assets/features/desktop/custom-domain.svg" alt="Create and share your photo stories." />
                        </div>
                    </li>
                    <li className={`flex flex-col-reverse gap-12 items-center`}>
                        <div className={`flex flex-col gap-4`}>
                            <h2 className={`text-preset-1`}>Boost Your Exposure</h2>
                            <p className={`text-preset-2 opacity-60 !leading-[25px] max-w-[33ch]`}>
                                Users that viewed your story or gallery can easily get notifed of new and featured stories
                                with our built in mailing list.
                            </p>
                        </div>
                        <div className={`w-18 h-18 flex items-center`}>
                            <img src="/assets/features/desktop/boost-exposure.svg" alt="Create and share your photo stories." />
                        </div>
                    </li>
                    <li className={`flex flex-col-reverse gap-12 items-center`}>
                        <div className={`flex flex-col gap-4`}>
                            <h2 className={`text-preset-1`}>Drag & Drop Image</h2>
                            <p className={`text-preset-2 opacity-60 !leading-[25px] max-w-[35ch]`}>
                                Easily drag and drop your image and get beautiful shots everytime. No over the top tooling
                                to add friction to creating stories.
                            </p>
                        </div>
                        <div className={`w-18 h-18 flex items-center`}>
                            <img src="/assets/features/desktop/drag-drop.svg" alt="Create and share your photo stories." />
                        </div>
                    </li>
                </ul>
            </article>
            <BetaInvite />
        </main>
    );
}