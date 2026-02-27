"use client";

import { HTMLAttributes, forwardRef } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "pendiente" | "confirmado" | "cancelado" | "nuevo" | "recurrente";
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = "pendiente", className = "", children, ...props }, ref) => {
    const variants = {
      pendiente: "bg-warning/15 text-warning",
      confirmado: "bg-success/15 text-success",
      cancelado: "bg-danger/15 text-danger",
      nuevo: "bg-gold/15 text-gold",
      recurrente: "bg-rose/15 text-rose",
    };

    return (
      <span
        ref={ref}
        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium 
          ${variants[variant]} ${className}`}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";

export default Badge;
