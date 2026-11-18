import { JsonLd } from "@/components/seo/JsonLd";
import { pageMetadata, webPageSchema } from "@/lib/seo";

const description =
  "Entenda como a Reppy coleta, usa e protege seus dados pessoais, seus direitos LGPD e as opções de privacidade disponíveis na plataforma com transparência.";

export const metadata = pageMetadata({
  title: "Política de Privacidade",
  description,
  path: "/privacidade",
  noindex: true,
});

export default function PrivacidadeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd
        data={webPageSchema({
          title: "Política de Privacidade",
          description,
          path: "/privacidade",
        })}
      />
      {children}
    </>
  );
}
