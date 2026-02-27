"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, Users, UserPlus, Sparkles, Settings, LogOut, ChevronRight } from "lucide-react";

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();

  const links = [
    { href: "/admin/agenda", label: "Agenda", icon: Calendar },
    { href: "/admin/crm", label: "CRM", icon: Users },
    { href: "/admin/leads", label: "Contacts", icon: UserPlus },
  ];

  const handleLinkClick = () => {
    if (onClose) onClose();
  };

  return (
    <aside className="h-full w-64 bg-gradient-to-b from-charcoal to-charcoal/95 flex flex-col shadow-2xl">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose to-rose-dark flex items-center justify-center shadow-lg shadow-rose/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-serif text-xl font-semibold text-white block">
              LUMINA
            </span>
            <span className="text-xs text-gray-light">Panel Admin</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-6">
        <div className="mb-6">
          <span className="text-xs font-medium text-gray-light uppercase tracking-wider px-3 mb-3 block">
            Menú
          </span>
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={handleLinkClick}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-all duration-200 group ${
                  isActive
                    ? "bg-gradient-to-r from-rose to-rose-dark text-white shadow-lg shadow-rose/20"
                    : "text-gray-light hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'group-hover:scale-110 transition-transform'}`} />
                <span className="font-medium">{link.label}</span>
                {isActive && (
                  <ChevronRight className="w-4 h-4 ml-auto" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="p-4 border-t border-white/10">
        <button className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-gray-light hover:bg-white/10 hover:text-white transition-all">
          <Settings className="w-5 h-5" />
          <span className="font-medium">Configuración</span>
        </button>
        <button className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-gray-light hover:bg-white/10 hover:text-white transition-all">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}
