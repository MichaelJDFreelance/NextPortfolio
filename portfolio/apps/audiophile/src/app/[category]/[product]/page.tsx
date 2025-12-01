import Image from "next/image";
import {SectionPageHeader} from "@/components/SectionPageHeader";

export default function Home() {
  return (
    <main className={`home flex flex-col gap-[168px]`}>
        <article className={`main-width w-full`}>
            <section className={`flex flex-col max-lg:items-center max-lg:text-center gap-8`}>
                <header className={`flex flex-col gap-4`}>
                    <span className={`opacity-50 text-preset-1 text-primary`}>NEW PRODUCT</span>
                    <h1 className={`max-w-[15ch] text-title-2`}>XX99 Mark II Headphones</h1>
                </header>
                <p className={`opacity-50 text-preset-2 max-w-[52ch]`}>
                    The new XX99 Mark II headphones is the pinnacle of pristine audio. It redefines your premium headphone
                    experience by reproducing the balanced depth and precision of studio-quality sound.
                </p>
                <span className={`text-preset-4`}>$ 4,500</span>
                <div className={`flex gap-4`}>
                    <div className={`flex items-center bg-card`}>
                        <button className={`p-5 text-primary`}>-</button>
                        <span>1</span>
                        <button className={`p-5 text-primary`}>+</button>
                    </div>
                    <button className={`mt-2 bg-primary px-8 py-4 w-fit text-preset-3 text-background`}>See Product</button>
                </div>
            </section>
        </article>
        <div className={`flex gap-[125px] main-width w-full px-6 md:px-10`}>
            <article className={`text-preset-2`}>
                <h2 className={`text-preset-6 mb-8`}>FEATURES</h2>

                <p className={`opacity-50`}>
                    Featuring a genuine leather head strap and premium earcups, these headphones deliver superior comfort
                    for those who like to enjoy endless listening. It includes intuitive controls designed for any situation.
                    Whether you’re taking a business call or just in your own personal space, the auto on/off and pause
                    features ensure that you’ll never miss a beat.
                </p>

                <br />

                <p className={`opacity-50`}>
                    The advanced Active Noise Cancellation with built-in equalizer allow you to experience your audio world
                    on your terms. It lets you enjoy your audio in peace, but quickly interact with your surroundings when
                    you need to. Combined with Bluetooth 5. 0 compliant connectivity and 17 hour battery life, the XX99 Mark
                    II headphones gives you superior sound, cutting-edge technology, and a modern design aesthetic.
                </p>
            </article>

            <article className={`flex flex-col gap-8 text-nowrap`}>
                <h2 className={`text-preset-6 uppercase`}>in the box</h2>
                <ul className={`flex flex-col gap-2 text-preset-2`}>
                    <li className={`flex gap-6 text-foreground/50`}><span className={`text-primary`}>1x</span>Headphone Unit</li>
                    <li className={`flex gap-6 text-foreground/50`}><span className={`text-primary`}>2x</span>Replacement Earcups</li>
                    <li className={`flex gap-6 text-foreground/50`}><span className={`text-primary`}>1x</span>User Manual</li>
                    <li className={`flex gap-6 text-foreground/50`}><span className={`text-primary`}>1x</span>3.5mm 5m Audio Cable</li>
                    <li className={`flex gap-6 text-foreground/50`}><span className={`text-primary`}>1x</span>Travel Bag</li>
                </ul>
            </article>
        </div>
        <article className={`grid md:grid-cols-3 gap main-width gap-8 w-full uppercase px-6 md:px-10`}>
            <section className={`flex flex-col gap-8 items-center rounded-md`}>
                <h2 className={`text-preset-4`}>HEADPHONES</h2>
                <a className={`text-preset-3 gap-3 bg-primary px-8 py-4 text-background`}>Shop</a>
            </section>
            <section className={`flex flex-col gap-8 items-center rounded-md`}>
                <h2 className={`text-preset-4`}>SPEAKERS</h2>
                <a className={`text-preset-3 gap-3 bg-primary px-8 py-4 text-background`}>Shop</a>
            </section>
            <section className={`flex flex-col gap-8 items-center rounded-md`}>
                <h2 className={`text-preset-4`}>EARPHONES</h2>
                <a className={`text-preset-3 gap-3 bg-primary px-8 py-4 text-background`}>Shop</a>
            </section>
        </article>
    </main>
  );
}
