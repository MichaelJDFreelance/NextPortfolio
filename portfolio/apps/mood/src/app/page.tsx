"use client"

import Logo from "@portfolio/icons/mood/logo";
import {useForm} from "@tanstack/react-form";
import IconHappy from "@portfolio/icons/mood/icon-very-happy-color"
import IconQuote from "@portfolio/icons/mood/icon-quote"
import IconSleep from "@portfolio/icons/mood/icon-sleep"
import IconReflect from "@portfolio/icons/mood/icon-reflection"
import {EmojiComponent} from "@/components/EmojiComponent";

export default function SignupPage() {
    const form = useForm({
        defaultValues: {
            username:"",
            password:""
        },
        onSubmit: () => {
            alert("submitted")
        }
    })

    const mood = "very-happy";

  return (
     <div data-mood={mood} className={`min-h-screen max-w-screen w-full flex flex-col items-center`}>
         <header className={`flex w-full justify-between items-center py-10 max-w-[1170px]`}>
             <Logo className="h-10 w-[177px]" />
             <div className={`flex`}>
                 <img src="/images/avatar-lisa.jpg" className={`h-10 w-10 rounded-full`} alt="avatar" />
             </div>
         </header>
         <main className="flex flex-col items-center font-sans gap-12 w-full max-w-[1170px]">
             <header className={`py-16 gap-16 flex flex-col`}>
                <header className={`gap-2.5 flex flex-col items-center`}>
                    <p className={`text-primary text-preset-3`}>Hello, Lisa!</p>
                    <h1 className={`text-preset-1 text-neutral-900`}>How are you feeling today?</h1>
                    <time className={`text-neutral-600 text-preset-6`}>Wednesday, April 16th, 2025</time>
                </header>
                 <button className={`bg-primary text-white rounded-md px-8 py-4 text-preset-5`}>Log {`today's`} mood</button>
             </header>
             <section className={`grid xl:grid-cols-[405px_1fr_428px] w-full gap-8`}>
                <article className={`overflow-hidden flex flex-col justify-between relative xl:col-span-2 xl:row-span-2 bg-white p-8 rounded-xl`}>
                    <header className={`relative z-1`}>
                        <p className={`text-neutral-900 text-preset-3 opacity-70`}>{`I'm`} feeling</p>
                        <h2 className={`text-preset-2 text-neutral-900`}>Very Happy</h2>
                    </header>
                    <p className={`flex flex-col gap-3 max-w-[23ch] relative text-preset-6 italic text-neutral-900 z-1`}>
                        <IconQuote/>
                        “When your heart is full, share your light with the world.”</p>
                    <EmojiComponent mood={`very-happy`} isColor={true} className={`h-80 w-80 md:absolute md:right-8 md:bottom-[-30px] z-0`} />
                </article>
                 <article className={`bg-white p-5 rounded-xl`}>
                         <p className={`flex items-center gap-3 text-preset-6 text-neutral-600`}><IconSleep />Sleep</p>
                         <h2 className={`text-preset-3 text-neutral-900`}>9+ hours</h2>
                 </article>
                 <article className={`flex flex-col gap-4 bg-white p-5 rounded-xl`}>
                     <p className={`flex items-center gap-3 text-preset-6 text-neutral-600`}><IconReflect />Reflection of the day</p>
                     <div className={`h-20 text-preset-6 text-neutral-900`}>Woke up early and finally tackled a big project!</div>
                     <ul className={`flex gap-3 italic text-preset-6 text-neutral-600`}><li>#Grateful</li><li>#Optimistic</li></ul>
                 </article>
                 <article className={`p-6 gap-6 bg-white rounded-xl flex flex-col`}>
                    <section className={`flex flex-col gap-3`}>
                        <header className={`flex gap-[1ch] items-center`}>
                            <h2 className={`text-preset-5 text-neutral-900`}>Average Mood</h2>
                            <p className={`text-preset-7 text-neutral-600`}>(Last 5 check-ins)</p></header>
                        <div className={`rounded-xxl p-5 flex-1 flex flex-col justify-center items-start gap-3 bg-mood`}>
                            <header className={`flex gap-4 items-center`}><h3 className={`text-neutral-900 text-preset-4`}>Neutral</h3></header>
                            <div className={`flex items-center gap-2`}>Same as the previous 5 check-ins</div>
                        </div>
                    </section>
                     <section className={`flex flex-col gap-3`}>
                         <header className={`flex gap-[1ch] items-center`}>
                             <h2 className={`text-preset-5 text-neutral-900`}>Average Sleep</h2>
                             <p className={`text-preset-7 text-neutral-600`}>(Last 5 check-ins)</p></header>
                         <div className={`rounded-xxl p-5 flex-1 flex flex-col justify-center items-start gap-3 bg-primary text-white`}>
                             <header className={`flex gap-4 items-center`}><h3 className={`text-white text-preset-4`}>5-6 Hours</h3></header>
                             <div className={`flex items-center gap-2`}>Increase from the previous 5 check-ins</div>
                         </div>
                     </section>
                 </article>
                 <article className={`flex flex-col xl:col-span-2 gap-4 bg-white p-8 rounded-xl`}>
                    <h2 className={`text-neutral-900 text-preset-3`}>Mood and sleep trends</h2>
                 </article>
             </section>
         </main>
     </div>
  );
}
