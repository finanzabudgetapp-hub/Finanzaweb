// src/components/Download.jsx
import React from "react";

export default function Download() {
	return (
		<section className="pt-24 px-10 bg-[#7f3dff] text-center">
			<h2 className="text-4xl text-white font-bold mb-6">Get Finanza Today</h2>
			<p className="text-[#f9f9f9] max-w-lg mx-auto mb-8">
				Start managing your money smarter. Download the Finanza app on iOS or Android and take control of your financial
				future.
			</p>
			<div className="flex justify-center gap-4" style={{ marginTop: -50 }}>
				<img src="/assets/images/app.png" alt="App Store" className="w-50 cursor-pointer" />
				<img src="/assets/images/google.png" alt="Google Play" className="w-50 cursor-pointer" />
			</div>
		</section>
	);
}
