import LogoIcon from "@/icons/logo.svg";

type HasClassName = {
    className?: string;
}

export function Logo({className}:HasClassName) {
    return (
        <LogoIcon className={className}></LogoIcon>
    );
}