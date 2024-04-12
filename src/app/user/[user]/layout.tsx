import { montserrat } from "@/lib/fonts";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className={montserrat.className}>{children}</div>;
}
