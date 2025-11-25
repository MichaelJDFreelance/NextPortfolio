"use client"

import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {useForm, useStore} from "@tanstack/react-form";

export default function Home() {
  const form = useForm({
      defaultValues: {
          name: "",
          phone: "",
          email:"",
          address:"",
          zip:"",
          city:"",
          country:"",
          paymentMethod:"",
          eNo:"",
          ePIN:"",
      },
      onSubmit: async ({value}) => {
          console.log(JSON.stringify(value))
      }
  })

const paymentMethod = useStore(form.store, (state)=>state.values.paymentMethod)

  return (
    <main className={`home flex flex-col gap-[168px]`}>
        <form className={`flex flex-col gap-10 px-7 py-7.5 main-width w-full`} onSubmit={e=>{
            e.preventDefault();
            form.handleSubmit(e)}}>
            <h1 className={`!text-preset-6`}>CHECKOUT</h1>
            <fieldset className={`grid grid-cols-2 gap-4 `}>
                <h2 className={`uppercase text-primary col-span-2`}>billing details</h2>
                <form.Field name={`name`}>
                    {(field) => (
                        <div className={`flex flex-col gap-2`}>
                            <label className={`text-preset-7`}>Name</label>
                            <input type={`text`} placeholder={`Alexei Ward`} value={field.state.value}
                                   onChange={(e)=>field.handleChange(e.target.value)}
                                   className={`w-full border rounded-md px-3 py-2`} />
                        </div>
                    )}
                </form.Field>
                <form.Field name={`email`}>
                    {(field) => (
                        <div className={`flex flex-col gap-2`}>
                            <label className={`text-preset-7`}>Email Address</label>
                            <input type={`text`} placeholder={`alexeiward@mail.com`}
                                   value={field.state.value}
                                   onChange={(e)=>field.handleChange(e.target.value)}
                                   className={`w-full border rounded-md px-3 py-2`} />
                        </div>
                    )}
                </form.Field>
                <form.Field name={`phone`}>
                    {(field) => (
                        <div className={`flex flex-col gap-2`}>
                            <label className={`text-preset-7`}>Phone Number</label>
                            <input type={`text`} placeholder={`+1 202-555-0136`}
                                   value={field.state.value}
                                   onChange={(e)=>field.handleChange(e.target.value)}
                                   className={`w-full border rounded-md px-3 py-2`} />
                        </div>
                        )}
                </form.Field>
            </fieldset>

            <fieldset className={`grid grid-cols-2 gap-4 `}>
                <h2 className={`uppercase text-primary col-span-2`}>shipping info</h2>
                <form.Field name={`address`}>
                    {(field) => (
                        <div className={`flex flex-col gap-2 col-span-2`}>
                            <label className={`text-preset-7`}>Your Address</label>
                            <input type={`text`} placeholder={`1137 Williams Avenue`}
                                   value={field.state.value}
                                   onChange={(e)=>field.handleChange(e.target.value)}
                                   className={`w-full border rounded-md px-3 py-2`} />
                        </div>
                    )}
                </form.Field>
                <form.Field name={`zip`}>
                    {(field) => (
                        <div className={`flex flex-col gap-2`}>
                            <label className={`text-preset-7`}>ZIP Code</label>
                            <input type={`text`} placeholder={`10001`}
                                   value={field.state.value}
                                   onChange={(e)=>field.handleChange(e.target.value)}
                                   className={`w-full border rounded-md px-3 py-2`} />
                        </div>
                    )}
                </form.Field>
                <form.Field name={`city`}>
                    {(field) => (
                        <div className={`flex flex-col gap-2`}>
                            <label className={`text-preset-7`}>City</label>
                            <input type={`text`} placeholder={`New York`}
                                   value={field.state.value}
                                   onChange={(e)=>field.handleChange(e.target.value)}
                                   className={`w-full border rounded-md px-3 py-2`} />
                        </div>
                    )}
                </form.Field>
                <form.Field name={`country`}>
                    {(field) => (
                        <div className={`flex flex-col gap-2`}>
                            <label className={`text-preset-7`}>Country</label>
                            <input type={`text`} placeholder={`United States`}
                                   value={field.state.value}
                                   onChange={(e)=>field.handleChange(e.target.value)}
                                   className={`w-full border rounded-md px-3 py-2`} />
                        </div>
                    )}
                </form.Field>
            </fieldset>

            <fieldset className={`grid grid-cols-2 gap-4 `}>
                <h2 className={`uppercase text-primary col-span-2`}>shipping info</h2>
                <div className={`flex gap-2 col-span-2`}>
                    <h2 className={`flex-1 text-preset-7`}>Payment Method</h2>
                    <form.Field name={`paymentMethod`}>
                        {(field) => (
                            <RadioGroup className={`flex-1 text-preset-8`} value={field.state.value}
                                        onValueChange={e=>field.handleChange(e)}>
                                <label className={`flex items-center gap-4 p-4 border rounded-md`}>
                                    <RadioGroupItem value={`e-Money`}></RadioGroupItem>
                                    e-Money
                                </label>
                                <label className={`flex items-center gap-4 p-4 border rounded-md`}>
                                    <RadioGroupItem value={`cod`}></RadioGroupItem>
                                    Cash on Delivery
                                </label>
                            </RadioGroup>
                        )}
                    </form.Field>
                </div>
                {paymentMethod==="e-Money" && <>
                    <form.Field name={`eNo`}>
                        {(field) => (
                            <div className={`flex flex-col gap-2`}>
                                <label className={`text-preset-7`}>e-Money Number</label>
                                <input type={`text`} placeholder={`238521993`} value={field.state.value}
                                       onChange={e=>field.handleChange(e.target.value)}
                                       className={`w-full border rounded-md px-3 py-2`}/>
                            </div>
                        )}
                    </form.Field>
                    <form.Field name={`ePIN`}>
                        {(field) => (
                            <div className={`flex flex-col gap-2`}>
                                <label className={`text-preset-7`}>e-Money PIN</label>
                                <input type={`text`} placeholder={`6891`} value={field.state.value}
                                       onChange={e=>field.handleChange(e.target.value)}
                                       className={`w-full border rounded-md px-3 py-2`}/>
                            </div>
                        )}
                    </form.Field>
                </>
            }
            <button className={`col-span-2 bg-primary text-background py-4`}>CONTINUE & PAY</button>
            </fieldset>
        </form>
    </main>
  );
}
