"use client";

import { Star, Quote } from "lucide-react";
import Card from "@/components/ui/Card";
import ScrollReveal from "@/components/ui/ScrollReveal";

const testimonios = [
  {
    nombre: "María G.",
    texto:
      "Increíble atención, los resultados superaron mis expectativas. ¡Volvería mil veces!",
    estrellas: 5,
  },
  {
    nombre: "Valentina R.",
    texto:
      "El mejor lugar para cuidarse. Profesionales, amables y el espacio es hermoso.",
    estrellas: 5,
  },
  {
    nombre: "Camila H.",
    texto:
      "Reservar online fue súper fácil y me recordaron el turno. Todo perfecto.",
    estrellas: 5,
  },
];

export default function Testimonios() {
  return (
    <section className="py-20 md:py-32 bg-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-50">
        <div className="absolute top-20 left-10 w-72 h-72 bg-rose/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-gold/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative">
        <ScrollReveal>
          <h2 className="font-serif text-4xl md:text-5xl text-center text-charcoal mb-4">
            Lo que dicen nuestras clientas
          </h2>
        </ScrollReveal>
        
        <ScrollReveal delay={100}>
          <p className="text-gray text-center max-w-2xl mx-auto mb-16">
            La satisfacción de nuestras clientas es nuestro mayor logro.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonios.map((t, index) => (
            <ScrollReveal key={index} delay={index * 150} direction="up">
              <Card className="h-full relative group hover:-translate-y-2 transition-all duration-500">
                <div className="absolute top-4 right-4 text-rose/10 group-hover:text-rose/20 transition-colors">
                  <Quote className="w-12 h-12" />
                </div>
                
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.estrellas }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-gold text-gold"
                    />
                  ))}
                </div>
                <p className="text-gray mb-6 italic leading-relaxed relative z-10">
                  &ldquo;{t.texto}&rdquo;
                </p>
                <span className="font-medium text-charcoal">— {t.nombre}</span>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
