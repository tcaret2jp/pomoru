import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    
    const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]';
    
    const variants = {
      primary: 'bg-primary text-white hover:opacity-90 shadow-md shadow-primary/10',
      secondary: 'bg-secondary text-white hover:opacity-90 shadow-md shadow-secondary/10',
      ghost: 'hover:bg-muted text-foreground',
      destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    };
    
    const sizes = {
      sm: 'h-9 px-3 rounded-md text-sm',
      md: 'h-10 py-2 px-4 text-sm',
      lg: 'h-12 px-8 rounded-xl text-base',
    };

    return (
      <Comp
        ref={ref as any}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };