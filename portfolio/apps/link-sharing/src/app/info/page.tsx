"use client"

import {useForm, useStore} from "@tanstack/react-form";
import IconImage from "@portfolio/icons/link-sharing/icon-upload-image"
import PhoneMockup from "@portfolio/icons/link-sharing/illustration-phone-mockup"

export default function Home() {
    const form = useForm({
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            imageSrc:""
        },
        onSubmit: async ({value}) => {
            alert(JSON.stringify(value))
        }
    })

    const info = useStore(form.store, (state) => state.values)

  return (
    <div className="flex justify-center font-sans m-6">
      <main className="flex w-full gap-6">
          <section className={`flex flex-1 items-center justify-center flex-col bg-white rounded-[12px]`}>
            <div className={`relative`}>
                <PhoneMockup className={`w-[307px] h-[631px]`} />
                <div className={`absolute top-[66px] w-full flex flex-col items-center`}>
                    <div className={`h-24 w-24 mb-4 rounded-full`}></div>
                    <div className={`mockup-preset-1 h-6 mb-1`}>{info.firstName}</div>
                    <div className={`mockup-preset-2 h-6`}>{info.lastName}</div>
                    <ul className={`flex flex-col gap-5 mt-[46px]`}>
                        <li className={`h-11 w-60 bg-destructive/60 rounded-[8px]`}></li>
                        <li className={`h-11 w-60 bg-destructive/60 rounded-[8px]`}></li>
                        <li className={`h-11 w-60 bg-destructive/60 rounded-[8px]`}></li>
                        <li className={`h-11 w-60 bg-destructive/60 rounded-[8px]`}></li>
                        <li className={`h-11 w-60 bg-destructive/60 rounded-[8px]`}></li>
                    </ul>
                </div>
            </div>
          </section>
            <form className={`flex flex-1 flex-col bg-white rounded-[12px]`} onSubmit={e=>{
                e.preventDefault();
                form.handleSubmit(e)
            }}>
                <div className={`flex flex-col gap-10 p-10`}>
                    <header className={`flex flex-col gap-2`}>
                        <h1 className={`text-3xl text-preset-1 text-grey-900`}>Profile Details</h1>
                        <p className={`text-preset-3 text-grey-500`}>
                            Add your details to create a personal touch to your profile.</p>
                    </header>
                    <section className={`flex flex-col gap-6`} >
                        <div className={`flex justify-between items-center p-6 gap-4 text-grey-500 text-preset-3 bg-grey-50`}>
                            Profile picture
                            <div className={`p-10 items-center bg-grey-100 flex flex-col gap-2 text-primary text-primary 
                                    font-semibold rounded-[12px]`}>
                                <IconImage className={`w-10 h-10`} />
                                + Upload Image
                            </div>
                            <p className={`text-preset-4`}>
                                Image must be below 1024x1024px. Use PNG or JPG format.
                            </p>
                        </div>

                        <fieldset className={`rounded-[12px] items-center grid grid-cols-[1fr_424px] p-6 gap-4 bg-grey-50 
                                text-grey-500 text-preset-3`}>
                            <label>First name*</label>
                            <form.Field name={`firstName`}
                                        validators={{
                                            onSubmit: ({ value }) =>
                                                !value ? "Can’t be empty"
                                                    : undefined,
                                        }}>
                                {field=>(
                                    <div className={`flex flex-col`}>
                                        <input value={field.state.value} data-error={!!field.state.meta.errors.length}
                                               onChange={e=>field.handleChange(e.target.value)}
                                               className={`bg-white p-4 mt-2 border border-grey-200 data-[error=true]:border-destructive 
                                            rounded-[8px]`} />
                                        <div className={`ml-auto text-destructive text-preset-4`}>{field.state.meta.errors[0]}</div>
                                    </div>
                                )}
                            </form.Field>
                            <label>Last name*</label>
                            <form.Field name={`lastName`} validators={{
                                onSubmit: ({ value }) =>
                                    !value ? "Can’t be empty"
                                        : undefined,
                            }}>
                                {field=>(
                                    <div className={`flex flex-col`}>
                                        <input value={field.state.value} data-error={!!field.state.meta.errors.length}
                                               onChange={e=>field.handleChange(e.target.value)}
                                               className={`bg-white p-4 mt-2 border border-grey-200 data-[error=true]:border-destructive 
                                            rounded-[8px]`} />
                                        <div className={`ml-auto text-destructive text-preset-4`}>{field.state.meta.errors[0]}</div>
                                    </div>
                                )}
                            </form.Field>
                            <label>Email</label>
                            <form.Field name={`email`} validators={{
                                onSubmit: ({ value }) =>
                                    !value ? "Can’t be empty"
                                        : undefined,
                            }}>
                                {field=>(
                                    <div className={`flex flex-col`}>
                                        <input value={field.state.value} data-error={!!field.state.meta.errors.length}
                                               onChange={e=>field.handleChange(e.target.value)}
                                               className={`bg-white p-4 mt-2 border border-grey-200 data-[error=true]:border-destructive 
                                            rounded-[8px]`} />
                                        <div className={`ml-auto text-destructive text-preset-4`}>{field.state.meta.errors[0]}</div>
                                    </div>
                                )}
                            </form.Field>
                        </fieldset>
                    </section>
                </div>
                <hr />
                <footer className={`flex py-6 px-10`}>
                    <button className={`py-4 px-6 rounded-[8px] bg-primary text-white ml-auto cursor-pointer`}>Save</button>
                </footer>
            </form>
      </main>
    </div>
  );
}
