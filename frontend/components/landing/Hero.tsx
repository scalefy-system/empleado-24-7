"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";

export default function Hero() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-cream">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-rose/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gold/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div
            className={`transition-all duration-500 ${
              isLoaded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
            }`}
          >
            <span className="inline-block text-xs tracking-[0.4em] text-rose font-medium uppercase mb-6 px-4 py-2 bg-rose/10 rounded-full">
              Clínica Premium en Montevideo
            </span>

            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-medium text-charcoal mb-6 leading-tight">
              Tu belleza merece{" "}
              <span className="text-rose italic">atención experta</span>
            </h1>

            <p className="text-lg md:text-xl text-gray mb-10 leading-relaxed">
              Tratamientos estéticos de vanguardia con profesionales certificados.
              <br className="hidden md:block" />
              Agendá tu turno online, en minutos.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/reservar">
                <Button size="lg" className="shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                  Reservar turno
                </Button>
              </Link>
              <Link href="#servicios">
                <Button variant="secondary" size="lg">
                  Conocer servicios
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center">
                <span className="text-success text-xl">✓</span>
              </div>
              <div>
                <p className="font-medium text-charcoal text-sm">+500 clientas</p>
                <p className="text-xs text-gray">satisfechas</p>
              </div>
            </div>
          </div>

          <div
            className={`transition-all duration-500 ${
              isLoaded ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            }`}
            style={{ transitionDelay: "0.15s" }}
          >
            <div className="relative">
              <div className="absolute -inset-6 bg-gradient-to-br from-rose/20 to-gold/20 rounded-3xl blur-3xl" />
              <img
                src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80"
                alt="Tratamiento facial profesional"
                className="relative rounded-2xl shadow-2xl object-cover h-[550px] w-full"
              />
            </div>
          </div>
        </div>
      </div>

      <div
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 transition-all duration-500 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        style={{ transitionDelay: "0.6s" }}
      >
        <div className="w-6 h-10 border-2 border-charcoal/30 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-charcoal/50 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}
