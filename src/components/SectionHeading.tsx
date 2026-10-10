import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: ReactNode;
  lead?: ReactNode;
  align?: "center" | "left";
  as?: "h1" | "h2";
  className?: string;
  children?: ReactNode;
  /** Hanzi contextual di dalam kotak 米字格 (jangan dibiarkan kosong). */
  char?: string;
}

/** Judul section dengan aksen kotak 米字格 berisi hanzi — dipakai di semua halaman. */
const SectionHeading = ({ title, lead, align = "center", as = "h2", className, children, char = "学" }: SectionHeadingProps) => {
  const Tag = as;
  return (
    <div className={cn("reveal", align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl", className)}>
      <span
        aria-hidden
        className={cn(
          "mizige mb-4 flex h-11 w-11 items-center justify-center rounded-[8px] border border-hsk/40 font-hanzi text-2xl font-semibold leading-none text-maroon",
          align === "center" && "mx-auto"
        )}
      >
        {char}
      </span>
      <Tag className={cn("section-title", as === "h1" && "md:text-[2.75rem]")}>{title}</Tag>
      {lead ? <p className="section-lead">{lead}</p> : null}
      {children}
    </div>
  );
};

export default SectionHeading;
