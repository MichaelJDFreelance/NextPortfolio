import {FeatureMatrix, FeatureRow} from "@/components/FeatureMatrix";
import {BetaInvite} from "@/components/BetaInvite";
import {ChoosePlan} from "@/components/ChoosePlan";

export default function PricingPage() {
    return (
        <main className={`flex flex-col gap-16 max-w-[1080px] mx-auto`}>
            <header className={`flex flex-col-reverse md:flex-row bg-black text-white relative`}>
                <div className={`flex flex-col gap-4 my-18  justify-center`}>
                    <div className={`h-fit flex flex-col gap-4 relative px-8`}>
                        <div className={`absolute bg-gradient-to-tr from-yellow-500 via-pink-800 to-blue-500 h-full w-1.5 left-0`}></div>
                        <h1 className={`text-preset-h2 uppercase max-w-[15ch]`}>PRICING </h1>
                        <p className={`text-preset-2 opacity-60 max-w-[35ch] !leading-[25px]`}>
                            Create a your stories, Photosnap is a platform for photographers and visual storytellers. It’s
                            the simple way to create and share your photos.
                        </p>
                    </div>
                </div>
                <picture className={`md:ml-auto`}>
                    <source media={`(min-width: 80rem)`} srcSet={`/assets/features/desktop/hero.jpg`} />
                    <source media={`(min-width: 48rem)`} srcSet={`/assets/features/tablet/hero.jpg`} />
                    <img className={`w-full`} src="/assets/features/mobile/hero.jpg" alt="Create and share your photo stories." />
                </picture>
            </header>
            <ChoosePlan />
            <div className={`grid justify-items-center`}>
                <h2 className={`pb-14 text-preset-h1`}>COMPARE</h2>
                <FeatureMatrix>
                    <FeatureRow title={`UNLIMITED STORY POSTING`} isIncludedArray={[true,true,true]} />
                    <FeatureRow title={`UNLIMITED PHOTO UPLOAD`} isIncludedArray={[true,true,true]} />
                    <FeatureRow title={`EMBEDDING CUSTOM CONTENT`} isIncludedArray={[false,true,true]} />
                    <FeatureRow title={`CUSTOMIZE METADATA`} isIncludedArray={[false,true,true]} />
                    <FeatureRow title={`ADVANCED METRICS`} isIncludedArray={[false,false,true]} />
                    <FeatureRow title={`PHOTO DOWNLOADS`} isIncludedArray={[false,false,true]} />
                    <FeatureRow title={`SEARCH ENGINE INDEXING`} isIncludedArray={[false,false,true]} />
                    <FeatureRow title={`CUSTOM ANALYTICS`} isIncludedArray={[false,false,true]} />
                </FeatureMatrix>
            </div>
            <BetaInvite />
        </main>
    );
}