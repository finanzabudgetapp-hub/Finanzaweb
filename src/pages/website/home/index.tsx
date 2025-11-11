// src/App.jsx
import React from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import About from "../components/About";
import Features from "../components/Features";
import Clients from "../components/Clients";
import Testimonials from "../components/Testimonials";
import FAQ from "../components/FAQ";
import Download from "../components/Download";
import Footer from "../components/Footer";

export default function HomePage() {
	return (
		<div className="bg-white text-gray-900 font-poppins">
			<Header />
			<Hero />
			<About />
			<Features />
			<Testimonials />
			<FAQ />
			<Download />
			<Footer />
		</div>
	);
}
