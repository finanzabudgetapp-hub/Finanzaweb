import { motion } from "motion/react";
import { useMemo } from "react";
import { getVariant } from "@/components/animate/variants";
import { themeVars } from "@/theme/theme.css";
import MotionContainer from "@/components/animate/motion-container";
import Cover3 from "@/assets/images/cover/cover_3.jpg";

type VariantType = {
  initial?: any;
  animate?: any;
  exit?: any;
  transition?: {
    duration?: number;
    ease?: number[] | string | ((t: number) => number);
  };
};

type Props = {
  variant: string;
};

export default function ContainerView({ variant }: Props) {
  const variants: VariantType = useMemo(
    () => (getVariant(variant) as VariantType) || {},
    [variant]
  );

  const isKenburns = variant.includes("kenburns");

  // ✅ Safe transition compatible with Framer Motion v12+
  const safeTransition = useMemo(() => {
    const ease = variants.transition?.ease;

    let validEase: number[] | ((t: number) => number) | undefined;

    // Accept only valid cubic-bezier arrays
    if (Array.isArray(ease) && ease.length === 4 && ease.every((v) => typeof v === "number")) {
      validEase = ease as [number, number, number, number];
    } else if (typeof ease === "function") {
      validEase = ease;
    } else {
      // Default to standard easeInOut curve
      validEase = [0.42, 0, 0.58, 1];
    }

    return {
      duration: variants.transition?.duration ?? 1.2,
      ease: validEase,
    };
  }, [variants.transition]);

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
            initial={variants.initial || { scale: 1 }}
            animate={variants.animate || { scale: 1.1 }}
            exit={variants.exit || {}}
            transition={safeTransition}
          />
        ) : (
          <motion.div
            className="h-full w-full"
            initial={variants.initial || { opacity: 0 }}
            animate={variants.animate || { opacity: 1 }}
            exit={variants.exit || {}}
            transition={safeTransition}
          />
        )}
      </MotionContainer>
    </div>
  );
}
