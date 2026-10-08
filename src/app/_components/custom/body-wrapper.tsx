import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export const BodyWrapper = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => <body className={cn("antialiased bg-background", className)}>{children}</body>;
