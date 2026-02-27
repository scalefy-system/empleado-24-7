"use client";

import { HTMLAttributes } from "react";

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
}

export default function Skeleton({
  variant = "rectangular",
  width,
  height,
  className = "",
  ...props
}: SkeletonProps) {
  const baseStyles =
    "animate-pulse bg-gradient-to-r from-cream-dark via-cream-border to-cream-dark bg-[length:200%_100%]";

  const variantStyles = {
    text: "rounded h-4",
    circular: "rounded-full",
    rectangular: "rounded-lg",
  };

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      style={{
        width: width,
        height: height,
      }}
      {...props}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-card p-6 shadow-card">
      <div className="flex items-center gap-4 mb-4">
        <Skeleton variant="circular" width={48} height={48} />
        <div className="flex-1">
          <Skeleton variant="text" width="60%" height={16} className="mb-2" />
          <Skeleton variant="text" width="40%" height={12} />
        </div>
      </div>
      <Skeleton variant="text" width="100%" className="mb-2" />
      <Skeleton variant="text" width="80%" className="mb-4" />
      <Skeleton variant="rectangular" width={100} height={36} />
    </div>
  );
}

export function SkeletonServicios() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-white rounded-card p-6 shadow-card">
          <Skeleton variant="circular" width={48} height={48} className="mb-4" />
          <Skeleton variant="text" width="70%" height={20} className="mb-2" />
          <Skeleton variant="text" width="100%" height={14} className="mb-1" />
          <Skeleton variant="text" width="90%" height={14} className="mb-4" />
          <div className="flex justify-between items-center">
            <Skeleton variant="text" width={80} height={16} />
            <Skeleton variant="rectangular" width={80} height={32} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonTable() {
  return (
    <div className="bg-white rounded-card shadow-card overflow-hidden">
      <div className="grid grid-cols-8 border-b border-cream-border">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="p-3">
            <Skeleton variant="text" width="80%" />
          </div>
        ))}
      </div>
      {[1, 2, 3, 4, 5].map((row) => (
        <div key={row} className="grid grid-cols-8 border-b border-cream-border">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((col) => (
            <div key={col} className="p-2">
              <Skeleton variant="text" width="70%" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
