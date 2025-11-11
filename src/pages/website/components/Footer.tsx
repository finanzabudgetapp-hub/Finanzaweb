// src/components/Footer.jsx
import React from "react";

export default function Footer() {
	return (
		<footer className="bg-[#7f3dff] px-15 md:px-30 text-white flex flex-wrap-reverse justify-center md:justify-between py-10 text-center">
			<p className="mb-2">© {new Date().getFullYear()} Finanza. All rights reserved.</p>
			<div className="flex justify-center gap-6">
				<a href="#" className="hover:underline" style={{ color: "white" }}>
					Privacy Policy
				</a>
				<a href="#" className="hover:underline" style={{ color: "white" }}>
					Terms
				</a>
				<a href="#" className="hover:underline" style={{ color: "white" }}>
					Contact
				</a>
			</div>
		</footer>
	);
}
