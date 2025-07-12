import ProductCard from "@/app/components/ProductCard";
import ProductSkeleton from "@/app/components/ProductSkeleton";
import db from "@/db/db";
import { cache } from "@/lib/cache";
import { Suspense } from "react";

const getProducts = cache(
  () =>
    db.product.findMany({
      where: { isAvailableForPurchase: true },
      orderBy: { name: "asc" },
    }),
  ["/products", "getProducts"]
);

export default function ProductsPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Suspense
        fallback={
          <>
            <ProductSkeleton />
            <ProductSkeleton />
            <ProductSkeleton />
            <ProductSkeleton />
            <ProductSkeleton />
            <ProductSkeleton />
          </>
        }
      >
        <ProductsSuspense />
      </Suspense>
    </div>
  );
}

async function ProductsSuspense() {
  const products = await getProducts();
  return products.map((p) => <ProductCard key={p.id} {...p} />);
}
