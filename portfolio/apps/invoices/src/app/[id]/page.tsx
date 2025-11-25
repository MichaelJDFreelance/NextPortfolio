import {ActionButtons} from "../../components/ActionButtons";

export default function Home() {
    return (
    <div className="flex min-h-screen max-w-screen w-full bg-background dark-theme:bg-background-dark">
        <main className="flex gap-16 flex-col items-center px-40 w-full h-fit py-20">
            <a className={`flex w-full max-w-[730px]`}>Go back</a>

            <menu className={`flex items-center w-full max-w-[730px] gap-2`}>
                <div className={`flex gap-5 items-center`}>
                    Status
                    <span data-theme={`paid`} className={`p-5 bg-theme/5 text-theme py-3.5 px-7.5`}>Paid</span>
                </div>
                <div className={`flex gap-2 items-center ml-auto text-white`}>
                    <ActionButtons />
                </div>
            </menu>


        </main>
    </div>
  );
}
