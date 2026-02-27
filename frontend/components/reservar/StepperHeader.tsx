"use client";

import { Check, Sparkles, Calendar, User } from "lucide-react";

const steps = [
  { number: 1, label: "Servicio", icon: Sparkles },
  { number: 2, label: "Fecha y hora", icon: Calendar },
  { number: 3, label: "Tus datos", icon: User },
];

export default function StepperHeader({ step }: { step: number }) {
  return (
    <div className="flex items-center justify-center mb-12">
      {steps.map((s, index) => {
        const Icon = s.icon;
        const isCompleted = step > s.number;
        const isActive = step === s.number;
        
        return (
          <div key={s.number} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`relative w-12 h-12 rounded-full flex items-center justify-center font-medium transition-all duration-500 ${
                  isCompleted
                    ? "bg-gold text-white shadow-lg shadow-gold/30"
                    : isActive
                    ? "bg-rose text-white shadow-lg shadow-rose/30 scale-110"
                    : "bg-gray-light/50 text-gray"
                }`}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                )}
                
                {isActive && (
                  <span className="absolute inset-0 rounded-full bg-rose animate-ping opacity-20" />
                )}
              </div>
              <span
                className={`text-sm mt-3 font-medium transition-colors duration-300 ${
                  isActive ? "text-rose" : isCompleted ? "text-gold" : "text-gray-light"
                }`}
              >
                {s.label}
              </span>
            </div>

            {index < steps.length - 1 && (
              <div
                className={`w-12 md:w-20 h-0.5 mx-1 md:mx-3 transition-all duration-500 ${
                  isCompleted ? "bg-gold" : "bg-gray-light/50"
                }`}
              >
                <div 
                  className={`h-full bg-gold transition-all duration-700 ${isCompleted ? 'w-full' : 'w-0'}`}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
