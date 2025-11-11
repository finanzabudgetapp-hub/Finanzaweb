// src/components/Testimonials.jsx
import React from "react";

const testimonials = [
	{
		name: "Amara Johnson",
		text: "Finanza helped me save 30% of my income just by tracking small expenses. Highly recommended!",
	},
	{
		name: "David Smith",
		text: "The analytics dashboard is stunning. I finally feel in control of my budget.",
	},
];

export default function Testimonials() {
	return (
		<section id="testimonials" className="py-24 px-auto bg-white text-center">
			<h2 className="text-4xl font-bold mb-12">What Our Users Say</h2>
			<div className="flex flex-col md:flex-row justify-center gap-8 max-w-5xl mx-auto px-6">
				{testimonials.map((t, i) => (
					<div key={i} className="bg-white shadow-md rounded-2xl p-8 max-w-sm">
						<p className="text-gray-700 italic mb-4">“{t.text}”</p>
						<h4 className="font-semibold text-[#7f3dff]">{t.name}</h4>
					</div>
				))}
			</div>
		</section>
	);
}
