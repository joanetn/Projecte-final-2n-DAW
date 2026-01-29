import { badgeVariants } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { VariantProps } from "class-variance-authority";

export type Toast = {
    id: string;
    title?: string;
    description?: string;
    type?: "info" | "success" | "error" | "warning";
    duration?: number;
};

export type ToastContextType = {
    toasts: Toast[];
    showToast: (toast: Omit<Toast, "id">) => string;
    removeToast: (id: string) => void;
};

export type Theme = 'light' | 'dark' | 'system';

export type ThemeContextType = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
};

export type PaginationLinkProps = {
    className?: string;
    isActive?: boolean;
    "aria-current"?: "page" | boolean;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>;

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}
