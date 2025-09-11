// components/ui/card.tsx
import type { HTMLAttributes } from 'react';

function cx(...cls: (string | undefined | false)[]) { return cls.filter(Boolean).join(' '); }

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx('rounded-lg bg-[#0f1923] shadow-xl', className)} {...props} />;
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx('px-4 pt-3 pb-2 flex items-center justify-between', className)} {...props} />;
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx('px-4 pb-4', className)} {...props} />;
}