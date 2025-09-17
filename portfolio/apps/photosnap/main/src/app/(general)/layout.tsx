import {ArrowLink} from "@/components/ArrowLink";
import Facebook from "@/icons/facebook.svg"
import YouTube from "@/icons/youtube.svg"
import Twitter from "@/icons/twitter.svg"
import Pinterest from "@/icons/pinterest.svg"
import Instagram from "@/icons/instagram.svg"
import Logo from "@/icons/logo.svg"
import Menu from "@/icons/menu.svg"

export default function Layout({ children, }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <>
            <header className={`flex items-center justify-between py-7 px-6 bg-white max-w-[1080px] mx-auto relative`}>
                <img src="/assets/shared/desktop/logo.svg" alt="logo" />
                <nav>
                    <Menu className={`md:hidden cursor-pointer`} />
                    <section
                        className={`max-md:absolute inset-0 top-full z-10 flex max-md:flex-col items-center gap-9
                            bg-white uppercase text-preset-4 h-fit max-md:hidden`} >
                        <a>stories</a>
                        <a>features</a>
                        <a>pricing</a>
                        <a className="px-6 py-3 bg-black text-white">get an invite</a>
                    </section>
                </nav>
            </header>
            {children}
            <footer className={`grid md:grid-areas-[logo_invite|nav_nav|social_copyright] xl:grid-areas-[logo_nav_invite|social_nav_copyright] 
            items-center max-md:justify-items-center max-md:text-center gap-8 px-8 py-14 bg-black text-white uppercase max-w-[1080px] mx-auto`}>
                <Logo className={`max-w-[170px] !text-white md:grid-area-[logo]`} />
                <span className={`flex items-center gap-5 md:grid-area-[social]`}>
                    <Facebook className={`not-hover:!fill-white cursor-pointer`} />
                    <YouTube className={`not-hover:!fill-white cursor-pointer`} />
                    <Twitter className={`not-hover:!fill-white cursor-pointer`} />
                    <Pinterest className={`not-hover:!fill-white cursor-pointer`} />
                    <Instagram className={`not-hover:!fill-white cursor-pointer`} />
                </span>
                <nav className={`flex flex-col md:max-xl:flex-row gap-5 mt-4 mb-22 text-preset-4 md:grid-area-[nav]`}>
                    <a>home</a>
                    <a>stories</a>
                    <a>features</a>
                    <a>pricing</a>
                </nav>
                <ArrowLink text={`get an invite`} colorStyle={`light`} className={`md:grid-area-[invite] md:ml-auto`} />
                <span className={`normal-case text-preset-2 opacity-50 md:grid-area-[copyright] md:ml-auto`}>Copyright 2019. All Rights Reserved</span>
            </footer>
        </>
    );
};