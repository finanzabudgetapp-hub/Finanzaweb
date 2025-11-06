import { useState } from "react";

const faqs = [
  {
    q: "Is Finanza free to use?",
    a: "Yes! You can use Finanza’s basic features for free, with optional premium tools.",
  },
  {
    q: "Can I sync multiple bank accounts?",
    a: "Absolutely — Finanza connects securely with major banks worldwide.",
  },
  {
    q: "Is my data safe?",
    a: "Your data is fully encrypted and never shared without your permission.",
  },
];

export default function FAQ() {
  // ✅ Explicitly define state type: number | null
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-24 bg-white text-center">
      <h2 className="text-4xl font-bold mb-12">Frequently Asked Questions</h2>
      <div className="max-w-3xl mx-auto text-left">
        {faqs.map((f, i) => (
          <div key={i} className="mb-4 border rounded-lg">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full px-6 py-4 text-lg font-medium flex justify-between items-center"
            >
              {f.q}
              <span className="text-xl font-bold">{open === i ? "−" : "+"}</span>
            </button>

            {open === i && (
              <p className="px-6 pb-4 text-gray-600">{f.a}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
