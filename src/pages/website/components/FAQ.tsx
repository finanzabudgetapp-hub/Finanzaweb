import { useState } from "react";
import { motion } from "framer-motion";

const faqs = [
	{
		q: "What is Finanza?",
		a: "Finanza is a personal finance and budgeting app that helps you track expenses, manage budgets, set financial goals, and understand your spending habits—all in one simple, secure place.",
	},
	{
		q: "Is my financial data safe?",
		a: "Absolutely. Finanza uses advanced encryption and secure cloud storage to ensure your data remains private and protected. Your information is never shared with third parties without your consent.",
	},
	{
		q: "Can I sync my data across devices?",
		a: "Yes. Once you sign in, your data automatically syncs across all your devices, ensuring you always have access to your latest financial information.",
	},

	{
		q: "Can I sync multiple bank accounts?",
		a: "Absolutely — Finanza connects securely with major banks worldwide.",
	},
	{
		q: "Does Finanza support multiple currencies?",
		a: "Yes, Finanza supports multiple currencies and lets you easily switch or view conversions in real time—perfect for users who manage international finances or travel frequently.",
	},
	{
		q: "Can I use Finanza offline?",
		a: "You can record expenses and update budgets offline. Once you reconnect to the internet, your data will automatically sync to the cloud.",
	},
	{
		q: "Is Finanza free to use?",
		a: "Finanza offers a free plan with all essential budgeting features. Premium users can unlock advanced analytics, goal tracking, and priority support for a small monthly fee.",
	},
	{
		q: "Can I customize my categories and budgets?",
		a: "Yes! You can fully customize spending categories, rename them, or create new ones to match your lifestyle and financial habits.",
	},
	{
		q: "How can I contact support?",
		a: "You can reach our support team directly in the app under Settings → Help & Support, or email us at support@finanzatechnologies.com. We typically respond within 24 hours.",
	},
	{
		q: "Does Finanza work in my country?",
		a: "Finanza is available globally and supports most currencies. Some features (like bank integration) may vary by region, but budgeting and expense tracking work anywhere.",
	},
];

export default function FAQ() {
	// ✅ Explicitly define state type: number | null
	const [open, setOpen] = useState<number | null>(null);

	return (
		<section
			id="learn-more"
			className="py-15 md:py-24 px-auto md:px-30 flex flex-wrap-reverse md:no-wrap bg-white text-center gap-20"
		>
			<div className="container mx-auto">
				<h2 className="text-4xl font-bold mb-12">Frequently Asked Questions</h2>
				<div className="max-w-3xl mx-auto text-left">
					{faqs.map((f, i) => (
						<div key={i} className="mb-4 border rounded-lg">
							<button
								onClick={() => setOpen(open === i ? null : i)}
								className="w-full px-6 py-4 text-lg font-medium flex justify-between items-center"
							>
								<p className="text-left">{f.q}</p>
								<span className="text-xl  font-bold">{open === i ? "−" : "+"}</span>
							</button>

							{open === i && <p className="px-6 pb-4 text-gray-600">{f.a}</p>}
						</div>
					))}
				</div>
			</div>
			<div className="container flex  justify-right align-right md:ml-20">
				<motion.img
					src="/assets/images/3.png"
					alt="Savings Overview"
					className="w-120 h-full"
					whileHover={{ scale: 1.05 }}
				/>
			</div>
		</section>
	);
}
