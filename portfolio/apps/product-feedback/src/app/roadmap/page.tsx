export function Page() {
    return (
        <>
            <article>
                <div>Planned</div>
                <div className={`flex flex-col gap-1`}>
                    <h2 className={`text-title-2 text-neutral-1`}>More comprehensive reports</h2>
                    <p>It would be great to see a more detailed breakdown of solutions.</p>
                </div>
                <span>Feature</span>
                <div className={`flex items-center justify-between`}>
                    <div>123</div>
                    <div>2</div>
                </div>
            </article>
        </>
    );
}