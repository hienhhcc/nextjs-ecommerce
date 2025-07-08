import { ReactNode } from "react";

export default function Nav({ children }: { children: ReactNode }) {
  return (
    <nav
      className="bg-primary text-primary-foreground 
     flex justify-center px-4"
    >
      {children}
    </nav>
  );
}
