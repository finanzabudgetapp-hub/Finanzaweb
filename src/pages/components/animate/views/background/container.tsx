import Cover3 from "@/assets/images/cover/cover_3.jpg";
import MotionContainer from "@/components/animate/motion-container";
import { getVariant } from "@/components/animate/variants";
import { themeVars } from "@/theme/theme.css";
import { motion, Transition } from "motion/react";
import { useMemo } from "react";

type VariantType = {
  initial?: any;
  animate?: any;
  exit?: any;
  transition?: Transition;
};

type Props = {
  variant: string;
};

// Utility: safely normalize the easing and transition for Motion v12+
function normalizeTransition(t?: VariantType["transition"]): Transition {
  const safeEase: [number, number, number, number] = [0.42, 0, 0.58, 1]; // easeInOut
  const ease =
    Array.isArray(t?.ease) && t.ease.length === 4
      ? (t.ease as [number, number, number, number])
      : safeEase;

  return {
    duration: t?.duration ?? 1.2,
    ease,
  };
}

export default function ContainerView({ variant }: Props) {
  const variants = useMemo(() => getVariant(variant) as VariantType, [variant]);
  const isKenburns = variant.includes("kenburns");

  const safeTransition = useMemo(
    () => normalizeTransition(variants?.transition),
    [variants]
  );

  return (
    <div
      key={variant}
      className="h-[480px] overflow-hidden rounded-lg"
      style={{ backgroundColor: themeVars.colors.background.neutral }}
    >
      <MotionContainer className="flex h-full w-full flex-col items-center gap-6">
        {isKenburns ? (
          <motion.img
            src={Cover3}
            className="h-full w-full object-cover"
            initial={variants?.initial || { scale: 1 }}
            animate={variants?.animate || { scale: 1.1 }}
            exit={variants?.exit || {}}
            transition={safeTransition}
          />
        ) : (
          <motion.div
            className="h-full w-full"
            initial={variants?.initial || { opacity: 0 }}
            animate={variants?.animate || { opacity: 1 }}
            exit={variants?.exit || {}}
            transition={safeTransition}
          />
        )}
      </MotionContainer>
    </div>
  );
}
