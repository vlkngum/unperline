import { ReactNode, ButtonHTMLAttributes } from "react";


interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    className?: string;
}


export function Button({ children, className = "", ...props }: ButtonProps) {
    return (
        <button
            className={`px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition ${className}`}
            {...props}
                >
            {children}
        </button>
    );
}