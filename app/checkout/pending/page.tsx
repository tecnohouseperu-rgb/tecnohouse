"use client";
import Lottie from "lottie-react";
import pendingAnimation from "@/public/lottie/pending.json";
import Link from "next/link";

export default function PendingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <div className="w-72">
        <Lottie animationData={pendingAnimation} loop />
      </div>

      <h1 className="text-3xl font-bold mt-4">Pago en revisión ⏳</h1>
      <p className="text-gray-600 mt-2 max-w-md">
        Tu pago está en proceso de verificación por Mercado Pago. Esto puede tomar unos minutos.
      </p>

      <Link
        href="/"
        className="mt-6 bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition"
      >
        Volver a la tienda
      </Link>
    </div>
  );
}
