"use client"

import {Header} from "@/components/Header";

export default function Home() {

  return (
    <div className="flex flex-col  min-h-screen items-center justify-center font-sans">
        <Header />
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center
                        sm:items-start max-w-[1160px]">
            <section className={`grid xl:grid-cols-[1fr_564px] max-xl:flex-col gap-y-8 gap-x-32 w-full`}>
                <header className={`flex flex-col gap-6`}>
                    <h1 className={`text-preset-2l max-w-[15ch]`}>
                        Quiz completed <em className={`text-preset-2m`}>You scored...</em>
                    </h1>
                </header>

                <div className={`grid justify-center text-center gap-y-10 text-preset-4 w-full bg-secondary p-12 rounded-[24px]`}>
                    <header className={`flex gap-10 bg-`}><h2>Accessibility</h2></header>
                    <div className={`flex flex-col gap-4 text-preset-1`}>
                        8
                        <span className={`text-preset-5 text-secondary-foreground`}>out of 10</span>
                    </div>
                </div>

                <div className={`spacer`}></div>

                <button className={`p-8 rounded-[24px] bg-primary text-white text-preset-4`}>Play Again</button>
            </section>
      </main>
    </div>
  );
}
