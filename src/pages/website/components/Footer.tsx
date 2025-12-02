// src/components/Footer.jsx
import React from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";

export default function Footer() {
  const [open, setOpen] = React.useState(false);
  const [openTerm, setOpenTerm] = React.useState(false);
  const [contact, setContact] = React.useState(false);

  const handleOpen = () => setOpen(!open);
  const handleOpenTerm = () => setOpenTerm(!openTerm);
  const handleContact = () => setContact(!contact);

  return (
    <footer className="bg-[#7f3dff] px-4 md:px-10 text-white flex flex-wrap-reverse justify-center md:justify-between py-10 text-center">
      <p className="mb-3">© {new Date().getFullYear()} Finanza. All rights reserved.</p>

      <div className="flex justify-center gap-6">
        <button onClick={handleOpen} className="hover:underline">Privacy Policy</button>
        <button onClick={handleOpenTerm} className="hover:underline">Terms</button>
        <button onClick={handleContact} className="hover:underline">Contact</button>
      </div>

      {/* PRIVACY POLICY */}
      <Dialog open={open} handler={handleOpen}>
        <DialogHeader>Privacy Policy</DialogHeader>
        <DialogBody className="space-y-4 text-gray-800">
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
            You may request account/data deletion by contacting:
            <span className="text-blue-600 font-medium"> admin@finanzatechnologies.com</span>
          </p>

          <h3 className="font-semibold text-lg">6. Updates</h3>
          <p>
            This policy may be updated periodically.
          </p>

          <p>Last updated: {new Date().toLocaleDateString()}</p>
        </DialogBody>

        <DialogFooter>
          <Button variant="text" color="red" onClick={handleOpen}>Close</Button>
        </DialogFooter>
      </Dialog>

      {/* TERMS */}
      <Dialog open={openTerm} handler={handleOpenTerm}>
        <DialogHeader>Terms of Service</DialogHeader>
        <DialogBody className="space-y-4 text-gray-800">
          <h3 className="font-semibold text-lg">1. Introduction</h3>
          <p>
            By using Finanza, you agree to these Terms of Service.
          </p>

          <h3 className="font-semibold text-lg">2. Use of the App</h3>
          <p>
            Finanza provides tools for managing budgets and tracking expenses.
          </p>

          <h3 className="font-semibold text-lg">3. Accounts & Security</h3>
          <p>
            You are responsible for securing your account and login credentials.
          </p>

          <h3 className="font-semibold text-lg">4. Limitation of Liability</h3>
          <p>
            Finanza is not responsible for financial decisions you make in the app.
          </p>

          <h3 className="font-semibold text-lg">5. Changes to Terms</h3>
          <p>
            Updates take effect once published in the app.
          </p>

          <h3 className="font-semibold text-lg">6. Contact</h3>
          <p>
            For inquiries, email:
            <span className="text-blue-600 font-medium"> admin@finanzatechnologies.com</span>
          </p>
        </DialogBody>

        <DialogFooter>
          <Button variant="text" color="red" onClick={handleOpenTerm}>Close</Button>
        </DialogFooter>
      </Dialog>

      {/* CONTACT */}
      <Dialog open={contact} handler={handleContact}>
        <DialogHeader>Contact Us</DialogHeader>
        <DialogBody className="space-y-3 text-gray-800">
          <p><strong>Website:</strong> finanzatechnologies.com</p>
          <p><strong>Email:</strong> finanzabudgetapp@gmail.com</p>
          <p><strong>Phone:</strong> +1 278 899 2221</p>
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="red" onClick={handleContact}>Close</Button>
        </DialogFooter>
      </Dialog>
    </footer>
  );
}
