"use server";

import db from "@/db/db";
import { notFound } from "next/navigation";

export default async function deleteOrder(id: string) {
  const order = await db.order.delete({ where: { id } });

  if (order == null) {
    notFound();
  }

  return order;
}
