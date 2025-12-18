"use client";

import { useCart } from "../components/cart-provider";
import { useEffect, useMemo, useRef, useState } from "react";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import Image from "next/image";

// ====== Tipos / helpers ======
type UbigeoTree = Array<{
  departamento: string;
  provincias: Array<{ provincia: string; distritos: string[] }>;
}>;

const isLimaCallao = (dep: string) => {
  const d = (dep || "").trim().toUpperCase();
  return d === "LIMA" || d === "CALLAO";
};

type DocType = "DNI" | "CE" | "PAS";
type ReceiptType = "boleta" | "factura";
type ShippingMode = "regular" | "express";

const shippingCarrier = (dep: string) =>
  isLimaCallao(dep) ? "Urbano Express" : "Shalom";

// Costo base según zona y modo
const shippingBase = (dep: string, mode: ShippingMode) => {
  if (!dep) return 0;
  if (isLimaCallao(dep)) {
    // Lima / Callao
    return mode === "express" ? 20 : 12;
  }
  // Provincia: solo regular
  return 16;
};

// ====== Botón/Wallet de Mercado Pago ======
function MercadoPagoPay({
  items,
  orderId,
  externalRef,
  payerEmail,
  buyer,
  shipping,
  onPrefError,
}: {
  items: { title: string; quantity: number; unit_price: number }[];
  orderId: string;
  externalRef?: string;
  payerEmail?: string;
  buyer: {
    firstName: string;
    docType: DocType;
    docNumber: string;
    phone: string;
  };
  shipping: {
    cost: number;
    carrier: string;
    mode: ShippingMode;
    departamento: string;
    provincia: string;
    distrito: string;
    direccion: string;
    referencia?: string;
  };
  onPrefError?: (msg: string) => void;
}) {
  const [prefId, setPrefId] = useState<string | null>(null);
  const initedRef = useRef(false);
  const lastOrderRef = useRef<string | null>(null);
  const creatingRef = useRef(false);

  // Init SDK (una sola vez)
  useEffect(() => {
    if (initedRef.current) return;
    const pubKey = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY;
    if (!pubKey) {
      onPrefError?.("Falta configuración: NEXT_PUBLIC_MP_PUBLIC_KEY.");
      return;
    }
    initMercadoPago(pubKey, { locale: "es-PE" });
    initedRef.current = true;
  }, [onPrefError]);

  // Crear preferencia POR orden (evita duplicados)
  useEffect(() => {
    const createPref = async () => {
      if (!orderId || creatingRef.current) return;
      if (lastOrderRef.current === orderId && prefId) return; // ya creada
      try {
        creatingRef.current = true;
        const res = await fetch("/api/mercadopago/preference", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items,
            external_reference: externalRef || orderId,
            email: payerEmail,
            buyer,
            shipping,
          }),
        });
        const data = await res.json();
        if (!res.ok || !data?.id) {
          throw new Error(data?.message || "No se pudo crear la preferencia.");
        }
        setPrefId(data.id);
        lastOrderRef.current = orderId;
      } catch (e: any) {
        onPrefError?.(e?.message || "Error creando preferencia.");
      } finally {
        creatingRef.current = false;
      }
    };
    createPref();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]); // solo cuando hay nueva orden

  if (!orderId) return null;

  return (
    <div className="mt-2">
      {!prefId ? (
        <button
          disabled
          className="w-full rounded-xl bg-gray-400 text-white py-3 cursor-wait"
        >
          Preparando pago seguro…
        </button>
      ) : (
        <div className="wallet-container rounded-2xl ring-1 ring-black/5 bg-white p-4">
          <div className="flex items-center gap-2 mb-2">
            <img
              src="/logos/mercadopago.svg"
              alt="Mercado Pago"
              className="h-6 w-auto"
            />
            <p className="text-sm text-gray-700">
              Paga de forma segura con <strong>Mercado Pago</strong>.
            </p>
          </div>
          <Wallet initialization={{ preferenceId: prefId }} />
        </div>
      )}
    </div>
  );
}

