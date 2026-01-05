import {LocationBadges} from "@/components/sections/locations/LocationBadges";

export default function Page() {
    return (
        <main className={`flex flex-col gap-36 mb-36 w-full`}>
            <header className={`flex gap-8 bg-primary p-24 text-card-foreground`}>
                <section className={`flex flex-col flex-1 gap-8`}>
                    <h1 className={`text-preset-1`}>Contact Us</h1>
                    <p>
                        Ready to take it to the next level? Let’s talk about your project or idea and find out how we can
                        help your business grow. If you are looking for unique digital experiences that’s relatable to your
                        users, drop us a line.
                    </p>
                </section>
                <form className={`flex flex-col flex-1 text-card-foreground`}>
                    <input type="text" placeholder="Name" className={`pb-3 mb-6 border-b border-card-foreground placeholder-card-foreground`} />
                    <input type="text" placeholder="Email Address" className={`pb-3 mb-6 border-b border-card-foreground placeholder-card-foreground`} />
                    <input type="text" placeholder="Phone" className={`pb-3 mb-6 border-b border-card-foreground placeholder-card-foreground`} />
                    <input type="text" placeholder="Your Message" className={`pb-3 mb-6 border-b border-card-foreground placeholder-card-foreground`} />
                    <button className={`text-accent bg-card-foreground w-fit ml-auto px-12 py-4 rounded`}>Submit</button>
                </form>
            </header>

            <LocationBadges />
        </main>
    );
}