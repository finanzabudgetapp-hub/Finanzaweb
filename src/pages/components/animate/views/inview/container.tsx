import Cover3 from "@/assets/images/cover/cover_3.jpg";
import MotionContainer from "@/components/animate/motion-container";
import { getVariant } from "@/components/animate/variants";
import { themeVars } from "@/theme/theme.css";
import { m } from "motion/react";
import { repeat } from "ramda";
import { useMemo } from "react";

const TEXT = "finanzaAdmin";

type Props = {
  isText: boolean;
  isMulti: boolean;
  variant: string;
};

// ---- helper ----
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

// ---- component ----
export default function ContainerView({ isText, variant, isMulti }: Props) {
  const rawVariant = useMemo(() => getVariant(variant), [variant]);
  const variants = useMemo(() => normalizeVariant(rawVariant), [rawVariant]);
  const imgs = useMemo(() => (isMulti ? repeat(Cover3, 5) : [Cover3]), [isMulti]);

  return (
    <div
      key={variant}
      className="h-[480px] overflow-auto rounded-lg flex flex-col items-center justify-center"
      style={{ backgroundColor: themeVars.colors.background.neutral }}
    >
      {isText ? (
        <MotionContainer className="flex h-[480px] items-center justify-center font-bold md:text-6xl">
          {TEXT.split("").map((letter, idx) => (
            <m.div
              key={`${letter}-${idx}`}
              initial={variants?.initial}
              animate={variants?.animate}
              exit={variants?.exit}
              transition={variants?.transition}
            >
              {letter}
            </m.div>
          ))}
        </MotionContainer>
      ) : (
        <MotionContainer className="flex flex-col items-center justify-center gap-6">
          {imgs.map((img, idx) => (
            <m.img
              key={`${img}-${idx}`}
              src={img}
              style={{
                objectFit: "cover",
                width: "240px",
                height: isMulti ? "36px" : "240px",
                margin: "auto",
                borderRadius: "8px",
              }}
              initial={variants?.initial}
              animate={variants?.animate}
              exit={variants?.exit}
              transition={variants?.transition}
            />
          ))}
        </MotionContainer>
      )}
    </div>
  );
}
