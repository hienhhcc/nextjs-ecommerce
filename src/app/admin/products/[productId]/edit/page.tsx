import PageHeader from "@/app/admin/_components/PageHeader";
import ProductForm from "@/app/admin/products/_components/ProductForm";
import db from "@/db/db";
import { notFound } from "next/navigation";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;

  const product = await db.product.findUnique({
    where: { id: productId },
  });

  if (product == null) {
    notFound();
  }

  return (
    <>
      <PageHeader>Edit Product</PageHeader>
      <ProductForm product={product} />
    </>
  );
}
