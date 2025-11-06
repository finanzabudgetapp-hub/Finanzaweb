// src/components/Download.jsx
import React from "react";

export default function Download() {
  return (
    <section className="py-24 bg-gray-50 text-center">
      <h2 className="text-4xl font-bold mb-6">Get Finanza Today</h2>
      <p className="text-gray-600 max-w-lg mx-auto mb-8">
        Start managing your money smarter. Download the Finanza app on iOS or Android and take control of your financial future.
      </p>
      <div className="flex justify-center gap-4">
        <img src="/assets/appstore.png" alt="App Store" className="h-12 cursor-pointer" />
        <img src="/assets/playstore.png" alt="Google Play" className="h-12 cursor-pointer" />
      </div>
    </section>
  );
}
