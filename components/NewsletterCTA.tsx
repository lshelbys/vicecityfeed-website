"use client";

import { FormEvent, useState } from "react";
import { ctaPillClass } from "@/components/pills";

export function NewsletterCTA() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setStatus("error");
      return;
    }
    setStatus("done");
    setEmail("");
  }

  return (
    <section aria-labelledby="newsletter-heading" className="w-full max-w-md">
      <h2
        id="newsletter-heading"
        className="text-sm font-extrabold tracking-tight text-paper"
      >
        Newsletter
      </h2>
      <p className="mt-1 text-sm text-muted">
        Map notes, mission timers, and garage drops. Unsubscribe anytime.
      </p>
      <form
        onSubmit={onSubmit}
        className="mt-4 flex items-center rounded-full bg-raised p-1"
      >
        <label className="sr-only" htmlFor="newsletter-email">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email address"
          className="h-10 min-w-0 flex-1 rounded-full bg-transparent px-4 text-sm text-paper outline-none placeholder:text-muted focus-visible:outline-none"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className={ctaPillClass("gold", "h-10 px-4 disabled:opacity-60")}
        >
          {status === "loading" ? "Sending" : "Subscribe"}
        </button>
      </form>
      {status === "done" ? (
        <p className="mt-3 text-sm text-white" role="status">
          You&apos;re on the wire.
        </p>
      ) : null}
      {status === "error" ? (
        <p className="mt-3 text-sm text-muted" role="alert">
          Enter a valid email and try again.
        </p>
      ) : null}
    </section>
  );
}
