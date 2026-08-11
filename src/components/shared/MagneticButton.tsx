"use client";

import React, { useRef, useState, MouseEvent } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

interface MagneticButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  id?: string;
}

export default function MagneticButton({
  children,
  onClick,
  className = "",
  id
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Springs for smooth movement
  const springConfig = { damping: 15, stiffness: 150, mass: 0.6 };
  const mouseX = useSpring(0, springConfig);
  const mouseY = useSpring(0, springConfig);

  // Transform coordinates for magnetic pull strength (limit to max 12px translation)
  const x = useTransform(mouseX, (val) => val * 0.35);
  const y = useTransform(mouseY, (val) => val * 0.35);

  const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    
    // Calculate distance from button center
    const xCenter = left + width / 2;
    const yCenter = top + height / 2;
    
    mouseX.set(clientX - xCenter);
    mouseY.set(clientY - yCenter);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <button
      id={id}
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`relative inline-flex items-center justify-center cursor-pointer select-none outline-none ${className}`}
      style={{ transformStyle: "preserve-3d" }}
    >
      <motion.div
        style={{
          x,
          y,
          transformStyle: "preserve-3d",
        }}
        className="relative w-full h-full flex items-center justify-center"
      >
        {children}
        {/* Glow / ripple boundary indicator */}
        <motion.span
          className="absolute inset-0 rounded-full border border-brand-gold/20 -z-10"
          animate={{
            scale: isHovered ? 1.08 : 1,
            opacity: isHovered ? 0.6 : 0,
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </motion.div>
    </button>
  );
}
