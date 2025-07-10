import PageHeader from "@/app/admin/_components/PageHeader";
import {
  ActiveToggleMenuItem,
  DeleteProductMenuItem,
} from "@/app/admin/products/_components/ProductActions";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import db from "@/db/db";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import { CheckCircle2, MoreVertical, XCircle } from "lucide-react";
import Link from "next/link";

export default function AdminProductsPage() {
  return (
    <>
      <div className="flex justify-between items-center gap-4">
        <PageHeader>Products</PageHeader>
        <Button asChild>
          <Link href="/admin/products/new">Add product</Link>
        </Button>
      </div>
      <ProductsTable />
    </>
  );
}

async function ProductsTable() {
  const products = await db.product.findMany({
    select: {
      id: true,
      name: true,
      priceInCents: true,
      isAvailableForPurchase: true,
      _count: {
        select: { order: true },
      },
    },
    orderBy: { name: "asc" },
  });

  if (products.length === 0) {
    return <p>No products found</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-0">
            <span className="sr-only">Available For Purchase</span>
          </TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Orders</TableHead>
          <TableHead className="w-0">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((p) => (
          <TableRow key={p.id}>
            <TableCell>
              {p.isAvailableForPurchase ? <CheckCircle2 /> : <XCircle />}
              <p className="sr-only">Available For Purchase</p>
            </TableCell>
            <TableCell>{p.name}</TableCell>
            <TableCell>{formatCurrency(p.priceInCents)}</TableCell>
            <TableCell>{formatNumber(p._count.order)}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <MoreVertical />
                  <span className="sr-only">Actions</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <a download href={`/admin/products/${p.id}/download`}>
                      Download
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/admin/products/${p.id}/edit`}>Edit</Link>
                  </DropdownMenuItem>
                  <ActiveToggleMenuItem
                    productId={p.id}
                    isAvailableForPurchase={p.isAvailableForPurchase}
                  />
                  <DropdownMenuSeparator />
                  <DeleteProductMenuItem
                    productId={p.id}
                    disabled={p._count.order > 0}
                  />
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
