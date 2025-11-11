// src/components/FinanzaHeader.jsx
import React, { useState, useEffect } from "react";
import { LazyMotion, domAnimation, m } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router";

export default function Header() {
	const [open, setOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const navigatge = useNavigate();

	useEffect(() => {
		const handleScroll = () => setScrolled(window.scrollY > 50);
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<LazyMotion features={domAnimation}>
			<m.header
				className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
					scrolled ? "bg-white shadow-lg text-gray-900" : "bg-transparent text-white"
				}`}
				initial={{ y: -80 }}
				animate={{ y: 0 }}
			>
				<div className="container mx-auto flex justify-between items-center py-4 px-6 md:px-12">
					{/* Logo */}
					<div className="flex items-center gap-2">
						<div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#7f3dff] to-[#a78bfa]" />
						<h1 className="text-xl font-bold">Finanza</h1>
					</div>

					{/* Desktop Nav */}
					<nav className="hidden md:flex items-center gap-8">
						{["Home", "About", "Features", "Testimonials", "Contact"].map((link) => (
							<a
								key={link}
								style={{ color: "white" }}
								href={`#${link.toLowerCase()}`}
								className="hover:text-[#7f3dff] transition text-md font-medium"
							>
								{link}
							</a>
						))}
					</nav>

					{/* Buttons */}
					<div className="hidden md:flex gap-3 items-center">
						<button
							onClick={() => navigatge("/auth/login")}
							style={{ display: "none" }}
							className="px-5 py-2 rounded-full border border-[#7f3dff] text-[#7f3dff] hover:bg-[#7f3dff] hover:text-white transition"
						>
							Log In
						</button>
						<button className="px-5 py-2 text-md rounded-full bg-[#7f3dff] border border-[#fff] text-white hover:bg-[#6c2fff] transition">
							Download
						</button>
					</div>

					{/* Mobile Menu Toggle */}
					<button onClick={() => setOpen(!open)} className="md:hidden p-2 focus:outline-none">
						{open ? <X size={26} /> : <Menu size={26} />}
					</button>
				</div>

				{/* Mobile Dropdown */}
				{open && (
					<m.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						className={`md:hidden absolute top-full left-0 w-full ${
							scrolled ? "bg-white text-gray-900" : "bg-[#7f3dff] text-white"
						}`}
					>
						<div className="flex flex-col items-center text-md py-6 space-y-4">
							{["Home", "About", "Features", "Testimonials", "Contact"].map((link) => (
								<a
									key={link}
									href={`#${link.toLowerCase()}`}
									onClick={() => setOpen(false)}
									className="hover:text-yellow-300 transition"
								>
									{link}
								</a>
							))}
							<div className="flex gap-4 pt-4">
								<button
									onClick={() => navigatge("/auth/login")}
									style={{ display: "none" }}
									className="px-5 py-2 rounded-full border border-[#7f3dff] text-[#7f3dff] hover:bg-[#7f3dff] hover:text-white transition"
								>
									Log In
								</button>
								<button className="px-5 py-2 text-md rounded-full bg-[#7f3dff] text-white hover:bg-[#6c2fff] transition">
									Download
								</button>
							</div>
						</div>
					</m.div>
				)}
			</m.header>
		</LazyMotion>
	);
}
