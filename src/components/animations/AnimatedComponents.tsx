import { ReactNode } from 'react';
import { useScrollAnimation } from '../../hooks/useAnimations';

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}

export function AnimatedCard({ 
  children, 
  className = '', 
  delay = 0,
  direction = 'up' 
}: AnimatedCardProps) {
  const { ref, isVisible } = useScrollAnimation(0.1);

  const getTransform = () => {
    if (isVisible) return 'translate(0, 0)';
    
    switch (direction) {
      case 'up':
        return 'translate(0, 50px)';
      case 'down':
        return 'translate(0, -50px)';
      case 'left':
        return 'translate(50px, 0)';
      case 'right':
        return 'translate(-50px, 0)';
      default:
        return 'translate(0, 50px)';
    }
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transition: `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

interface StaggeredContainerProps {
  children: ReactNode[];
  className?: string;
  staggerDelay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}

export function StaggeredContainer({
  children,
  className = '',
  staggerDelay = 100,
  direction = 'up'
}: StaggeredContainerProps) {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <AnimatedCard
          key={index}
          delay={index * staggerDelay}
          direction={direction}
        >
          {child}
        </AnimatedCard>
      ))}
    </div>
  );
}

interface PulseEffectProps {
  children: ReactNode;
  className?: string;
  color?: string;
}

export function PulseEffect({ children, className = '', color = '#f0a41c' }: PulseEffectProps) {
  return (
    <div className={`relative ${className}`}>
      <div
        className="absolute inset-0 rounded-full animate-pulse"
        style={{
          backgroundColor: color,
          opacity: 0.2,
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}

interface HoverScaleProps {
  children: ReactNode;
  className?: string;
  scale?: number;
}

export function HoverScale({ children, className = '', scale = 1.05 }: HoverScaleProps) {
  return (
    <div
      className={`transition-transform duration-300 hover:scale-${scale} ${className}`}
      style={{
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = `scale(${scale})`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      {children}
    </div>
  );
}

interface GradientBorderProps {
  children: ReactNode;
  className?: string;
  gradient?: string;
}

export function GradientBorder({
  children,
  className = '',
  gradient = 'linear-gradient(135deg, #f0a41c 0%, #e2472e 100%)'
}: GradientBorderProps) {
  return (
    <div
      className={`relative p-[2px] rounded-lg ${className}`}
      style={{
        background: gradient,
      }}
    >
      <div className="bg-night rounded-lg h-full w-full">
        {children}
      </div>
    </div>
  );
}

interface ShimmerEffectProps {
  children: ReactNode;
  className?: string;
}

export function ShimmerEffect({ children, className = '' }: ShimmerEffectProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div
        className="absolute inset-0 -translate-x-full animate-shimmer"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(240, 164, 28, 0.2), transparent)',
          animation: 'shimmer 2s infinite',
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}

interface FloatingElementProps {
  children: ReactNode;
  className?: string;
  amplitude?: number;
  duration?: number;
}

export function FloatingElement({
  children,
  className = '',
  amplitude = 10,
  duration = 3
}: FloatingElementProps) {
  return (
    <div
      className={className}
      style={{
        animation: `float ${duration}s ease-in-out infinite`,
      }}
    >
      {children}
    </div>
  );
}

interface RotateOnHoverProps {
  children: ReactNode;
  className?: string;
  degrees?: number;
}

export function RotateOnHover({ children, className = '', degrees = 360 }: RotateOnHoverProps) {
  return (
    <div
      className={`transition-transform duration-500 ${className}`}
      style={{
        transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = `rotate(${degrees}deg)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'rotate(0deg)';
      }}
    >
      {children}
    </div>
  );
}

interface GlowEffectProps {
  children: ReactNode;
  className?: string;
  color?: string;
  intensity?: number;
}

export function GlowEffect({
  children,
  className = '',
  color = '#f0a41c',
  intensity = 20
}: GlowEffectProps) {
  return (
    <div
      className={`transition-all duration-300 ${className}`}
      style={{
        boxShadow: `0 0 ${intensity}px ${color}`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 0 ${intensity * 2}px ${color}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = `0 0 ${intensity}px ${color}`;
      }}
    >
      {children}
    </div>
  );
}

interface SlideInProps {
  children: ReactNode;
  className?: string;
  from?: 'left' | 'right' | 'top' | 'bottom';
  delay?: number;
}

export function SlideIn({
  children,
  className = '',
  from = 'left',
  delay = 0
}: SlideInProps) {
  const { ref, isVisible } = useScrollAnimation(0.1);

  const getInitialTransform = () => {
    switch (from) {
      case 'left':
        return 'translateX(-100%)';
      case 'right':
        return 'translateX(100%)';
      case 'top':
        return 'translateY(-100%)';
      case 'bottom':
        return 'translateY(100%)';
      default:
        return 'translateX(-100%)';
    }
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translate(0, 0)' : getInitialTransform(),
        transition: `all 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

interface FadeInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function FadeIn({ children, className = '', delay = 0 }: FadeInProps) {
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transition: `opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

interface ScaleInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  initialScale?: number;
}

export function ScaleIn({
  children,
  className = '',
  delay = 0,
  initialScale = 0.8
}: ScaleInProps) {
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'scale(1)' : `scale(${initialScale})`,
        transition: `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
