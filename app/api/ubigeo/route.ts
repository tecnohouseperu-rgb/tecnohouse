// app/api/ubigeo/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type UbigeoTree = Array<{
  departamento: string;
  provincias: Array<{ provincia: string; distritos: string[] }>;
}>;

export async function GET(req: Request) {
  try {
    const mod: any = await import("ubigeo-peru");
    const root: any = (mod && mod.default) || mod;

    // En tu paquete, los datos están en root.reniec (o root.inei), con claves: departamento, provincia, distrito, nombre
    const rows: any[] =
      (root?.reniec && Array.isArray(root.reniec) && root.reniec) ||
      (root?.inei && Array.isArray(root.inei) && root.inei) ||
      (Array.isArray(root) ? root : []);

    if (!Array.isArray(rows) || rows.length === 0) {
      return Response.json({ ok: false, error: "Sin filas de ubigeo" }, { status: 500 });
    }

    // Normalizadores
    const pad2 = (v: any) => String(v ?? "").padStart(2, "0");
    const nameOf = (r: any) => String(r?.nombre ?? "").trim();

    // Estructuras para agrupar por códigos
    const depMap = new Map<string, { nombre: string; provs: Map<string, { nombre: string; dists: Set<string> }> }>();

    for (const r of rows) {
      const dep = pad2(r.departamento);
      const prov = pad2(r.provincia);
      const dist = pad2(r.distrito);
      const nombre = nameOf(r);
      if (!dep || !prov || !dist || !nombre) continue;

      // Departamento (prov=00, dist=00)
      if (prov === "00" && dist === "00") {
        if (!depMap.has(dep)) depMap.set(dep, { nombre, provs: new Map() });
        else depMap.get(dep)!.nombre = nombre; // por si viene después
        continue;
      }

      // Provincia (dist=00, prov!=00)
      if (dist === "00" && prov !== "00") {
        if (!depMap.has(dep)) depMap.set(dep, { nombre: "", provs: new Map() });
        const d = depMap.get(dep)!;
        if (!d.provs.has(prov)) d.provs.set(prov, { nombre, dists: new Set() });
        else d.provs.get(prov)!.nombre = nombre;
        continue;
      }

      // Distrito (dist!=00)
      if (!depMap.has(dep)) depMap.set(dep, { nombre: "", provs: new Map() });
      const d = depMap.get(dep)!;
      if (!d.provs.has(prov)) d.provs.set(prov, { nombre: "", dists: new Set() });
      d.provs.get(prov)!.dists.add(nombre);
    }

    // Convertir a árbol con nombres y ordenar
    const tree: UbigeoTree = Array.from(depMap.entries())
      .map(([depCode, depVal]) => ({
        departamento: depVal.nombre || depCode,
        provincias: Array.from(depVal.provs.values())
          .map((p) => ({
            provincia: p.nombre,
            distritos: Array.from(p.dists).sort((a, b) => a.localeCompare(b)),
          }))
          .filter((p) => !!p.provincia)
          .sort((a, b) => a.provincia.localeCompare(b.provincia)),
      }))
      .filter((d) => !!d.departamento)
      .sort((a, b) => a.departamento.localeCompare(b.departamento));

    if (tree.length === 0) {
      return Response.json({ ok: false, error: "No se pudo construir el árbol (verifica datos)" }, { status: 500 });
    }

    return Response.json({ ok: true, data: tree });
  } catch (e: any) {
    return Response.json({ ok: false, error: e?.message || "Error ubigeo" }, { status: 500 });
  }
}
