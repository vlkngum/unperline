import { ReactNode } from "react";


interface TabsProps {
value: string;
onValueChange?: (val: string) => void;
children: ReactNode;
className?: string;
}


export function Tabs({ value, onValueChange, children, className = "" }: TabsProps) {
return (
<div className={className} data-value={value}>
{children}
</div>
);
}


interface TabsListProps {
children: ReactNode;
className?: string;
}


export function TabsList({ children, className = "" }: TabsListProps) {
return <div className={`flex bg-white/5 p-1 rounded-xl ${className}`}>{children}</div>;
}


interface TabsTriggerProps {
value: string;
children: ReactNode;
className?: string;
onClick?: () => void;
}


export function TabsTrigger({ value, children, className = "", onClick }: TabsTriggerProps) {
return (
<button
data-value={value}
onClick={onClick}
className={`flex-1 text-center py-2 rounded-lg transition bg-transparent data-[active=true]:bg-white/20 ${className}`}
>
{children}
</button>
);
}


interface TabsContentProps {
value: string;
children: ReactNode;
className?: string;
}


export function TabsContent({ value, children, className = "" }: TabsContentProps) {
return <div data-content={value} className={className}>{children}</div>;
}