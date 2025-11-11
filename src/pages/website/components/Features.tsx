// src/components/Features.jsx
import React from "react";

const features = [
	{
		title: "Expense Tracking",
		desc: "Automatically categorize and visualize where your money goes every month.",
		icon: "💰",
	},
	{
		title: "Smart Budgeting",
		desc: "Set monthly goals and let Finanza help you stick to them effortlessly.",
		icon: "📊",
	},
	{
		title: "Financial Insights",
		desc: "AI-powered insights help you identify spending habits and saving opportunities.",
		icon: "🤖",
	},
];

export default function Features() {
	return (
		<section
			id="features"
			className="py-24 px-auto md:px-24 pt-100 bg-[#7f3dff] text-center"
			style={{ marginTop: -300 }}
		>
			<h2 className="text-5xl text-white font-bold mb-10">Why Choose Finanza?</h2>
			<div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto px-6">
				{features.map((f, i) => (
					<div key={i} className="bg-white rounded-2xl shadow-md p-8 hover:shadow-xl transition">
						<div className="text-5xl mb-4">{f.icon}</div>
						<h3 className="text-2xl font-semibold mb-3">{f.title}</h3>
						<p className="text-gray-600 text-md">{f.desc}</p>
					</div>
				))}
			</div>
		</section>
	);
}
