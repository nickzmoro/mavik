import Link from "next/link";

import { ContactEmailLink } from "@/components/legal/contact-email-link";
import type { LegalSectionContent } from "@/components/legal/legal-page-layout";
import { legalInfo } from "@/lib/legal";
import { routes } from "@/lib/routes";

export const privacySections: LegalSectionContent[] = [
  {
    id: "quem-somos",
    title: "Quem somos",
    content: (
      <>
        <p>
          A {legalInfo.companyName} é uma plataforma de criação de conteúdo para
          redes sociais com inteligência artificial, disponível em{" "}
          {legalInfo.siteUrl}. Nesta política, “nós” se refere à{" "}
          {legalInfo.companyName}, que é a controladora dos seus dados pessoais
          nos termos da Lei Geral de Proteção de Dados (Lei nº 13.709/2018,
          “LGPD”).
        </p>
        <p>
          Esta política explica quais dados coletamos, por que coletamos, com
          quem compartilhamos e como você pode exercer seus direitos. Ela
          complementa os <Link href={routes.terms}>Termos de uso</Link>.
        </p>
      </>
    ),
  },
  {
    id: "dados-coletados",
    title: "Dados que coletamos",
    content: (
      <>
        <p>Coletamos apenas o necessário para oferecer o serviço:</p>
        <ul>
          <li>
            <strong>Dados de cadastro:</strong> nome, e-mail e senha. A senha é
            armazenada de forma criptografada (hash) e nunca fica visível para
            nós.
          </li>
          <li>
            <strong>Login com Google:</strong> se você escolher entrar com
            Google, recebemos seu nome, e-mail, foto de perfil e o identificador
            da sua conta Google. Não temos acesso à sua senha do Google.
          </li>
          <li>
            <strong>Conteúdo da sua marca:</strong> logos, cores, fontes,
            textos, imagens e demais materiais que você envia, além das artes e
            campanhas criadas na plataforma.
          </li>
          <li>
            <strong>Integração com o Instagram:</strong> quando você conecta sua
            conta, recebemos os dados que você autorizar, como nome da conta,
            publicações e métricas de desempenho.
          </li>
          <li>
            <strong>Dados de pagamento:</strong> nos planos pagos, o pagamento é
            processado por um provedor especializado. Não armazenamos o número
            completo do seu cartão.
          </li>
          <li>
            <strong>Dados técnicos:</strong> endereço IP, tipo de navegador e
            dispositivo, data e hora de acesso e registros de erros, usados para
            segurança, prevenção de fraudes e funcionamento do serviço.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "como-usamos",
    title: "Como e por que usamos seus dados",
    content: (
      <ul>
        <li>
          <strong>Prestar o serviço contratado</strong> (criar sua conta, gerar
          artes, salvar seu Brand Kit, conectar o Instagram): base legal de
          execução de contrato (art. 7º, V, da LGPD).
        </li>
        <li>
          <strong>Proteger sua conta e a plataforma</strong> (limite de
          tentativas de login, verificação contra robôs, detecção de fraude):
          base legal de legítimo interesse (art. 7º, IX).
        </li>
        <li>
          <strong>Enviar e-mails do serviço</strong> (confirmação de cadastro,
          redefinição de senha, avisos sobre a conta): execução de contrato.
        </li>
        <li>
          <strong>Cumprir obrigações legais</strong>, como a guarda de registros
          de acesso exigida pelo Marco Civil da Internet (art. 7º, II).
        </li>
        <li>
          <strong>Enviar novidades e ofertas</strong>, somente com o seu
          consentimento, que pode ser retirado a qualquer momento (art. 7º, I).
        </li>
      </ul>
    ),
  },
  {
    id: "inteligencia-artificial",
    title: "Uso de inteligência artificial",
    content: (
      <>
        <p>
          Para gerar artes, textos e campanhas, o conteúdo que você envia e os
          comandos que você digita são processados por provedores de
          inteligência artificial contratados por nós, apenas para produzir o
          resultado que você pediu.
        </p>
        <p>
          Não vendemos seu conteúdo e não o usamos para fins diferentes da
          prestação do serviço sem a sua autorização.
        </p>
      </>
    ),
  },
  {
    id: "compartilhamento",
    title: "Com quem compartilhamos",
    content: (
      <>
        <p>
          Não vendemos seus dados pessoais. Compartilhamos dados apenas com
          fornecedores que nos ajudam a operar o serviço, e somente na medida
          necessária:
        </p>
        <ul>
          <li>
            <strong>Supabase:</strong> autenticação e banco de dados.
          </li>
          <li>
            <strong>Vercel:</strong> hospedagem do site e da plataforma.
          </li>
          <li>
            <strong>Cloudflare:</strong> verificação contra robôs (Turnstile).
          </li>
          <li>
            <strong>Resend:</strong> envio dos e-mails do serviço.
          </li>
          <li>
            <strong>Google:</strong> login, caso você escolha entrar com Google.
          </li>
          <li>
            <strong>Meta (Instagram):</strong> caso você conecte sua conta.
          </li>
          <li>
            <strong>Provedores de inteligência artificial e de pagamento</strong>,
            conforme descrito acima.
          </li>
        </ul>
        <p>
          Também podemos compartilhar dados quando exigido por lei ou por ordem
          de autoridade competente.
        </p>
      </>
    ),
  },
  {
    id: "transferencia-internacional",
    title: "Transferência internacional",
    content: (
      <p>
        Alguns dos nossos fornecedores armazenam ou processam dados fora do
        Brasil. Nesses casos, a transferência segue o art. 33 da LGPD, e
        escolhemos fornecedores que adotam medidas de segurança e proteção de
        dados compatíveis com a lei brasileira.
      </p>
    ),
  },
  {
    id: "cookies",
    title: "Cookies",
    content: (
      <>
        <p>
          Usamos apenas cookies essenciais, necessários para o funcionamento e a
          segurança da plataforma:
        </p>
        <ul>
          <li>
            <strong>Sessão de login:</strong> mantém você conectado com
            segurança.
          </li>
          <li>
            <strong>“Lembrar de mim”:</strong> guarda sua escolha de manter ou
            não a sessão ao fechar o navegador.
          </li>
          <li>
            <strong>Redefinição de senha:</strong> cookie temporário, válido por
            15 minutos, usado apenas durante a criação de uma nova senha.
          </li>
          <li>
            <strong>Verificação contra robôs:</strong> usado pela Cloudflare
            para confirmar que o acesso é humano.
          </li>
        </ul>
        <p>
          Hoje não usamos cookies de publicidade. Se isso mudar, vamos pedir o
          seu consentimento antes.
        </p>
      </>
    ),
  },
  {
    id: "retencao",
    title: "Por quanto tempo guardamos",
    content: (
      <>
        <p>
          Guardamos seus dados enquanto sua conta estiver ativa. Se você
          excluir a conta, apagamos ou anonimizamos seus dados, exceto aqueles
          que a lei nos obriga a manter.
        </p>
        <p>
          Os registros de acesso (IP, data e hora) são guardados por 6 meses,
          conforme o art. 15 do Marco Civil da Internet (Lei nº 12.965/2014).
        </p>
      </>
    ),
  },
  {
    id: "seguranca",
    title: "Segurança",
    content: (
      <p>
        Adotamos medidas técnicas para proteger seus dados, como conexão
        criptografada (HTTPS), senhas armazenadas com hash, cookies de sessão
        protegidos, limite de tentativas de login e verificação contra robôs.
        Nenhum sistema é totalmente imune a falhas; se ocorrer um incidente que
        possa trazer risco a você, vamos avisar você e a Autoridade Nacional de
        Proteção de Dados (ANPD), conforme a lei.
      </p>
    ),
  },
  {
    id: "seus-direitos",
    title: "Seus direitos",
    content: (
      <>
        <p>Pela LGPD (art. 18), você pode, a qualquer momento:</p>
        <ul>
          <li>confirmar se tratamos seus dados e acessá-los;</li>
          <li>corrigir dados incompletos, inexatos ou desatualizados;</li>
          <li>
            pedir a anonimização, o bloqueio ou a exclusão de dados
            desnecessários;
          </li>
          <li>pedir a portabilidade dos seus dados;</li>
          <li>pedir a exclusão dos dados tratados com seu consentimento;</li>
          <li>saber com quem compartilhamos seus dados;</li>
          <li>retirar o seu consentimento.</li>
        </ul>
        <p>
          Para exercer qualquer direito, escreva para <ContactEmailLink />.
          Respondemos em até 15 dias. Você também pode registrar uma reclamação
          na ANPD.
        </p>
      </>
    ),
  },
  {
    id: "menores",
    title: "Menores de idade",
    content: (
      <p>
        A {legalInfo.companyName} é destinada a maiores de 18 anos. Não
        coletamos, de forma intencional, dados de crianças e adolescentes.
      </p>
    ),
  },
  {
    id: "alteracoes",
    title: "Alterações nesta política",
    content: (
      <p>
        Podemos atualizar esta política para refletir mudanças no serviço ou na
        lei. A data da última atualização fica no topo da página. Se a mudança
        for relevante, vamos avisar por e-mail ou dentro da plataforma.
      </p>
    ),
  },
  {
    id: "contato",
    title: "Contato e encarregado de dados",
    content: (
      <p>
        Dúvidas sobre privacidade ou sobre esta política? Fale com o nosso
        encarregado pelo tratamento de dados pessoais pelo e-mail{" "}
        <ContactEmailLink />.
      </p>
    ),
  },
];
