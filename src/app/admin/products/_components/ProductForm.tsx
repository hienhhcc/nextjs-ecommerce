"use client";

import { saveProduct, updateProduct } from "@/app/admin/_actions/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/formatters";
import { useActionState, useState } from "react";
import { Product } from "../../../../../generated/prisma";
import Image from "next/image";

export default function ProductForm({ product }: { product?: Product }) {
  const [priceInCents, setPriceInCents] = useState(product?.priceInCents);

  const [state, formAction, pending] = useActionState(
    product == null ? saveProduct : updateProduct.bind(null, product.id),
    null
  );

  return (
    <form action={formAction} className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          type="text"
          id="name"
          name="name"
          required
          defaultValue={product?.name || ""}
        />
        {state?.name?.length && state?.name?.length > 0 && (
          <p className="text-destructive">{state.name[0]}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="priceInCents">Price In Cents</Label>
        <Input
          type="number"
          id="priceInCents"
          name="priceInCents"
          value={priceInCents}
          onChange={(e) => setPriceInCents(Number(e.target.value) || undefined)}
          required
          defaultValue={product?.priceInCents}
        />
        {state?.priceInCents?.length && state?.priceInCents?.length > 0 && (
          <p className="text-destructive">{state.priceInCents[0]}</p>
        )}
        <div className="text-muted-foreground">
          {formatCurrency((priceInCents || 0) / 100)}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          required
          defaultValue={product?.description || ""}
        />
        {state?.description?.length && state?.description?.length > 0 && (
          <p className="text-destructive">{state.description[0]}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="file">File</Label>
        <Input type="file" id="file" name="file" required={product == null} />
        {product != null && (
          <div className="text-muted-foreground">{product.filePath}</div>
        )}
        {state?.file?.length && state?.file?.length > 0 && (
          <p className="text-destructive">{state.file[0]}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="image">Image</Label>
        <Input type="file" id="image" name="image" required={product == null} />
        {product?.imagePath && (
          <Image alt="image" src={product.imagePath} width={400} height={400} />
        )}
        {state?.image?.length && state?.image?.length > 0 && (
          <p className="text-destructive">{state.image[0]}</p>
        )}
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : "Save"}
      </Button>
    </form>
  );
}
