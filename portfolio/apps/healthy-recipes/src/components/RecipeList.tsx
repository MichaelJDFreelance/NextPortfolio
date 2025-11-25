"use client"

import {Icon} from "@/components/Icon";
import {recipesStore} from "@/lib/store/recipesStore";
import {useStore} from "@tanstack/react-store";

export function RecipeList({initialRecipes}:{initialRecipes:any[]}) {
    const recipes = useStore(recipesStore)

    recipesStore.setState(prev=>{
        return {
            ...prev,
            recipes:initialRecipes
        }
    })

    return (
        <>
            {recipes?.recipes?.map((recipe, index)=> (
                <article key={`recipe-${recipe.id}`} className={`border border-neutral-300 flex flex-col-reverse gap-4 p-2 rounded-button 
                    px-2 bg-white`}>
                    <div className={`flex flex-col gap-4`}>
                        <header className={`flex flex-col gap-2.5`}>
                            <h2 className={`text-preset-5 text-neutral-900`}>{recipe.title}</h2>
                            <p className={`text-preset-9 text-neutral-800`}>{recipe.overview}</p>
                        </header>
                        <dl className={`text-preset-9 text-neutral-900 flex flex-wrap gap-x-4 gap-y-2`}>
                            <div className={`flex items-center gap-[1ch]`}>
                                <dt className={`flex items-center gap-1.5`}>
                                    <Icon name="servings" />
                                    Servings:</dt><dd>{recipe.servings}</dd>
                            </div>
                            <div className={`flex items-center gap-[1ch]`}>
                                <dt className={`flex items-center gap-1.5`}>
                                    <Icon name="prep-time" />
                                    Prep:</dt> <dd>{recipe.prepMinutes} mins</dd>
                            </div>
                            <div className={`flex items-center gap-[1ch]`}>
                                <dt className={`flex items-center gap-1.5`}>
                                    <Icon name="cook-time" />
                                    Cook:</dt> <dd>{recipe.cookMinutes} min</dd>
                            </div>
                        </dl>
                        <a className={`flex justify-center rounded-full py-3 px-8 bg-neutral-900 text-white text-preset-8`}>
                            View Recipe</a>
                    </div>
                    <img className={`rounded-button`} height={300} width={300}
                         src={recipe?.image?.large?.replace('.', '') || ''} alt={`recipe`} />
                </article>
            ))}
        </>
    );
}