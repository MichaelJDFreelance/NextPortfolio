type Props = {title?:string}

export function SectionPageHeader({title}:Props) {
    return (
        <header className={`page-header bg-background text-foreground`}>
            <h1 className={`border-bottom border-foreground main-width flex items-center justify-center py-25`}>
                {title}
            </h1>
        </header>
    );
}