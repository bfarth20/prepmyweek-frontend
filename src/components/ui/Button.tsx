// src/components/ui/Button.tsx
"use client";

import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type React from "react";

const button = tv({
  base: "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  variants: {
    variant: {
      default:
        "bg-[var(--color-brand)] shadow-lg text-white hover:bg-green-600 transition-transform duration-100 active:scale-95",
      outline:
        "border border-[var(--color-brand)] text-[var(--color-brand)] hover:bg-orange-700 hover:text-white hover:cursor-pointer",
      ghost: "text-[var(--color-brand)] hover:bg-[var(--color-brand)/10]",
      secondary:
        "bg-transparent text-gray-600 hover:text-[color:theme(colors.orange.700)] hover:cursor-pointer",
      danger: "bg-[var(--color-brand)] text-white hover:bg-red-500",
      whiteblock:
        "block bg-white shadow p-4 rounded hover:bg-gray-50 transition-transform duration-100 active:scale-95 text-left",
    },
    size: {
      default: "h-10 px-4 py-2",
      sm: "h-9 px-3",
      lg: "h-11 px-8",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

type BaseProps = VariantProps<typeof button> & {
  className?: string;
};

// Props when rendering a button
type ButtonProps = BaseProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

// Props when rendering a link
type AnchorProps = BaseProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

type Props = ButtonProps | AnchorProps;

export function Button({ className, variant, size, href, ...props }: Props) {
  const classNames = cn(button({ variant, size }), className);

  if (href) {
    // Destructure to exclude href from props spread
    const { href: _unused, ...restProps } = props as AnchorProps;
    return <Link href={href} className={classNames} {...restProps} />;
  }

  return <button className={classNames} {...(props as ButtonProps)} />;
}
