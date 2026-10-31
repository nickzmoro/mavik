import Link from "next/link";

import { ContactEmailLink } from "@/components/legal/contact-email-link";
import type { LegalSectionContent } from "@/components/legal/legal-page-layout";
import { legalInfo } from "@/lib/legal";
import { routes } from "@/lib/routes";

export const termsSections: LegalSectionContent[] = [
  {
    id: "aceite",
    title: "Aceite dos termos",
    content: (
      <>
        <p>
          Estes Termos de uso regulam o acesso e o uso da{" "}
          {legalInfo.companyName}, disponível em {legalInfo.siteUrl}. Ao criar
          uma conta, inclusive pelo login com Google, ou ao usar a plataforma,
          você declara que leu e concorda com estes termos e com a nossa{" "}
          <Link href={routes.privacy}>Política de privacidade</Link>.
        </p>
        <p>Se você não concordar, não use a plataforma.</p>
      </>
    ),
  },
  {
    id: "servico",
    title: "O serviço",
    content: (
      <p>
        A {legalInfo.companyName} ajuda você a criar artes, textos e campanhas
        para redes sociais com inteligência artificial, a partir da identidade
        visual da sua marca (Brand Kit). Algumas funcionalidades, como a
        integração com o Instagram, podem depender do plano contratado ou de
        serviços de terceiros.
      </p>
    ),
  },
  {
    id: "conta",
    title: "Sua conta",
    content: (
      <ul>
        <li>Você precisa ter pelo menos 18 anos para criar uma conta.</li>
        <li>As informações do cadastro devem ser verdadeiras e atualizadas.</li>
        <li>
          Você é responsável por manter sua senha em segredo e por todas as
          atividades feitas na sua conta.
        </li>
        <li>
          Se suspeitar de acesso indevido, troque sua senha e fale com a gente
          pelo e-mail <ContactEmailLink />.
        </li>
      </ul>
    ),
  },
  {
    id: "planos-e-pagamentos",
    title: "Planos e pagamentos",
    content: (
      <ul>
        <li>
          Os planos pagos são cobrados de forma mensal ou anual, de forma
          antecipada, e renovam automaticamente ao fim de cada período.
        </li>
        <li>
          Você pode cancelar a qualquer momento. O cancelamento vale para o
          próximo período, e você mantém o acesso até o fim do período já pago.
        </li>
        <li>
          Na primeira contratação, você pode desistir em até 7 dias e receber o
          valor pago de volta, conforme o art. 49 do Código de Defesa do
          Consumidor.
        </li>
        <li>
          Se os preços mudarem, vamos avisar com pelo menos 30 dias de
          antecedência. O novo valor só vale a partir da renovação seguinte.
        </li>
      </ul>
    ),
  },
  {
    id: "seu-conteudo",
    title: "Seu conteúdo",
    content: (
      <>
        <p>
          Tudo o que você envia (logos, imagens, textos e outros materiais)
          continua sendo seu. Para que a plataforma funcione, você nos concede
          uma autorização limitada, não exclusiva e gratuita para armazenar,
          processar e exibir esse conteúdo, apenas para prestar o serviço a
          você.
        </p>
        <p>
          Você declara que tem os direitos necessários sobre o conteúdo que
          envia e que ele não viola direitos de terceiros, como direitos
          autorais e de marca.
        </p>
      </>
    ),
  },
  {
    id: "conteudo-gerado",
    title: "Conteúdo gerado por inteligência artificial",
    content: (
      <ul>
        <li>
          Você pode usar as artes e textos gerados na plataforma, inclusive para
          fins comerciais, de acordo com o seu plano.
        </li>
        <li>
          A inteligência artificial pode cometer erros ou gerar resultados
          parecidos com os de outros usuários. Revise todo o conteúdo antes de
          publicar.
        </li>
        <li>
          Você é o responsável pelo que decide publicar. Nunca publicamos nada
          nas suas redes sem a sua aprovação.
        </li>
      </ul>
    ),
  },
  {
    id: "integracoes",
    title: "Integrações com terceiros",
    content: (
      <p>
        Ao conectar serviços de terceiros, como o Instagram, você também fica
        sujeito aos termos desses serviços. Não controlamos a disponibilidade
        nem as mudanças feitas por eles, que podem afetar algumas
        funcionalidades da plataforma.
      </p>
    ),
  },
  {
    id: "uso-proibido",
    title: "Uso proibido",
    content: (
      <>
        <p>Ao usar a plataforma, você não pode:</p>
        <ul>
          <li>criar ou divulgar conteúdo ilegal, enganoso ou difamatório;</li>
          <li>
            criar conteúdo de ódio, discriminação, violência ou de natureza
            sexual envolvendo menores;
          </li>
          <li>violar direitos autorais, de marca ou de imagem de terceiros;</li>
          <li>enviar spam ou praticar fraudes;</li>
          <li>
            tentar acessar contas de outras pessoas, burlar limites de uso ou
            medidas de segurança;
          </li>
          <li>
            copiar, fazer engenharia reversa ou extrair dados da plataforma de
            forma automatizada.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "propriedade-intelectual",
    title: "Propriedade da Zaion",
    content: (
      <p>
        A marca, o software, o design e os demais elementos da plataforma
        pertencem à {legalInfo.companyName} e são protegidos por lei. Estes
        termos não transferem a você nenhum direito sobre eles, além do uso da
        plataforma.
      </p>
    ),
  },
  {
    id: "disponibilidade",
    title: "Disponibilidade e limitação de responsabilidade",
    content: (
      <>
        <p>
          Trabalhamos para manter a plataforma disponível e segura, mas ela pode
          passar por manutenções, falhas ou interrupções. Vamos avisar com
          antecedência sempre que possível.
        </p>
        <p>
          Dentro do que a lei permite, não respondemos por resultados de negócio
          obtidos com as publicações, por indisponibilidades de serviços de
          terceiros ou por conteúdo publicado por você. Nada nestes termos
          limita os seus direitos como consumidor.
        </p>
      </>
    ),
  },
  {
    id: "encerramento",
    title: "Suspensão e encerramento",
    content: (
      <>
        <p>
          Você pode excluir sua conta a qualquer momento. Também podemos
          suspender ou encerrar contas que violem estes termos, avisando você
          sempre que possível.
        </p>
        <p>
          Após o encerramento, seus dados são tratados conforme a{" "}
          <Link href={routes.privacy}>Política de privacidade</Link>.
        </p>
      </>
    ),
  },
  {
    id: "alteracoes",
    title: "Alterações nos termos",
    content: (
      <p>
        Podemos atualizar estes termos. A data da última atualização fica no
        topo da página. Se a mudança for relevante, vamos avisar por e-mail ou
        dentro da plataforma antes de ela valer.
      </p>
    ),
  },
  {
    id: "lei-e-foro",
    title: "Lei aplicável e foro",
    content: (
      <p>
        Estes termos seguem as leis do Brasil. Fica eleito o foro do seu
        domicílio para resolver qualquer questão relacionada a eles.
      </p>
    ),
  },
  {
    id: "contato",
    title: "Contato",
    content: (
      <p>
        Dúvidas sobre estes termos? Escreva para <ContactEmailLink />.
      </p>
    ),
  },
];
