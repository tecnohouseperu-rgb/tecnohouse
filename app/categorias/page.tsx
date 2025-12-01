import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

type Category = {
  id: number;
  name: string;
  slug: string;
};

export default async function CategoriesIndexPage() {
  const supabase = createClient();

  const { data: categories, error } = await supabase
    .from("categories")
    .select("id, name, slug") // 👈 sin is_active porque no existe la columna
    .order("name", { ascending: true });

  if (error) {
    console.error("Error cargando categorías:", error);
  }

  return (
    <div className="px-4 lg:px-10 py-6">
      <h1 className="text-2xl font-semibold mb-4">Categorías</h1>

      {!categories?.length && (
        <p className="text-sm text-neutral-500">
          Aún no hay categorías configuradas.
        </p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories?.map((cat: Category) => (
          <Link
            key={cat.id}
            href={`/categorias/${cat.slug}`}
            className="border rounded-xl p-4 hover:shadow-md bg-white transition flex items-center justify-center text-center"
          >
            <span className="font-medium capitalize">{cat.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
