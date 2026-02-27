"use client";

import { Instagram, Facebook, MapPin, Phone, Mail, Sparkles, Clock } from "lucide-react";
import Link from "next/link";
import { SERVICIOS } from "@/lib/constantes";

export default function Footer() {
  return (
    <footer id="contacto" className="bg-gradient-to-b from-charcoal to-charcoal/95 py-16 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-rose rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gold rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose to-rose-dark flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-serif text-2xl font-semibold text-white">
                LUMINA
              </span>
            </div>
            <p className="text-gray-light mt-4 text-sm leading-relaxed">
              Realza tu belleza natural con tratamientos de vanguardia.
              Tu confianza es nuestro mayor logro.
            </p>
          </div>

          <div>
            <h4 className="text-white font-medium mb-6 relative">
              Servicios
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-rose" />
            </h4>
            <ul className="space-y-3">
              {SERVICIOS.map((s) => (
                <li key={s.id}>
                  <span className="text-gray-light text-sm hover:text-rose transition-colors cursor-pointer">
                    {s.nombre}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-6 relative">
              Contacto
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-rose" />
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-light text-sm group">
                <MapPin className="w-5 h-5 mt-0.5 shrink-0 group-hover:text-rose transition-colors" />
                <span>Av. 18 de Julio 1234, Montevideo</span>
              </li>
              <li className="flex items-center gap-3 text-gray-light text-sm group">
                <Phone className="w-5 h-5 shrink-0 group-hover:text-rose transition-colors" />
                <span>+598 98 123 456</span>
              </li>
              <li className="flex items-center gap-3 text-gray-light text-sm group">
                <Mail className="w-5 h-5 shrink-0 group-hover:text-rose transition-colors" />
                <span>hola@luminaestetica.com.uy</span>
              </li>
              <li className="flex items-center gap-3 text-gray-light text-sm">
                <Clock className="w-5 h-5 shrink-0" />
                <span>Lun-Vie: 9:00 a 19:00</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-6 relative">
              Seguinos
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-rose" />
            </h4>
            <p className="text-gray-light text-sm mb-6">
              Enterate de las últimas promociones y tratamientos nuevos.
            </p>
            <div className="flex gap-3">
              <a
                href="https://instagram.com/luminaestetica"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center hover:bg-gradient-to-br hover:from-rose hover:to-rose-dark transition-all duration-300 hover:scale-110"
              >
                <Instagram className="w-5 h-5 text-white" />
              </a>
              <a
                href="https://facebook.com/luminaestetica"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center hover:bg-gradient-to-br hover:from-rose hover:to-rose-dark transition-all duration-300 hover:scale-110"
              >
                <Facebook className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-light text-sm">
              © 2025 Lumina Estética. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <Link href="#" className="text-gray-light hover:text-rose transition-colors">
                Términos y condiciones
              </Link>
              <Link href="#" className="text-gray-light hover:text-rose transition-colors">
                Política de privacidad
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
