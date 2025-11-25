"use client"

import {WithChildProps, WithClassNameProps} from "@/types";
import {useStore} from "@tanstack/react-store";
import {dynamicComponentStore} from "@/lib/store/dynamicComponentStore";

type DynamicContainerProps = WithChildProps & WithClassNameProps & {
    name: string;
}

export function DynamicContainer({children, className, name}:DynamicContainerProps) {
    const props = useStore(dynamicComponentStore, dynamicComponent=>dynamicComponent[name]);

    return (
        <div {...props} className={`${className}`}
             onClick={()=>dynamicComponentStore.setState({[name]:{"data-selected": "false"}})}>
            {children}
        </div>
    );
}   