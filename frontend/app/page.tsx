import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Servicios from "@/components/landing/Servicios";
import PorQueElegirnos from "@/components/landing/PorQueElegirnos";
import Testimonios from "@/components/landing/Testimonios";
import Footer from "@/components/landing/Footer";
import ChatWidget from "@/components/chat/ChatWidget";
import { ToastProvider } from "@/components/ui/Toast";

export default function Home() {
  return (
    <ToastProvider>
      <main className="min-h-screen">
        <Navbar />
        <Hero />
        <Servicios />
        <PorQueElegirnos />
        <Testimonios />
        <Footer />
        <ChatWidget />
      </main>
    </ToastProvider>
  );
}
