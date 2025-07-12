import { Product } from "#/prisma";
import ProductCard from "@/app/components/ProductCard";
import ProductSkeleton from "@/app/components/ProductSkeleton";
import { Button } from "@/components/ui/button";
import db from "@/db/db";
import { cache } from "@/lib/cache";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

const getMostPopularProducts = cache(
  () => {
    return db.product.findMany({
      where: { isAvailableForPurchase: true },
      orderBy: { order: { _count: "desc" } },
      take: 6,
    });
  },
  ["/", "getMostPopularProducts"],
  {
    revalidate: 24 * 60 * 60,
  }
);

const getNewestProducts = cache(() => {
  return db.product.findMany({
    where: { isAvailableForPurchase: true },
    orderBy: {
      createdAt: "desc",
    },
    take: 6,
  });
}, ["/", "getNewestProducts"]);

export default function HomePage() {
  return (
    <main className="space-y-12">
      <ProductGridSection
        productFetcher={getMostPopularProducts}
        title={"Most Popular"}
      />
      <ProductGridSection productFetcher={getNewestProducts} title={"Newest"} />
    </main>
  );
}

function ProductGridSection({
  title,
  productFetcher,
}: {
  title: string;
  productFetcher: () => Promise<Product[]>;
}) {
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <h2 className="text-3xl font-bold">{title}</h2>
        <Button asChild variant="outline">
          <Link href="/products" className="space-x-2">
            <span>View All</span>
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Suspense
          fallback={
            <>
              <ProductSkeleton />
              <ProductSkeleton />
              <ProductSkeleton />
            </>
          }
        >
          <ProductsSuspense productFetcher={productFetcher} />
        </Suspense>
      </div>
    </div>
  );
}

async function ProductsSuspense({
  productFetcher,
}: {
  productFetcher: () => Promise<Product[]>;
}) {
  return (await productFetcher()).map((p) => <ProductCard key={p.id} {...p} />);
}
