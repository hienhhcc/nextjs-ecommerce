import OrderInformation from "@/email/components/OrderInformation";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Tailwind,
} from "@react-email/components";

type PurchaseReceiptEmailProps = {
  product: {
    name: string;
    imagePath: string;
    description: string;
  };
  order: { id: string; createdAt: Date; pricePaidInCents: number };
  downloadVerificationId: string;
  serverUrl: string;
};

PurchaseReceiptEmail.PreviewProps = {
  product: {
    name: "Product name",
    imagePath: "/products/82fb4ff0-b154-4eb6-aeba-069d00eee2b1-hoc_1_gpt.png",
    description: "some desription",
  },
  serverUrl: "http://localhost:3000",
  order: {
    id: crypto.randomUUID(),
    createdAt: new Date(),
    pricePaidInCents: 2000,
  },
  downloadVerificationId: crypto.randomUUID(),
} satisfies PurchaseReceiptEmailProps;

export default function PurchaseReceiptEmail({
  product,
  order,
  downloadVerificationId,
  serverUrl,
}: PurchaseReceiptEmailProps) {
  return (
    <Html>
      <Preview>Download {product.name} and view receipt</Preview>
      <Tailwind>
        <Head></Head>
        <Body className="font-sans bg-white">
          <Container className="max-w-xl">
            <Heading>Purchase Receipt</Heading>
            <OrderInformation
              order={order}
              product={product}
              downloadVerificationId={downloadVerificationId}
              serverUrl={serverUrl}
            />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
