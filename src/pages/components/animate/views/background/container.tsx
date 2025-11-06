import Cover3 from "@/assets/images/cover/cover_3.jpg";
import MotionContainer from "@/components/animate/motion-container";
import { getVariant } from "@/components/animate/variants";
import { themeVars } from "@/theme/theme.css";
import { motion } from "motion/react";
import { useMemo } from "react";

type VariantType = {
	initial?: any;
	animate?: any;
	exit?: any;
	transition?: {
		duration?: number;
		ease?: number[] | string;
	};
};

type Props = {
	variant: string;
};

export default function ContainerView({ variant }: Props) {
	const variants: VariantType = useMemo(() => getVariant(variant) as VariantType, [variant]);
	const isKenburns = variant.includes("kenburns");

	// Normalize ease value (Framer Motion 12+ requires function or numeric array)
	const safeTransition = variants?.transition
		? {
				...variants.transition,
				ease:
					Array.isArray(variants.transition.ease) &&
					variants.transition.ease.length === 4
						? variants.transition.ease
						: [0.42, 0, 0.58, 1], // standard easeInOut
		  }
		: { duration: 1.2, ease: [0.42, 0, 0.58, 1] };

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
