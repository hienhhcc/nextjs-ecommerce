"use client";

import {
  deleteProduct,
  toggleAvailableForPurchase,
} from "@/app/admin/_actions/products";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useTransition } from "react";

export function ActiveToggleMenuItem({
  productId,
  isAvailableForPurchase,
}: {
  productId: string;
  isAvailableForPurchase: boolean;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <DropdownMenuItem
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          await toggleAvailableForPurchase({
            id: productId,
            isAvailableForPurchase: !isAvailableForPurchase,
          });
        });
      }}
    >
      {isAvailableForPurchase ? "Deactivate" : "Activate"}
    </DropdownMenuItem>
  );
}

export function DeleteProductMenuItem({
  productId,
  disabled,
}: {
  productId: string;
  disabled: boolean;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <DropdownMenuItem
      variant="destructive"
      disabled={pending || disabled}
      onClick={() => {
        startTransition(async () => {
          await deleteProduct({
            id: productId,
          });
        });
      }}
    >
      Delete
    </DropdownMenuItem>
  );
}
