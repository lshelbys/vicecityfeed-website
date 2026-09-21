"use client";

import { FormEvent, useState } from "react";
import { Mail } from "lucide-react";

export function NewsletterCTA() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) throw new Error("Subscribe failed");
      setStatus("done");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section
      aria-labelledby="newsletter-heading"
      className="border border-line bg-night-elevated p-6 md:p-8"
    >
      <p className="text-[11px] uppercase tracking-[0.22em] text-magenta">
        Signal
      </p>
      <h2
        id="newsletter-heading"
        className="font-display mt-1 text-3xl text-paper md:text-4xl"
      >
        Subscribe for Vice City Intel
      </h2>
      <p className="mt-2 max-w-xl text-sm text-muted">
        Breaking map notes, mission timers, and garage drops. No list-buying.
        Unsubscribe whenever the heat dies down.
      </p>
      <form
        onSubmit={onSubmit}
        className="mt-5 flex flex-col gap-3 sm:flex-row"
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
          placeholder="you@vicecity.afterdark"
          className="h-11 flex-1 rounded-sm border border-line bg-night px-3 text-sm text-paper outline-none placeholder:text-muted focus:border-cyan"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-sm bg-cyan px-5 font-display text-lg tracking-[0.12em] text-night hover:bg-magenta hover:text-paper disabled:opacity-60"
        >
          <Mail className="size-4" aria-hidden />
          {status === "loading" ? "Sending" : "Subscribe"}
        </button>
      </form>
      {status === "done" ? (
        <p className="mt-3 text-sm text-cyan" role="status">
          You&apos;re on the wire. Check your inbox for Vice City intel.
        </p>
      ) : null}
      {status === "error" ? (
        <p className="mt-3 text-sm text-magenta" role="alert">
          Couldn&apos;t reach the desk. Try again in a minute.
        </p>
      ) : null}
    </section>
  );
}
