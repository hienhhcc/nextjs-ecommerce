import db from "@/db/db";
import fs from "fs/promises";
import { notFound } from "next/navigation";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  const { productId } = await params;

  const product = await db.product.findUnique({ where: { id: productId } });

  if (product == null) {
    notFound();
  }

  const { size } = await fs.stat(product.filePath);
  const file = await fs.readFile(product.filePath);
  const fileExtension = product.filePath.split(".").pop();

  return new NextResponse(file, {
    headers: {
      "Content-Disposition": `attachment; filename="${product.name}.${fileExtension}"`,
      "Content-Length": size.toString(),
    },
  });
}
