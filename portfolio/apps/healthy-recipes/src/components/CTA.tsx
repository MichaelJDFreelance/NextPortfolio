export function CTA() {
    return (
        <article className={`flex flex-col gap-10 items-center text-center bg-neutral-200 w-full rounded-image-large py-24 max-w-[1192px]`}>
            <header className={`flex flex-col gap-3`}>
                <h2 className={`text-neutral-900 text-preset-2-narrow`}>Ready to cook smarter?</h2>
                <p className={`text-preset-6 text-neutral-800`}>Hit the button, pick a recipe, and get dinner on the table—fast.</p>
            </header>
            <button className={`rounded-button py-4 px-6 bg-neutral-900 text-white`}>Browse recipes</button>
        </article>
    );
}