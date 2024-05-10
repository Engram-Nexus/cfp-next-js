import { libreFranklin } from "@/lib/fonts";

export default function Layout({ children }: { children: React.ReactNode }) {
    return <div className={libreFranklin.className}>{children}</div>;
  }