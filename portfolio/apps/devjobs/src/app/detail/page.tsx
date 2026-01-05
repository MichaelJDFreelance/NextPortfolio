import data from "@/data/data.json"
import {CSSProperties} from "react";

export default function Home() {
    const item= data.find(item=>item.id===1)
    if (!item) return <></>;

  return (
    <div style={{"--logo":item?.logoBackground} as CSSProperties}
         className="flex flex-col min-h-screen items-center font-sans">
      <main className="flex min-h-screen w-full max-w-[1110px] flex-col items-center gap-8 px-6">
            <header className={`flex items-center gap-10 pr-7 w-full bg-white -mt-10`}>
                <div className={`flex items-center justify-center h-[140px] w-[140px] bg-logo`}>
                    <img src={item.logo} alt={item.company} />
                </div>
                <section className={`flex items-center justify-between`}>
                    <div className={`flex flex-col gap-1.5`}>
                        <h1>{item.company}</h1>
                        <span>{item.website}</span>
                    </div>
                </section>
                <button className={`px-5 py-3 ml-auto bg-primary/10 text-primary h-fit rounded-[6px]`}>Company Site</button>
            </header>

          <article className={`p-11 w-full bg-white`}>
              <header className={`flex items-center justify-between gap-10 mb-10`}>
                  <section className={`flex flex-col gap-1.5`}>
                      <div className={`flex gap-3`}>
                          <span>{item.postedAt}</span>
                          <span className={`w-1 h-1 rounded-full`} />
                          <span>{item.contract}</span>
                      </div>
                      <h2>{item.position}</h2>
                      <p>{item.location}</p>
                  </section>
                  <a className={`bg-primary text-foreground px-8 py-3 rounded-[6px] text-white`}>Apply Now</a>
              </header>

              <section className={`flex flex-col gap-11`}>
                  <p>{item.description}</p>
                  <div className={`flex flex-col gap-6`}>
                      <h3>Requirements</h3>
                      <p>{item.requirements.content}</p>
                  </div>
              </section>

              <section className={`flex flex-col gap-11`}>
                  <h3>What You Will Do</h3>
                  <p>{item.role.content}</p>
              </section>

          </article>
      </main>
    </div>
  );
}
