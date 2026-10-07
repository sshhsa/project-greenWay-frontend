'use client';
// Власник: Олександр (TL). Анімації: LazyMotion вантажить лише domAnimation (~15 KB замість повного motion),
// strict — у проєкті використовуємо тільки `m.*`. reducedMotion="user" — поважаємо системне «зменшити рух».
import { LazyMotion, MotionConfig, domAnimation } from 'motion/react';

export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
