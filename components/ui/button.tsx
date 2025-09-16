// components/ui/button.tsx
import type { ButtonHTMLAttributes } from 'react';

function cx(...cls: (string | undefined | false)[]) { return cls.filter(Boolean).join(' '); }

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost' | 'danger';
};

export function Button({ className, variant = 'primary', ...props }: Props) {
  const base = 'w-full rounded-lg py-3 transition duration-150 ease-out disabled:opacity-50 disabled:cursor-not-allowed';
  const styles = {
    primary: 'bg-emerald-600 hover:bg-emerald-500 text-white',
    ghost: 'bg-white/5 hover:bg-white/10',
    danger: 'bg-red-500/20 hover:bg-red-500/30 text-red-200',
  }[variant];
  return <button className={cx(base, styles, className)} {...props} />;
}


