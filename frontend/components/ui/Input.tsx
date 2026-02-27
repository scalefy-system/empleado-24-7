"use client";

import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-charcoal">{label}</label>
        )}
        <input
          ref={ref}
          className={`w-full px-4 py-2.5 bg-white border border-cream-border rounded-lg 
            text-charcoal placeholder:text-gray 
            focus:outline-none focus:border-rose focus:ring-1 focus:ring-rose
            transition-all duration-300
            ${error ? "border-danger" : ""}
            ${className}`}
          {...props}
        />
        {error && <span className="text-sm text-danger">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
