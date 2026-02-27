"use client";

import Link from "next/link";
import { Sparkles, Zap, Droplets, Wind, Activity, Eye } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { SERVICIOS } from "@/lib/constantes";
import ScrollReveal from "@/components/ui/ScrollReveal";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Sparkles,
  Zap,
  Droplets,
  Wind,
  Activity,
  Eye,
};

export default function Servicios() {
  return (
    <section id="servicios" className="py-20 md:py-32 bg-cream relative overflow-hidden">
      <div className="absolute inset-0 opacity-50">
        <div className="absolute top-0 left-0 w-96 h-96 bg-rose/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative">
        <ScrollReveal>
          <h2 className="font-serif text-4xl md:text-5xl text-center text-charcoal mb-4">
            Nuestros Tratamientos
          </h2>
        </ScrollReveal>
        
        <ScrollReveal delay={100}>
          <p className="text-gray text-center max-w-2xl mx-auto mb-16">
            Descubrí nuestros tratamientos personalizados diseñados para realzar tu belleza natural
            con la última tecnología y los mejores profesionales.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICIOS.map((servicio, index) => {
            const Icon = iconMap[servicio.icono] || Sparkles;
            return (
              <ScrollReveal key={servicio.id} delay={index * 100} direction="up">
                <Card hover className="flex flex-col h-full group cursor-pointer relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-rose/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
                  
                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-light to-rose/20 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-rose/20 transition-all duration-300">
                      <Icon className="w-7 h-7 text-rose" />
                    </div>

                    <h3 className="font-serif text-xl text-charcoal mb-2 group-hover:text-rose transition-colors duration-300">
                      {servicio.nombre}
                    </h3>

                    <p className="text-gray text-sm mb-4 flex-grow leading-relaxed">
                      {servicio.descripcion}
                    </p>

                    <div className="flex items-center justify-between mt-auto">
                      <div>
                        <span className="text-gold font-medium text-lg">
                          ${servicio.precio.toLocaleString("es-UY")}
                        </span>
                        <span className="text-gray text-xs ml-1">UYU</span>
                      </div>
                      <Link href={`/reservar?servicio=${servicio.id}`}>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="group-hover:bg-rose group-hover:text-white transition-all duration-300"
                        >
                          Reservar
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
