import React from "react";
import { m } from "framer-motion";

export default function Hero() {
  return (
    <section className="bg-gradient-to-b from-[#7f3dff] to-[#a78bfa] text-white py-24 relative overflow-hidden">
      <div className="container mx-auto px-6 text-center">
        <m.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold mb-6"
        >
          Manage Your Finances with <span className="text-yellow-300">Finanza</span>
        </m.h1>
        <m.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-lg max-w-xl mx-auto mb-10"
        >
          Track expenses, monitor savings, and achieve your financial goals — all in one smart app designed to make your money work for you.
        </m.p>

        <div className="flex justify-center gap-4">
          <m.button
            whileHover={{ scale: 1.05 }}
            className="bg-white text-[#7f3dff] px-6 py-3 rounded-full font-semibold shadow-md hover:bg-gray-100 transition"
          >
            Download App
          </m.button>
          <m.button
            whileHover={{ scale: 1.05 }}
            className="border-2 border-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-[#7f3dff] transition"
          >
            Learn More
          </m.button>
        </div>

        <div className="mt-16 flex justify-center gap-4">
          <m.img
            src="/assets/mobile1.png"
            alt="Finanza Dashboard"
            className="w-56 rounded-xl shadow-lg"
            whileHover={{ scale: 1.05 }}
          />
          <m.img
            src="/assets/mobile2.png"
            alt="Expense Analytics"
            className="w-56 rounded-xl shadow-lg hidden md:block"
            whileHover={{ scale: 1.05 }}
          />
          <m.img
            src="/assets/mobile3.png"
            alt="Savings Overview"
            className="w-56 rounded-xl shadow-lg hidden md:block"
            whileHover={{ scale: 1.05 }}
          />
        </div>
      </div>
    </section>
  );
}
