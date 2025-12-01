import LargeLogo from "@portfolio/icons/flashcards/logo-large";
import SmallLogo from "@portfolio/icons/flashcards/logo-small";

export function Logo() {
    return (
        <>
            <LargeLogo className={`hidden md:block`} />
            <SmallLogo className={`block md:hidden`} />
        </>
    );
}