import db from "@/db/db";
import PurchaseReceiptEmail from "@/email/PurchaseReceipt";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY as string);

export async function POST(req: NextRequest) {
  const event = stripe.webhooks.constructEvent(
    await req.text(),
    (await headers()).get("stripe-signature") as string,
    process.env.STRIPE_WEBHOOK_SECRET as string
  );

  if (event.type === "charge.succeeded") {
    const charge = event.data.object;
    const productId = charge.metadata.productId;
    const email = charge.billing_details.email;
    const pricePaidInCents = charge.amount;

    const product = await db.product.findUnique({ where: { id: productId } });

    if (product == null || email == null) {
      return new NextResponse("Bad Request", { status: 400 });
    }

    const userFields = {
      email,
      order: {
        create: {
          productId,
          pricePaidInCents,
        },
      },
    };

    const {
      order: [o1],
    } = await db.user.upsert({
      create: userFields,
      update: userFields,
      where: { email },
      select: { order: { take: 1, orderBy: { createdAt: "desc" } } },
    });

    const downloadVerification = await db.downloadVerification.create({
      data: {
        productId,
        expiredAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      },
    });

    await resend.emails.send({
      from: `Support <${process.env.SENDER_EMAIL}>`,
      to: email,
      subject: "Order Confirmation",
      react: (
        <PurchaseReceiptEmail
          product={product}
          order={o1}
          downloadVerificationId={downloadVerification.id}
          serverUrl={process.env.NEXT_PUBLIC_SERVER_URL as string}
        />
      ),
    });
  }

  return new NextResponse();
}
