import CategoriesSection from "@/app/components/categoriesSection";
import { getAllCategories } from "@/app/lib/api";

export default async function CategoriesPage() {
  const categories = await getAllCategories();
  return (
    <main className="flex min-h-screen flex-col items-center bg-off-white mt-6">
      <CategoriesSection categories={categories} title="Categories"/>
    </main>
  );
}
