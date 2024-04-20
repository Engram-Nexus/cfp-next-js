import ChatSection from "@/components/chat-section";
import Header from "@/components/header";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center gap-10 py-24 px-12 md:px-24 background-gradient">
      <Header />
      <ChatSection assistantId="asst_TpskPBGaygbj3IoH2HPF6yCl" />
    </main>
  );
}
