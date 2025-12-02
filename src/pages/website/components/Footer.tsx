// src/components/Footer.jsx
import React from "react";

export default function Footer() {
  const [open, setOpen] = React.useState(false);
  const [openTerm, setOpenTerm] = React.useState(false);
  const [contact, setContact] = React.useState(false);

  return (
    <>
      <footer className="bg-[#7f3dff] px-4 md:px-10 text-white flex flex-wrap-reverse justify-center md:justify-between py-10 text-center">
        <p className="mb-3">© {new Date().getFullYear()} Finanza. All rights reserved.</p>

        <div className="flex justify-center gap-6">
          <button onClick={() => setOpen(true)} className="hover:underline">Privacy Policy</button>
          <button onClick={() => setOpenTerm(true)} className="hover:underline">Terms</button>
          <button onClick={() => setContact(true)} className="hover:underline">Contact</button>
        </div>
      </footer>

      {/* ===== MODALS ===== */}
      {/* Helper Component */}
      {open && (
        <Modal onClose={() => setOpen(false)} title="Privacy Policy">
          <div className="space-y-4 text-gray-700">
            <h3 className="font-semibold text-lg">1. Information We Collect</h3>
            <p>
              Finanza collects your name, email (Google login), and expense records you enter.
              We do NOT collect banking or card details.
            </p>

            <h3 className="font-semibold text-lg">2. How We Use Information</h3>
            <p>
              We use your data to provide budgeting features and insights. Your data is never sold.
            </p>

            <h3 className="font-semibold text-lg">3. Data Storage & Security</h3>
            <p>
              All data is stored securely using Supabase with encryption.
            </p>

            <h3 className="font-semibold text-lg">4. Third-Party Services</h3>
            <p>
              Finanza uses Google Auth and Supabase, which follow their own privacy policies.
            </p>

            <h3 className="font-semibold text-lg">5. Your Rights</h3>
            <p>
              You may request account/data deletion by emailing:
              <span className="text-blue-600 font-medium"> admin@finanzatechnologies.com</span>
            </p>

            <h3 className="font-semibold text-lg">6. Updates</h3>
            <p>This policy may be updated periodically.</p>

            <p>Last updated: {new Date().toLocaleDateString()}</p>
          </div>
        </Modal>
      )}

      {openTerm && (
        <Modal onClose={() => setOpenTerm(false)} title="Terms of Service">
          <div className="space-y-4 text-gray-700">
            <h3 className="font-semibold text-lg">1. Introduction</h3>
            <p>By using Finanza, you agree to these Terms of Service.</p>

            <h3 className="font-semibold text-lg">2. Use of the App</h3>
            <p>Finanza provides tools for managing budgets and tracking expenses.</p>

            <h3 className="font-semibold text-lg">3. Accounts & Security</h3>
            <p>You are responsible for securing your login credentials.</p>

            <h3 className="font-semibold text-lg">4. Limitation of Liability</h3>
            <p>
              Finanza is not responsible for financial decisions you make using the app.
            </p>

            <h3 className="font-semibold text-lg">5. Changes to Terms</h3>
            <p>
              Updates take effect once published in the app.
            </p>

            <h3 className="font-semibold text-lg">6. Contact</h3>
            <p>
              Email:
              <span className="text-blue-600 font-medium"> admin@finanzatechnologies.com</span>
            </p>
          </div>
        </Modal>
      )}

      {contact && (
        <Modal onClose={() => setContact(false)} title="Contact Us">
          <div className="space-y-3 text-gray-700">
            <p><strong>Website:</strong> finanzatechnologies.com</p>
            <p><strong>Email:</strong> finanzabudgetapp@gmail.com</p>
            <p><strong>Phone:</strong> +1 278 899 2221</p>
          </div>
        </Modal>
      )}
    </>
  );
}


/* -------------------------------
    PURE TAILWINDCSS MODAL
-------------------------------- */
type ModalProps = {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
};

function Modal({ title, children, onClose }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="relative bg-white rounded-xl shadow-xl w-11/12 max-w-lg p-6 animate-fadeIn scale-95">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>

        <div>{children}</div>

        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
