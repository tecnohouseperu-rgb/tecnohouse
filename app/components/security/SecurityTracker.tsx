"use client";

import { useEffect } from "react";
import { generateFingerprint } from "@/lib/security/fingerprint";

async function getOrCreateToken() {
  const name = "th_device_token";

  const existing = document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="))
    ?.split("=")[1];

  if (existing) return existing;

  const newToken = crypto.randomUUID();
  document.cookie = `${name}=${newToken}; path=/; max-age=31536000; samesite=lax`;

  return newToken;
}

async function sha256(value: string) {
  const enc = new TextEncoder().encode(value);
  const hashBuffer = await crypto.subtle.digest("SHA-256", enc);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export default function SecurityTracker() {
  useEffect(() => {
    const run = async () => {
      try {
        const fingerprint = await generateFingerprint();
        const token = await getOrCreateToken();
        const tokenHash = await sha256(token);

        await fetch("/api/security/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fingerprint_hash: fingerprint,
            ban_token_hash: tokenHash,
            path: window.location.pathname,
          }),
        });
      } catch (error) {
        console.error("SecurityTracker error:", error);
      }
    };

    run();
  }, []);

  return null;
}