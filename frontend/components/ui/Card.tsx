"use client";

import { HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ hover = false, className = "", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`bg-white rounded-card p-6 shadow-card 
          ${
            hover
              ? "transition-all duration-500 hover:shadow-card-hover hover:-translate-y-2 hover:border-rose/30 border border-transparent"
              : ""
          }
          ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export default Card;
