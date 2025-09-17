import {ArrowLink} from "@/components/ArrowLink";

export function BetaInvite() {
    return (
        <article className={`grid relative overflow-hidden bg-black`}>
            <div className={`z-20 absolute bg-gradient-to-tr from-yellow-500 via-pink-800 to-blue-500 h-full w-1.5 left-0`}></div>
            <div className={`flex max-md:flex-col md:justify-between md:items-center gap-6 py-16 px-8 z-10 text-white`}>
                <h2 className={`text-preset-h2 uppercase max-w-[15ch]`}>We’re in beta.
                    Get your invite today!</h2>
                <ArrowLink text={`get an invite`} className={`uppercase`} colorStyle={`light`} />
            </div>
            <picture className={`absolute inset-0 object-cover`}>
                <source media={`(min-width: 80rem)`} srcSet={`/assets/shared/desktop/bg-beta.jpg`} />
                <source media={`(min-width: 48rem)`} srcSet={`/assets/shared/tablet/bg-beta.jpg`} />
                <img src={`/assets/shared/mobile/bg-beta.jpg`} className={`w-full h-full object-cover`} />
            </picture>
        </article>
    );
}