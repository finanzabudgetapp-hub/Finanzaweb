import React from "react";
import { motion } from "framer-motion";

export default function Hero() {
	return (
		<section
			id="home"
			className="bg-gradient-to-b from-[#7f3dff] to-[#fff] text-white pt-24 pb-0 relative overflow-set"
		>
			<div className="container mx-auto mt-10 md:px-6 px-1 text-center">
				<motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-6xl font-bold mb-6">
					Manage Your Finances
					<br /> with <span className="text-yellow-300">Finanza</span>
				</motion.h1>
				<motion.p
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.3 }}
					className="text-md max-w-xl mx-auto mb-10"
				>
					Track expenses, monitor savings, and achieve your financial goals — all in one smart app designed to make your
					money work for you.
				</motion.p>

				<div className="flex justify-center gap-4">
					<motion.button
						whileHover={{ scale: 1.05 }}
						className="bg-white text-[#7f3dff] px-6 py-3 text-md rounded-full font-semibold shadow-md hover:bg-gray-100 transition"
					>
						Download App
					</motion.button>
					<a href="#learn-more" style={{ color: "white" }}>
						<motion.button
							whileHover={{ scale: 1.05 }}
							className="border-2 border-white px-6 py-3 text-md rounded-full font-semibold hover:bg-white hover:text-[#7f3dff] transition"
						>
							Learn More
						</motion.button>
					</a>
				</div>

				<div className="flex flex-wrap justify-center mt-15 gap-4">
					<motion.img
						src="/assets/images/2.png"
						alt="Expense Analytics"
						className="w-70 h-full hidden md:block "
						whileHover={{ scale: 1.05 }}
					/>
					<motion.img
						src="/assets/images/1.png"
						alt="Finanza Dashboard"
						style={{ marginTop: -20, minHeight: "100%" }}
						className="w-80 h-full"
						whileHover={{ scale: 1.05 }}
					/>
					<motion.img
						src="/assets/images/3.png"
						alt="Savings Overview"
						className="w-70 h-full hidden md:block"
						whileHover={{ scale: 1.05 }}
					/>
				</div>
			</div>
		</section>
	);
}
