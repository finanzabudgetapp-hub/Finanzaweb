// src/components/Clients.jsx
import React from "react";

const clients = ["visa", "mastercard", "stripe", "paypal", "wise", "revolut"];

export default function Clients() {
  return (
    <section className="py-16 bg-white text-center">
      <h3 className="text-3xl font-semibold mb-10">Trusted by Financial Experts</h3>
      <div className="flex flex-wrap justify-center gap-8 opacity-80">
        {clients.map((c) => (
          <img
            key={c}
            src={`/assets/${c}.png`}
            alt={c}
            className="h-10 grayscale hover:grayscale-0 transition"
          />
        ))}
      </div>
    </section>
  );
}
