import Image from "next/image";
import {CTA} from "@/components/CTA";

export default function Page() {
    return (
        <main className="flex flex-col items-center gap-20">
            <header className={`flex max-lg:flex-col gap-16 text-preset-6 text-neutral-800`}>
                <div className={`flex flex-col gap-6`}>
                    <span className={`text-preset-5 text-neutral-900`}>Our mission</span>
                    <h1 className={`md:text-preset-2 text-neutral-900 text-preset-2-mobile`}>
                        Help more people cook nourishing meals, more often.</h1>
                    <p>
                        Healthy Recipe Finder was created to prove that healthy eating can be convenient, affordable,
                        and genuinely delicious.
                    </p>
                    <p>
                        We showcase quick, whole-food dishes that anyone can master—no fancy equipment, no
                        ultra-processed shortcuts—just honest ingredients and straightforward steps.
                    </p>
                </div>
                <Image width={618} height={600} className={`rounded-hero`}
                       src={`/assets/images/image-about-our-mission-large.webp`} alt={`hero`} />
            </header>

            <article className={`flex max-lg:flex-col gap-10 md:gap-16 justify-between`}>
                <h2 className={`text-preset-2 text-neutral-900`}>Why we exist</h2>
                <ul className={`flex flex-col gap-12`}>
                    <li>
                        <h3 className={`text-preset-4 text-neutral-900`}>Cut through the noise.</h3>
                        <p className={`text-preset-6 text-neutral-800`}>
                            The internet is bursting with recipes, yet most busy cooks still default to take-away or
                            packaged foods. We curate a tight collection of fool-proof dishes so you can skip the
                            scrolling and start cooking.
                        </p>
                    </li>
                    <li>
                        <h3 className={`text-preset-4 text-neutral-900`}>Empower home kitchens.</h3>
                        <p className={`text-preset-6 text-neutral-800`}>
                            When you control what goes into your meals, you control how you feel. Every recipe is
                            built around unrefined ingredients and ready in about half an hour of active prep.
                        </p>
                    </li>
                    <li>
                        <h3 className={`text-preset-4 text-neutral-900`}>Make healthy look good.</h3>
                        <p className={`text-preset-6 text-neutral-800`}>
                            High-resolution imagery shows you exactly what success looks like—because we eat with our
                            eyes first, and confidence matters.
                        </p>
                    </li>
                </ul>
            </article>

            <article className={`flex max-lg:flex-col gap-16 justify-between text-preset-6 text-neutral-800`}>
                <div className={`flex flex-col gap-3`}>
                    <h2 className={`text-preset-2-mobile md:text-preset-2 text-neutral-900`}>Beyond the plate</h2>
                    <p>We believe food is a catalyst for community and well-being. By sharing approachable recipes,
                        we hope to:</p>
                    <ul>
                        <li>Encourage family dinners and social cooking.</li>
                        <li>Reduce reliance on single-use packaging and delivery waste.</li>
                        <li>Spark curiosity about seasonal produce and local agriculture.</li>
                    </ul>
                </div>
            </article>

            <CTA />
        </main>
    );
}