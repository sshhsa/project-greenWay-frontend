// Спільні анімації (motion). Тільки opacity/transform — без перерахунку layout, не б'є по PageSpeed.
import type { Transition, Variants } from 'motion/react';

const ease: Transition['ease'] = [0.4, 0, 0.2, 1];

// фон модалки
export const backdropMotion = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2, ease } },
  exit: { opacity: 0, transition: { duration: 0.15, ease } },
};

// вікно модалки
export const dialogMotion = {
  initial: { opacity: 0, scale: 0.96, y: 12 },
  animate: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.22, ease } },
  exit: { opacity: 0, scale: 0.96, y: 8, transition: { duration: 0.15, ease } },
};

// бургер-меню: виїзд справа
export const menuMotion = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.25, ease } },
  exit: { opacity: 0, x: 40, transition: { duration: 0.18, ease } },
};

// список, у якому діти з'являються по черзі
export const staggerList: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease } },
};
