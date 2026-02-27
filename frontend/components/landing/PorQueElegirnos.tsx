"use client";

import { Award, Zap, Heart } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";

const features = [
  {
    icon: Award,
    title: "Profesionales Certificados",
    description:
      "10+ años de experiencia, matrícula habilitada. Tu seguridad es nuestra prioridad.",
  },
  {
    icon: Zap,
    title: "Tecnología Premium",
    description:
      "Equipos de última generación importados. Tratamientos efectivos y seguros.",
  },
  {
    icon: Heart,
    title: "Atención Personalizada",
    description:
      "Cada tratamiento adaptado a tu tipo de piel. Te escuchamos y asesoramos.",
  },
];

export default function PorQueElegirnos() {
  return (
    <section id="por-que-elegirnos" className="py-20 md:py-32 bg-cream-dark relative overflow-hidden">
      <div className="absolute inset-0 opacity-50">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative">
        <ScrollReveal>
          <h2 className="font-serif text-4xl md:text-5xl text-center text-charcoal mb-4">
            ¿Por qué elegirnos?
          </h2>
        </ScrollReveal>
        
        <ScrollReveal delay={100}>
          <p className="text-gray text-center max-w-2xl mx-auto mb-16">
            Comprometidos con tu belleza y bienestar, ofreciendo la mejor experiencia en cuidado estético.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <ScrollReveal key={index} delay={index * 150} direction="up">
                <div className="text-center group">
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-gold/10 to-gold/5 mb-6 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-gold/20 transition-all duration-500">
                    <Icon className="w-12 h-12 text-gold" />
                  </div>
                  <h3 className="font-serif text-2xl text-charcoal mb-4 group-hover:text-gold transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray leading-relaxed">{feature.description}</p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
