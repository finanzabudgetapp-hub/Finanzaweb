import React from "react";
import { motion } from "framer-motion";

export default function About() {
	return (
		<section
			id="about"
			className="bg-gradient-to-b from-[#fff] to-[#fff] text-black base: no-wrap base:flex-wrap-reverse md:wrap
	 py-28 flex mb-10 gap-4 md:px-28 align-center"
		>
			<div className="container px-auto flex hidden md:block justify-center mt-10 gap-4">
				<motion.img
					src="/assets/images/33.png"
					alt="Expense Analytics"
					className="w-100 h-full"
					whileHover={{ scale: 1.05 }}
				/>
			</div>
			<div className="container mx-auto mt-10 px-6 text-left">
				<motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl font-bold mb-6">
					About Us
				</motion.h1>
				<motion.p
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.3 }}
					className="text-md max-w-xl mb-5"
				>
					Finanza is a smart personal finance app built to help you take control of your money with confidence. Whether
					you’re budgeting, tracking expenses, or planning savings goals, Finanza gives you the clarity you need to make
					smarter financial decisions. We combine simplicity with powerful insights — so you can manage your daily
					spending, set budgets, monitor cash flow, and visualize your financial progress all in one place. <br />
					<br />
					With customizable settings, real-time currency tracking, and intelligent analytics, Finanza is your all-in-one
					money companion designed to make financial management effortless and rewarding.
				</motion.p>
				<a href="#learn-more" style={{ color: "white" }}>
					<motion.button
						whileHover={{ scale: 1.05 }}
						className="bg-[#7f3dff] text-white px-6 py-3 text-md rounded-full font-semibold shadow-md hover:bg-[#7f3dff]-100 transition"
					>
						Learn More
					</motion.button>
				</a>
			</div>
		</section>
	);
}
