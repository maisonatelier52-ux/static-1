"use client";

import { useState } from "react";
import { X } from "lucide-react";

/**
 * SubscribeBanner — homepage section.
 *
 * Bordered box (bold black bottom rule) with the outlined "UrbanObserver"
 * wordmark + a short red underline + description on the left, a vertical
 * divider, and a red "Subscribe Now" button on the right.
 *
 * Clicking the button opens a modal asking for an email address. Wire the
 * `handleSubmit` function up to your actual subscribe endpoint / email
 * service (Mailchimp, ConvertKit, a Next.js API route, etc.) — right now it
 * just closes the modal and logs the email to the console.
 */

function SubscribeModal({ onClose }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: send `email` to your subscribe endpoint / email service here.
    console.log("Subscribed:", email);
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4" onClick={onClose}>
      <div className="relative w-full max-w-md bg-white p-8" onClick={(e) => e.stopPropagation()}>
        <button aria-label="Close" onClick={onClose} className="absolute right-4 top-4 text-black transition hover:text-[#E2432E]">
          <X size={22} />
        </button>

        {submitted ? (
          <div className="py-6 text-center">
            <h3 className="font-display text-2xl font-bold uppercase">You&apos;re In!</h3>
            <p className="mt-3 text-sm text-gray-700">Thanks for subscribing — check your inbox to confirm your email.</p>
          </div>
        ) : (
          <>
            <h3 className="font-display text-2xl font-bold uppercase">Subscribe</h3>
            <p className="mt-2 text-sm text-gray-700">Enter your email and get instant, unlimited access to every story in our library.</p>

            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full border border-black px-4 py-3 text-sm outline-none placeholder:text-gray-500"
              />
              <button type="submit" className="w-full bg-[#E2432E] py-3 font-display text-sm font-bold uppercase tracking-wide text-white transition hover:bg-[#c53523]">
                Subscribe Now
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default function SubscribeBanner() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="flex flex-col items-start justify-between gap-8 border border-black border-b-4 px-6 py-8 sm:px-10 sm:py-10 md:flex-row md:items-center">
        <div>
          <h2 className="masthead-title font-display text-4xl font-bold uppercase tracking-wide text-white sm:text-5xl">
            UrbanObserver
          </h2>
          <div className="mt-3 h-1 w-24 bg-[#E2432E]" />
          <p className="mt-4 max-w-xl text-base leading-relaxed text-gray-800">Each story in our ever growing 
          library can be accessed through our membership program. Subscribe and receive instantaneous and unlimited access!</p>
        </div>

        <div className="hidden self-stretch border-l border-black md:block" />

        <button onClick={() => setModalOpen(true)} className="shrink-0 bg-[#E2432E] px-8 py-4 font-display text-sm font-bold uppercase tracking-wide text-white transition hover:bg-[#c53523]">
          Subscribe Now
        </button>
      </div>

      {modalOpen && <SubscribeModal onClose={() => setModalOpen(false)} />}

      <style jsx>{`
        .masthead-title {
          -webkit-text-stroke: 1.5px black;
        }
      `}</style>
    </section>
  );
}