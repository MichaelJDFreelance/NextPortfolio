"use client"

import IconEmail from "@portfolio/icons/link-sharing/icon-email"
import IconPassword from "@portfolio/icons/link-sharing/icon-password"

import {useForm, useStore} from "@tanstack/react-form";

export default function Home() {
    const form = useForm({
        defaultValues: {
            email: "",
            password: "",
        },
        onSubmit: async ({value}) => {
            alert(JSON.stringify(value))
        }
    })

  return (
    <div className="flex min-h-screen justify-center font-sans m-6">
      <main className="flex justify-center w-full">
           <section className={`flex flex-col gap-10 bg-white p-10 rounded-[12px] max-w-[476px] h-fit`}>
                <header className={`flex flex-col gap-2`}>
                    <h1 className={`text-preset-1 text-grey-900`}>Login</h1>
                    <p className={`text-preset-3 text-grey-500`}>Add your details below to get back into the app</p>
                </header>

               <form className={`flex flex-col gap-6 text-grey-900`} onSubmit={e=>{
                   e.preventDefault();
                   form.handleSubmit(e)
               }}
               >
                   <form.Field name={`email`}
                               validators={{
                                   onSubmit: ({ value }) =>
                                       !value ? "Can’t be empty"
                                           : undefined,
                               }}>
                       {field=>(
                           <label data-error={!!field.state.meta.errors.length} className={`flex flex-col gap-2 text-preset-4`}>
                               Email address
                               <div className={`relative flex items-center w-full`}>
                                   <input value={field.state.value}
                                          onChange={e=>field.handleChange(e.target.value)}
                                          className={`w-full p-4 pl-12 rounded-[8px] border text-preset-3`}
                                          placeholder={`e.g. alex@email.com`} />
                                   <IconEmail className={`absolute  left-[12px] h-4 w-4`}/>
                               </div>
                               <span className={`text-destructive`}>{field.state.meta.errors[0]}</span>
                           </label>
                       )}
                   </form.Field>

                   <form.Field name={`password`}
                               validators={{
                                   onSubmit: ({ value }) =>
                                       !value ? "Can’t be empty"
                                           : undefined,
                               }}>
                       {field=>(
                           <label data-error={!!field.state.meta.errors.length} className={`flex flex-col gap-2 text-preset-4`}>
                               Password
                               <div className={`relative flex items-center w-full`}>
                                   <input value={field.state.value}
                                          onChange={e=>field.handleChange(e.target.value)}
                                       className={`w-full p-4 pl-12 rounded-[8px] border data-[error=true]:border-destructive text-preset-3`}
                                       placeholder={`Enter your password`} />
                                   <IconPassword className={`absolute  left-[12px] h-4 w-4`}/>
                               </div>
                               <span className={`text-destructive`}>{field.state.meta.errors[0]}</span>
                           </label>
                       )}
                   </form.Field>

                   <button className={`cursor-pointer py-4 rounded-[8px] bg-primary text-white text-preset-3`}>Login</button>

                   <p className={`text-preset-3 text-grey-500`}>Don’t have an account? <span className={`text-primary`}>
                       Create account</span></p>
               </form>
           </section>
      </main>
    </div>
  );
}
