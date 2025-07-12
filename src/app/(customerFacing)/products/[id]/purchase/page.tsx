import CheckoutForm from "@/app/(customerFacing)/products/[id]/purchase/components/CheckoutForm";
import db from "@/db/db";
import { stripe } from "@/lib/stripe";
import { notFound } from "next/navigation";

export default async function PurchasePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await db.product.findUnique({ where: { id } });

  if (product == null) {
    notFound();
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: product.priceInCents,
    currency: "USD",
    metadata: {
      productId: product.id,
    },
  });

  if (paymentIntent.client_secret == null) {
    throw new Error("Stripe failed to load");
  }

  return (
    <CheckoutForm
      product={product}
      clientSecret={paymentIntent.client_secret}
    />
  );
}
