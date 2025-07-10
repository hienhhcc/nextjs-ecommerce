"use client";

import { saveProduct } from "@/app/admin/_actions/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/formatters";
import { useActionState, useState } from "react";

export default function ProductForm() {
  const [priceInCents, setPriceInCents] = useState<number>();

  const [state, formAction, pending] = useActionState(saveProduct, null);

  return (
    <form action={formAction} className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input type="text" id="name" name="name" required />
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
        <Textarea id="description" name="description" required />
        {state?.description?.length && state?.description?.length > 0 && (
          <p className="text-destructive">{state.description[0]}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="file">File</Label>
        <Input type="file" id="file" name="file" required />
        {state?.file?.length && state?.file?.length > 0 && (
          <p className="text-destructive">{state.file[0]}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="image">Image</Label>
        <Input type="file" id="image" name="image" required />
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
