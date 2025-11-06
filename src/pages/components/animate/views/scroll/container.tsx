import MotionViewport from "@/components/animate/motion-viewport";
import { getVariant } from "@/components/animate/variants";
import { themeVars } from "@/theme/theme.css";
import { Card } from "@/ui/card";
import { useMemo } from "react";

// --- Type-safe normalization helper ---
function normalizeVariant(v: any) {
  if (!v) return undefined;

  const safeEase =
    Array.isArray(v?.animate?.transition?.ease) && v.animate.transition.ease.length === 4
      ? v.animate.transition.ease
      : [0.42, 0, 0.58, 1]; // standard easeInOut

  const transition = {
    duration: v?.animate?.transition?.duration ?? 1.2,
    ease: safeEase,
  };

  return {
    initial: v.initial ?? {},
    animate: v.animate ?? {},
    exit: v.exit ?? {},
    transition,
  };
}

type Props = {
  variant: string;
};

export default function ContainerView({ variant }: Props) {
  const rawVariant = useMemo(() => getVariant(variant), [variant]);
  const variants = useMemo(() => normalizeVariant(rawVariant), [rawVariant]);

  return (
    <div
      key={variant}
      className="h-[480px] overflow-auto rounded-lg px-20"
      style={{ backgroundColor: themeVars.colors.background.neutral }}
    >
      {[...Array(40)].map((_, index) => (
        <MotionViewport
          key={index}
          initial={variants?.initial}
          animate={variants?.animate}
          exit={variants?.exit}
          transition={variants?.transition}
          className="mt-4"
        >
          <Card>
            <span className="text-center">Item {index + 1}</span>
          </Card>
        </MotionViewport>
      ))}
    </div>
  );
}
