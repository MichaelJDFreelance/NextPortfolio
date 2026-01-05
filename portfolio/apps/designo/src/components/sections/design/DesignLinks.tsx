const styles = {
    card: "relative rounded-lg overflow-hidden",
    header:
        "flex flex-col text-center absolute inset-0 gap-6 items-center justify-center text-card-foreground",
}

export function WebLink({isTall}:{isTall?:boolean}) {
    return (
        <a href={`/web`} className={`${styles.card} ${isTall? "xl:row-span-2" : ""}`}>
            <header className={`${styles.header}`}>
                <h2 className={`text-preset-2`}>WEB DESIGN</h2>
                <p className={`text-preset-5-wide`}>VIEW PROJECTS</p>
            </header>
            <picture>
                <source media="(min-width: 1024px)" srcSet={`/assets/home/desktop/image-web-design-${isTall?"large":"small"}.jpg`}/>
                <source media="(min-width: 768px)" srcSet="/assets/home/tablet/image-web-design.jpg"/>
                <img src="/assets/home/mobile/image-web-design.jpg" alt="" className={`w-full max-xl:max-h-50 object-cover object-bottom`} />
            </picture>
        </a>
    );
}

export function GraphicLink() {
    return (
        <a href={`/graphic`} className={`${styles.card}`}>
            <header className={`${styles.header}`}>
                <h2 className={`text-preset-2`}>GRAPHIC DESIGN</h2>
                <p className={`text-preset-5-wide`}>VIEW PROJECTS</p>
            </header>
            <picture>
                <source media="(min-width: 1024px)" srcSet="/assets/home/desktop/image-graphic-design.jpg"/>
                <source media="(min-width: 768px)" srcSet="/assets/home/tablet/image-graphic-design.jpg"/>
                <img src="/assets/home/mobile/image-graphic-design.jpg" alt="" className={`w-full max-xl:max-h-50 object-cover object-top`} />
            </picture>
        </a>
    );
}

export function AppLink() {
    return (
        <a href={`/app`} className={`${styles.card}`}>
            <header className={`${styles.header}`}>
                <h2 className={`text-preset-2`}>APP DESIGN</h2>
                <p className={`text-preset-5-wide`}>VIEW PROJECTS</p>
            </header>
            <picture>
                <source media="(min-width: 1024px)" srcSet="/assets/home/desktop/image-app-design.jpg"/>
                <source media="(min-width: 768px)" srcSet="/assets/home/tablet/image-app-design.jpg"/>
                <img src="/assets/home/mobile/image-app-design.jpg" alt="" className={`w-full max-xl:max-h-50 object-cover`} />
            </picture>
        </a>
    );
}