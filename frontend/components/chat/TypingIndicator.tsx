'use client';

export const TypingIndicator = () => (
  <div className="flex justify-start">
    <div className="bg-white border border-cream-border px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
      <div className="flex gap-1.5">
        {[0, 150, 300].map((delay) => (
          <span
            key={delay}
            className="w-2 h-2 bg-rose rounded-full animate-bounce"
            style={{ animationDelay: `${delay}ms` }}
          />
        ))}
      </div>
    </div>
  </div>
);
