import {SectionPageHeader} from "@/components/SectionPageHeader";

export default async function Home({params}:any) {

  return (
    <main className={`home flex flex-col gap-[168px]`}>
        <SectionPageHeader title={(await params).category} />
        <article className={`main-width w-full`}>
            <section className={`flex flex-col max-lg:items-center max-lg:text-center gap-8`}>
                <header className={`flex flex-col gap-4`}>
                    <span className={`opacity-50 text-preset-1 text-primary`}>NEW PRODUCT</span>
                    <h1 className={`max-w-[15ch] text-title-2`}>XX99 Mark II Headphones</h1>
                </header>
                <p className={`opacity-75 text-preset-2 max-w-[52ch]`}>
                    The new XX99 Mark II headphones is the pinnacle of pristine audio. It redefines your premium headphone
                    experience by reproducing the balanced depth and precision of studio-quality sound.
                </p>
                <button className={`mt-2 bg-primary px-8 py-4 w-fit text-preset-3 text-background`}>See Product</button>
            </section>
        </article>
        <article className={`main-width w-full`}>
            <section className={`flex flex-col max-lg:items-center max-lg:text-center gap-8`}>
                <header className={`flex flex-col gap-4`}>
                    <span className={`opacity-50 text-preset-1 text-primary`}>NEW PRODUCT</span>
                    <h1 className={`max-w-[15ch] text-title-2`}>XX99 Mark II Headphones</h1>
                </header>
                <p className={`opacity-75 text-preset-2 max-w-[52ch]`}>
                    The new XX99 Mark II headphones is the pinnacle of pristine audio. It redefines your premium headphone
                    experience by reproducing the balanced depth and precision of studio-quality sound.
                </p>
                <button className={`mt-2 bg-primary px-8 py-4 w-fit text-preset-3 text-background`}>See Product</button>
            </section>
        </article>
        <article className={`main-width w-full`}>
            <section className={`flex flex-col max-lg:items-center max-lg:text-center gap-8`}>
                <header className={`flex flex-col gap-4`}>
                    <span className={`opacity-50 text-preset-1 text-primary`}>NEW PRODUCT</span>
                    <h1 className={`max-w-[15ch] text-title-2`}>XX99 Mark II Headphones</h1>
                </header>
                <p className={`opacity-75 text-preset-2 max-w-[52ch]`}>
                    The new XX99 Mark II headphones is the pinnacle of pristine audio. It redefines your premium headphone
                    experience by reproducing the balanced depth and precision of studio-quality sound.
                </p>
                <button className={`mt-2 bg-primary px-8 py-4 w-fit text-preset-3 text-background`}>See Product</button>
            </section>
        </article>
    </main>
  );
}