export default function Checkout() {
  const { items } = useCart();

  // calculamos el subtotal en base a los items del carrito
  const subtotal = useMemo(
    () =>
      items.reduce((acc, it) => {
        const price = it.price ?? 0; // si viene null, usamos 0
        return acc + price * it.qty;
      }, 0),
    [items]
  );

  // ===== Comprobante (Boleta / Factura)
  const [receiptType, setReceiptType] = useState<ReceiptType>("boleta");

  // ===== datos cliente
  const [nombres, setNombres] = useState("");
  const [docType, setDocType] = useState<DocType>("DNI");
  const [docNumber, setDocNumber] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");

  // ===== dirección / ubigeo
  const [ubigeoTree, setUbigeoTree] = useState<UbigeoTree>([]);
  const [cargandoUbi, setCargandoUbi] = useState(true);
  const [errorUbi, setErrorUbi] = useState<string | null>(null);
  const [departamento, setDepartamento] = useState("");
  const [provincia, setProvincia] = useState("");
  const [distrito, setDistrito] = useState("");
  const [direccion, setDireccion] = useState("");
  const [referencia, setReferencia] = useState("");

  // ===== datos extra si FACTURA
  const [ruc, setRuc] = useState("");
  const [razonSocial, setRazonSocial] = useState("");
  const [direccionFiscal, setDireccionFiscal] = useState("");

  // ===== T&C
  const [agree, setAgree] = useState(false);

  // ===== Cupón modal & estado
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponMsg, setCouponMsg] = useState<string | null>(null);
  const [showCoupon, setShowCoupon] = useState(false);
  const [discount, setDiscount] = useState(0); // 💸 descuento calculado

  // ===== Método de envío
  const [shippingMode, setShippingMode] = useState<ShippingMode>("regular");

  // ===== derivados (ubigeo)
  const provincias =
    ubigeoTree.find((d) => d.departamento === departamento)?.provincias || [];
  const distritos =
    provincias.find((p) => p.provincia === provincia)?.distritos || [];

  // Envío base según departamento + modo (regular / express)
  const envioBase = useMemo(
    () => shippingBase(departamento, shippingMode),
    [departamento, shippingMode]
  );

  // Si cambio a provincia y estaba express, regreso a regular
  useEffect(() => {
    if (
      departamento &&
      !isLimaCallao(departamento) &&
      shippingMode === "express"
    ) {
      setShippingMode("regular");
    }
  }, [departamento, shippingMode]);

  // Costo de envío (gratis desde S/ 200 solo regular)
  const envio = useMemo(() => {
    if (!departamento) return 0;
    if (shippingMode === "regular" && subtotal >= 200) return 0;
    return envioBase;
  }, [departamento, shippingMode, subtotal, envioBase]);

  const carrier = shippingCarrier(departamento);

  // ===== UI state
  const [msg, setMsg] = useState<string | null>(null);
  const [msgType, setMsgType] = useState<"ok" | "err" | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // 👉 orderId para referencia de pago
  const orderIdRef = useRef<string | null>(null);
  const [readyToPay, setReadyToPay] = useState(false);

  // ===== cargar ubigeo
  useEffect(() => {
    (async () => {
      setCargandoUbi(true);
      setErrorUbi(null);
      try {
        const res = await fetch("/api/ubigeo");
        const json = await res.json();
        if (!json.ok) throw new Error(json.error || "No se pudo cargar ubigeo");
        setUbigeoTree(json.data as UbigeoTree);
      } catch (e: any) {
        setErrorUbi(e?.message || "Error cargando ubigeo");
        setUbigeoTree([]);
      } finally {
        setCargandoUbi(false);
      }
    })();
  }, []);

  // ===== persistencia local del form
  useEffect(() => {
    try {
      const raw = localStorage.getItem("checkout-form");
      if (!raw) return;
      const saved = JSON.parse(raw);
      setReceiptType(saved.receiptType ?? "boleta");
      setNombres(saved.nombres ?? "");
      setDocType(saved.docType ?? "DNI");
      setDocNumber(saved.docNumber ?? "");
      setTelefono(saved.telefono ?? "");
      setEmail(saved.email ?? "");
      setDepartamento(saved.departamento ?? "");
      setProvincia(saved.provincia ?? "");
      setDistrito(saved.distrito ?? "");
      setDireccion(saved.direccion ?? "");
      setReferencia(saved.referencia ?? "");
      setRuc(saved.ruc ?? "");
      setRazonSocial(saved.razonSocial ?? "");
      setDireccionFiscal(saved.direccionFiscal ?? "");
      setAgree(saved.agree ?? false);
      const savedCode = saved.appliedCoupon ?? null;
      setAppliedCoupon(savedCode === "PAGO1" ? null : savedCode);
      if (saved.shippingMode === "express" || saved.shippingMode === "regular") {
        setShippingMode(saved.shippingMode);
      }
      setDiscount(saved.discount ?? 0);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    const payload = {
      receiptType,
      nombres,
      docType,
      docNumber,
      telefono,
      email,
      departamento,
      provincia,
      distrito,
      direccion,
      referencia,
      ruc,
      razonSocial,
      direccionFiscal,
      agree,
      appliedCoupon,
      shippingMode,
      discount,
    };
    try {
      localStorage.setItem("checkout-form", JSON.stringify(payload));
    } catch {
      // ignore
    }
  }, [
    receiptType,
    nombres,
    docType,
    docNumber,
    telefono,
    email,
    departamento,
    provincia,
    distrito,
    direccion,
    referencia,
    ruc,
    razonSocial,
    direccionFiscal,
    agree,
    appliedCoupon,
    shippingMode,
    discount,
  ]);

  // ===== validaciones
  const validarDocumento = () => {
    const n = docNumber.trim();
    if (docType === "DNI") return /^\d{8}$/.test(n);
    if (docType === "CE") return /^[A-Za-z0-9]{8,12}$/.test(n);
    return /^[A-Za-z0-9]{6,12}$/.test(n);
  };
  const validarTelefono = () => /^\d{9}$/.test(telefono.trim());
  const validarEmail = () =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const validarRUC = () => /^\d{11}$/.test(ruc.trim());

  const faltantes = () => {
    const f: string[] = [];
    if (nombres.trim().length < 3) f.push("Nombres");
    if (!validarDocumento())
      f.push(
        docType === "DNI"
          ? "DNI"
          : docType === "CE"
          ? "Cédula de extranjería"
          : "Pasaporte"
      );
    if (!validarTelefono()) f.push("Teléfono");
    if (!validarEmail()) f.push("Correo");
    if (!departamento) f.push("Departamento");
    if (!provincia) f.push("Provincia");
    if (!distrito) f.push("Distrito");
    if (direccion.trim().length < 4) f.push("Dirección");
    if (receiptType === "factura") {
      if (!validarRUC()) f.push("RUC (11 dígitos)");
      if (razonSocial.trim().length < 3) f.push("Razón social");
    }
    if (!agree) f.push("Aceptar Términos y Condiciones");
    return f;
  };

  const handleDoc = (v: string) => {
    if (docType === "DNI") setDocNumber(v.replace(/\D/g, "").slice(0, 8));
    else if (docType === "CE")
      setDocNumber(v.replace(/[^a-zA-Z0-9]/g, "").slice(0, 12));
    else setDocNumber(v.replace(/[^a-zA-Z0-9]/g, "").slice(0, 12));
  };
  const handleTel = (v: string) =>
    setTelefono(v.replace(/\D/g, "").slice(0, 9));

  // ===== submit: crea la ORDEN; luego se habilita Wallet
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setMsg(null);
    setMsgType(null);

    const f = faltantes();
    if (f.length) {
      setMsg("Faltan: " + f.join(", "));
      setMsgType("err");
      return;
    }

    const grandTotal = Math.max(0, subtotal - discount + envio);

    try {
      setLoading(true);
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiptType,
          nombres,
          docType,
          docNumber,
          ruc: receiptType === "factura" ? ruc : undefined,
          razonSocial: receiptType === "factura" ? razonSocial : undefined,
          direccionFiscal:
            receiptType === "factura" ? direccionFiscal : undefined,
          telefono,
          email,
          departamento,
          provincia,
          distrito,
          direccion,
          referencia,
          subtotal,
          envio,
          discount,
          total: grandTotal,
          coupon_code: appliedCoupon,
          appliedCoupon,
          carrier,
          shippingMode,
          gateway: "mercadopago",
          cart: items.map((it) => ({
            slug: (it as any).slug,
            qty: it.qty,
            price: it.price,
            size: (it as any).size || null,
          })),
        }),
      });

      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Error creando la orden");

      // Guardamos ID de la orden
      orderIdRef.current = String(data.orderId);
      try {
        localStorage.setItem("last-order-id", String(data.orderId));
      } catch {
        // ignore
      }

      // 🧾 Guardamos RESUMEN COMPLETO para la página de éxito (sin fotos)
      try {
        const orderSummary = {
          orderId: String(data.orderId),
          subtotal,
          envio,
          discount,
          total: grandTotal,
          coupon_code: appliedCoupon,
          nombres,
          telefono,
          email,
          direccion,
          referencia,
          departamento,
          provincia,
          distrito,
          shippingMode,
          carrier,
          items: items.map((it: any) => ({
            id: it.id ?? it.slug ?? "",
            name: it.name ?? it.slug ?? "Producto",
            qty: it.qty,
            price: it.price,
            size: it.size ?? null,
            color: it.color ?? null,
          })),
        };

        localStorage.setItem(
          "last-order-summary",
          JSON.stringify(orderSummary)
        );
      } catch {
        // si falla el localStorage no rompemos el flujo
      }

      setMsg(
        `✅ Pedido creado (ID: ${data.orderId}). Ahora completa el pago con Mercado Pago.`
      );
      setMsgType("ok");
      setReadyToPay(true);
    } catch (err: any) {
      setMsg(err?.message || "Error en checkout");
      setMsgType("err");
    } finally {
      setLoading(false);
    }
  };

  // ===== useMemo para items de Mercado Pago (HOOK, va ANTES del early return)
  const mpItems = useMemo(() => {
    return items.map((i) => ({
      title: (i as any).name || (i as any).slug || "Producto",
      quantity: i.qty,
      unit_price: i.price ?? 0, // aseguramos number
    }));
  }, [items]);

  // Render vacío si no hay items (sin hooks debajo)
  if (items.length === 0) {
    return (
      <section className="space-y-2 px-4 lg:px-10 py-6">
        <h2 className="text-2xl font-bold">Checkout</h2>
        <p>No tienes productos en el carrito.</p>
      </section>
    );
  }

  // ===== helpers cupón dentro del modal =====
  const applyCoupon = async () => {
    const code = coupon.trim().toUpperCase();
    setCouponMsg(null);

    if (!code) {
      setCouponMsg("Ingresa un código.");
      return;
    }

    try {
      const res = await fetch("/api/validate-coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          subtotal,
        }),
      });

      const data = await res.json();

      if (!data.ok) {
        setAppliedCoupon(null);
        setDiscount(0);
        setCouponMsg(data.message || "Cupón inválido o expirado.");
        return;
      }

      setAppliedCoupon(data.coupon);
      setDiscount(data.discount);
      setCoupon(code);
      setCouponMsg(
        `Cupón ${data.coupon} aplicado (-S/ ${data.discount.toFixed(2)})`
      );
      setShowCoupon(false);
    } catch (err) {
      console.error("Error validando cupón:", err);
      setCouponMsg("Error validando cupón. Inténtalo nuevamente.");
    }
  };

  const removeCoupon = () => {
    setCoupon("");
    setCouponMsg(null);
    setAppliedCoupon(null);
    setDiscount(0);
  };

  const shippingAreaLabel = departamento
    ? `${isLimaCallao(departamento) ? "Lima/Callao" : "Provincia"} — ${
        carrier || "Carrier"
      } · ${shippingMode === "express" ? "Express" : "Regular"}`
    : "";

  const grandTotal = Math.max(0, subtotal - discount + envio);

  const canChooseShipping = Boolean(departamento);

  return (
    <main className="px-4 lg:px-10 py-6 bg-neutral-50 min-h-[60vh]">
      <section className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {/* ===== Formulario ===== */}
        <form
          id="checkout-form"
          onSubmit={onSubmit}
          className="card space-y-3 bg-white rounded-2xl p-4 shadow-sm"
        >
          <h2 className="text-xl font-bold">Datos de envío</h2>

          {/* Nombres */}
          <label className="block">
            <span className="text-sm text-gray-600">Nombres*</span>
            <input
              className="mt-1 w-full border rounded-xl px-3 py-2"
              placeholder="Nombres y apellidos"
              value={nombres}
              onChange={(e) => setNombres(e.target.value)}
              autoComplete="name"
            />
          </label>

          {/* Documento */}
          <div className="grid grid-cols-3 gap-2">
            <label className="col-span-1">
              <span className="text-sm text-gray-600">Tipo*</span>
              <select
                className="mt-1 border rounded-xl px-3 py-2 w-full"
                value={docType}
                onChange={(e) => {
                  const t = e.target.value as DocType;
                  setDocType(t);
                  setDocNumber("");
                }}
              >
                <option value="DNI">DNI</option>
                <option value="CE">Cédula de extranjería</option>
                <option value="PAS">Pasaporte</option>
              </select>
            </label>
            <label className="col-span-2">
              <span className="text-sm text-gray-600">
                {docType === "DNI"
                  ? "Número de DNI*"
                  : docType === "CE"
                  ? "N° Cédula*"
                  : "N° Pasaporte*"}
              </span>
              <input
                className={`mt-1 border rounded-xl px-3 py-2 w-full ${
                  docNumber && !validarDocumento() ? "border-red-400" : ""
                }`}
                value={docNumber}
                onChange={(e) => handleDoc(e.target.value)}
                inputMode={docType === "DNI" ? "numeric" : "text"}
                maxLength={docType === "DNI" ? 8 : 12}
                autoComplete="off"
              />
              {docNumber && !validarDocumento() && (
                <small className="text-red-600">
                  {docType === "DNI"
                    ? "Debe tener 8 dígitos."
                    : "Usa 8–12 caracteres alfanuméricos."}
                </small>
              )}
            </label>
          </div>

          {/* Teléfono */}
          <label className="block">
            <span className="text-sm text-gray-600">Teléfono*</span>
            <input
              className={`mt-1 w-full border rounded-xl px-3 py-2 ${
                telefono && !validarTelefono() ? "border-red-400" : ""
              }`}
              placeholder="9 dígitos"
              value={telefono}
              onChange={(e) => handleTel(e.target.value)}
              type="tel"
              inputMode="numeric"
              maxLength={9}
              autoComplete="tel"
            />
            {telefono && !validarTelefono() && (
              <small className="text-red-600">
                Número inválido (9 dígitos).
              </small>
            )}
          </label>

          {/* Correo */}
          <label className="block">
            <span className="text-sm text-gray-600">Correo*</span>
            <input
              className={`mt-1 w-full border rounded-xl px-3 py-2 ${
                email && !validarEmail() ? "border-red-400" : ""
              }`}
              placeholder="tucorreo@dominio.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              autoComplete="email"
            />
            {email && !validarEmail() && (
              <small className="text-red-600">Correo inválido.</small>
            )}
          </label>

          {/* Ubigeo */}
          <label className="block">
            <span className="text-sm text-gray-600">Departamento*</span>
            <select
              className="mt-1 w-full border rounded-xl px-3 py-2"
              disabled={cargandoUbi || !!errorUbi}
              value={departamento}
              onChange={(e) => {
                setDepartamento(e.target.value);
                setProvincia("");
                setDistrito("");
              }}
            >
              <option value="">
                {errorUbi
                  ? `Error: ${errorUbi}`
                  : cargandoUbi
                  ? "Cargando departamentos..."
                  : "Selecciona Departamento"}
              </option>
              {!cargandoUbi &&
                !errorUbi &&
                ubigeoTree.map((d) => (
                  <option key={d.departamento} value={d.departamento}>
                    {d.departamento}
                  </option>
                ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm text-gray-600">Provincia*</span>
            <select
              className="mt-1 w-full border rounded-xl px-3 py-2"
              value={provincia}
              disabled={!departamento}
              onChange={(e) => {
                setProvincia(e.target.value);
                setDistrito("");
              }}
            >
              <option value="">
                {departamento ? "Selecciona Provincia" : "Elige un departamento"}
              </option>
              {provincias.map((p) => (
                <option key={p.provincia} value={p.provincia}>
                  {p.provincia}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm text-gray-600">Distrito*</span>
            <select
              className="mt-1 w-full border rounded-xl px-3 py-2"
              value={distrito}
              disabled={!provincia}
              onChange={(e) => setDistrito(e.target.value)}
            >
              <option value="">
                {provincia ? "Selecciona Distrito" : "Elige una provincia"}
              </option>
              {distritos.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </label>

          {/* Dirección */}
          <label className="block">
            <span className="text-sm text-gray-600">Dirección de entrega*</span>
            <input
              className="mt-1 w-full border rounded-xl px-3 py-2"
              placeholder="Calle/Jr/Av + número, interior, etc."
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              autoComplete="street-address"
            />
          </label>

          {/* Referencia */}
          <label className="block">
            <span className="text-sm text-gray-600">Referencia (opcional)</span>
            <input
              className="mt-1 w-full border rounded-xl px-3 py-2"
              placeholder="Frente a parque / cerca a…"
              value={referencia}
              onChange={(e) => setReferencia(e.target.value)}
            />
          </label>

          {/* Nota de envío + método */}
          <p className="text-xs text-gray-600">
            Envío vía <strong>{carrier || "…"}</strong>
            {departamento
              ? isLimaCallao(departamento)
                ? " (Lima/Callao)"
                : " (Provincia)"
              : ""}{" "}
            · envío{" "}
            <strong>{shippingMode === "express" ? "express" : "regular"}</strong>
            . Envío <strong>regular</strong> gratis desde S/ 200.
          </p>

          <div className="mt-2 space-y-2 text-xs text-gray-700">
            <p className="font-semibold">Método de envío</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                disabled={!canChooseShipping}
                onClick={() => setShippingMode("regular")}
                className={`rounded-xl border px-3 py-2 text-left transition text-xs sm:text-sm ${
                  shippingMode === "regular"
                    ? "border-black ring-2 ring-black/10 bg-white"
                    : "border-gray-200 bg-white hover:border-gray-300"
                } ${!canChooseShipping ? "opacity-60 cursor-not-allowed" : ""}`}
              >
                <div className="font-medium">Envío regular</div>
                <div className="text-[11px] text-gray-600">
                  {departamento && isLimaCallao(departamento)
                    ? "S/ 12 · 24–48 horas"
                    : "S/ 16 · 48–72 horas (según ciudad)"}{" "}
                  · gratis desde S/ 200
                </div>
              </button>

              {isLimaCallao(departamento) && (
                <button
                  type="button"
                  disabled={!canChooseShipping}
                  onClick={() => setShippingMode("express")}
                  className={`rounded-xl border px-3 py-2 text-left transition text-xs sm:text-sm ${
                    shippingMode === "express"
                      ? "border-black ring-2 ring-black/10 bg-white"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  } ${!canChooseShipping ? "opacity-60 cursor-not-allowed" : ""}`}
                >
                  <div className="font-medium">Envío express</div>
                  <div className="text-[11px] text-gray-600">
                    S/ 20 · Entrega en 2–3 horas el mismo día (Lima/Callao).
                  </div>
                </button>
              )}
            </div>

            <p className="text-[11px] text-gray-500">
              Lima/Callao: Urbano Express. Provincia: Shalom. El envío express
              solo está disponible para Lima y Callao y nunca es gratis.
            </p>
          </div>

          {/* Aviso de faltantes */}
          {submitted && faltantes().length > 0 && (
            <div className="text-sm rounded-2xl px-3 py-2 bg-red-50 text-red-700 border border-red-200">
              Faltan: {faltantes().join(", ")}
            </div>
          )}

          {/* Mensajes */}
          {msg && (
            <div
              className={`text-sm rounded-2xl px-3 py-2 ${
                msgType === "ok"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {msg}
            </div>
          )}

          {/* Comprobante */}
          <div className="card space-y-3 pt-2">
            <h3 className="text-base font-semibold">Comprobante</h3>

            <div
              className="grid grid-cols-2 gap-2"
              role="radiogroup"
              aria-label="Tipo de comprobante"
            >
              {(["boleta", "factura"] as ReceiptType[]).map((rt) => (
                <label
                  key={rt}
                  className={`cursor-pointer rounded-xl border px-3 py-2 h-12 flex items-center justify-center gap-2 transition ${
                    receiptType === rt
                      ? "border-black ring-2 ring-black/10"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="receipt"
                    value={rt}
                    checked={receiptType === rt}
                    onChange={() => setReceiptType(rt)}
                    className="sr-only"
                  />
                  <span className="text-sm font-medium">
                    {rt === "boleta" ? "Boleta" : "Factura"}
                  </span>
                </label>
              ))}
            </div>

            {receiptType === "factura" && (
              <div className="grid sm:grid-cols-2 gap-2">
                <label className="block">
                  <span className="text-sm text-gray-600">RUC*</span>
                  <input
                    className={`mt-1 w-full border rounded-xl px-3 py-2 ${
                      ruc && !validarRUC() ? "border-red-400" : ""
                    }`}
                    placeholder="11 dígitos"
                    value={ruc}
                    onChange={(e) =>
                      setRuc(e.target.value.replace(/\D/g, "").slice(0, 11))
                    }
                    inputMode="numeric"
                    maxLength={11}
                    autoComplete="off"
                  />
                </label>

                <label className="block">
                  <span className="text-sm text-gray-600">Razón social*</span>
                  <input
                    className={`mt-1 w-full border rounded-xl px-3 py-2 ${
                      razonSocial && razonSocial.trim().length < 3
                        ? "border-red-400"
                        : ""
                    }`}
                    placeholder="Empresa"
                    value={razonSocial}
                    onChange={(e) => setRazonSocial(e.target.value)}
                  />
                </label>

                <label className="block sm:col-span-2">
                  <span className="text-sm text-gray-600">
                    Dirección fiscal (opcional)
                  </span>
                  <input
                    className="mt-1 w-full border rounded-xl px-3 py-2"
                    placeholder="Dirección fiscal"
                    value={direccionFiscal}
                    onChange={(e) => setDireccionFiscal(e.target.value)}
                  />
                </label>
              </div>
            )}

            <p className="text-xs text-gray-600">
              Boleta: sin RUC. Factura: requiere RUC y razón social.
            </p>
          </div>
        </form>

        {/* ===== Columna derecha: Resumen + Pago ===== */}
        <div className="space-y-4">
          {/* Resumen */}
          <div className="card space-y-3 bg-white rounded-2xl p-4 shadow-sm">
            <h2 className="text-xl font-bold">Resumen</h2>

            <ul className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
  {items.map((it, idx) => {
    const price = it.price ?? 0;
    const lineTotal = price * it.qty;

    return (
      <li
        key={`${it.id}-${(it as any).size ?? "std"}-${it.color ?? "default"}-${idx}`}
        className="flex items-center justify-between gap-3"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative h-9 w-9 rounded-md bg-gray-50 border border-black/10 flex-shrink-0 overflow-hidden">
           <ProductImage
  src={it.mainImage || "/placeholder-product.png"}
  alt={(it as any).name || "Producto"}
  fill
  sizes="36px"
  className="object-contain p-1"
/>
          </div>
          <div className="min-w-0">
            <div
              className="text-sm font-medium"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {(it as any).name ?? ""}
            </div>

            {/* 👇 Color elegido */}
            {it.color && (
              <div className="text-[11px] text-gray-500">
                Color:{" "}
                <span className="capitalize font-medium">
                  {it.color}
                </span>
              </div>
            )}

            <div className="text-[11px] text-gray-500">
              × {it.qty}
              {(it as any).size ? ` · Talla ${(it as any).size}` : ""}
            </div>
          </div>
        </div>
        <div className="text-sm font-semibold whitespace-nowrap">
          S/ {lineTotal.toFixed(2)}
        </div>
      </li>
    );
  })}
</ul>
            {/* Cupón */}
            <div className="rounded-xl border border-gray-200 p-2">
              {!appliedCoupon ? (
                <button
                  type="button"
                  onClick={() => {
                    setShowCoupon(true);
                    setCouponMsg(null);
                  }}
                  className="w-full h-9 rounded-lg border border-gray-300 text-sm bg-white hover:bg-gray-50"
                >
                  Agregar cupón
                </button>
              ) : (
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-2 text-sm px-2 py-1 rounded-full bg-green-50 text-green-700 border border-green-200">
                    Cupón aplicado: <strong>{appliedCoupon}</strong>
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowCoupon(true);
                        setCouponMsg(null);
                      }}
                      className="h-8 rounded-lg px-3 text-xs bg-gray-100 hover:bg-gray-200"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="h-8 rounded-lg px-3 text-xs bg-gray-200"
                    >
                      Quitar
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t pt-3 space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{`S/ ${subtotal.toFixed(2)}`}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-green-700">
                  <span>Descuento</span>
                  <span>- S/ {discount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>
                  Envío
                  {shippingAreaLabel ? ` (${shippingAreaLabel})` : ""}
                </span>
                <span>
                  {departamento
                    ? envio === 0
                      ? "Gratis"
                      : `S/ ${envio.toFixed(2)}`
                    : "—"}
                </span>
              </div>
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>S/ {grandTotal.toFixed(2)}</span>
              </div>
              <p className="text-xs text-gray-600">
                Envío regular: Lima/Callao S/ 12 vía Urbano Express; Provincia
                S/ 16 vía Shalom. Envío express Lima/Callao S/ 20. Envío{" "}
                <strong>regular gratis desde S/ 200</strong>.
              </p>
            </div>
          </div>

          {/* Pago con Mercado Pago */}
          <div className="card bg-white rounded-2xl p-4 shadow-sm">
            <div className="rounded-2xl ring-1 ring-black/5 bg-white">
              {/* T&C */}
              <label className="flex items-start gap-2 text-sm p-3 pb-0">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-black focus:ring-2 focus:ring-black/20"
                />
                <span className="text-gray-700">
                  Acepto los{" "}
                  <a href="/tyc" className="underline">
                    Términos y Condiciones
                  </a>{" "}
                  y la{" "}
                  <a href="/privacidad" className="underline">
                    Política de Privacidad
                  </a>
                  .
                </span>
              </label>

              {/* Botón primario: crea la orden (luego aparece Wallet) */}
              {!readyToPay ? (
                <button
                  type="button"
                  onClick={() => {
                    const form = document.getElementById(
                      "checkout-form"
                    ) as HTMLFormElement | null;
                    form?.requestSubmit();
                  }}
                  disabled={loading || !agree}
                  className={`mt-3 inline-flex items-center justify-center gap-2 w-full rounded-xl px-4 py-2 text-white transition ${
                    loading || !agree
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-black hover:bg-gray-900"
                  }`}
                >
                  {loading ? "Procesando…" : "Continuar a pagar"}
                </button>
              ) : (
                <>
                  <p className="mt-3 text-sm text-gray-700 px-3">
                    Pedido listo. Ahora realiza tu pago seguro:
                  </p>
                  <div className="px-3 pb-3">
                    <MercadoPagoPay
                      items={mpItems}
                      orderId={orderIdRef.current!}
                      externalRef={orderIdRef.current!}
                      payerEmail={email}
                      buyer={{
                        firstName: nombres,
                        docType,
                        docNumber,
                        phone: telefono,
                      }}
                      shipping={{
                        cost: envio,
                        carrier,
                        mode: shippingMode,
                        departamento,
                        provincia,
                        distrito,
                        direccion,
                        referencia,
                      }}
                      onPrefError={(m) => {
                        setMsg("Error: " + m);
                        setMsgType("err");
                        setReadyToPay(false);
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1 px-3 pb-2">
                    * Serás redirigido por Mercado Pago. Al aprobarse, volverás
                    a la web.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ===== Modal Cupón ===== */}
      {showCoupon && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          {/* overlay */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowCoupon(false)}
            aria-hidden="true"
          />
          {/* sheet */}
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Agregar cupón"
            className="relative w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl p-4 pb-20 shadow-xl m-0 sm:m-4"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-semibold">Cupón de descuento</h3>
              <button
                type="button"
                onClick={() => setShowCoupon(false)}
                className="h-8 px-3 rounded-lg text-sm bg-gray-100 hover:bg-gray-200"
              >
                Cerrar
              </button>
            </div>

            <p className="text-xs text-gray-500 mb-3">
              Si tienes un cupón, escríbelo aquí para validarlo.
            </p>

            <input
              className="w-full h-11 border rounded-lg px-3 text-sm leading-tight"
              placeholder="Ingresa tu cupón"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  applyCoupon();
                }
              }}
              autoComplete="off"
            />

            {couponMsg && (
              <p
                className={`mt-2 text-sm ${
                  couponMsg.includes("aplicado")
                    ? "text-green-700"
                    : "text-red-700"
                }`}
              >
                {couponMsg}
              </p>
            )}

            <div className="absolute left-0 right-0 bottom-0 p-3 bg-white border-t rounded-b-2xl sm:rounded-2xl flex gap-2">
              <button
                type="button"
                onClick={() => setShowCoupon(false)}
                className="h-10 px-3 rounded-lg text-sm bg-gray-100 hover:bg-gray-200 flex-1"
              >
                Cancelar
              </button>
              {appliedCoupon ? (
                <button
                  type="button"
                  onClick={() => {
                    removeCoupon();
                    setShowCoupon(false);
                  }}
                  className="h-10 px-3 rounded-lg text-sm bg-gray-200 hover:bg-gray-300"
                >
                  Quitar cupón
                </button>
              ) : null}
              <button
                type="button"
                onClick={applyCoupon}
                disabled={!coupon}
                className="h-10 px-4 rounded-lg text-sm bg-black text-white disabled:bg-gray-400"
              >
                Aplicar cupón
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
