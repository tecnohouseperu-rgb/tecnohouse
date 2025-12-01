"use client";
import Lottie from "lottie-react";
import errorAnimation from "@/public/lottie/error.json";
import Link from "next/link";

export default function FailurePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <div className="w-72">
        <Lottie animationData={errorAnimation} loop />
      </div>

      <h1 className="text-3xl font-bold mt-4">Pago fallido ❌</h1>
      <p className="text-gray-600 mt-2 max-w-md">
        El pago no pudo procesarse. Intenta nuevamente o usa otro método de pago.
      </p>

      <Link
        href="/checkout"
        className="mt-6 bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition"
      >
        Reintentar pago
      </Link>
    </div>
  );
}
