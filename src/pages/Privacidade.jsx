import LegalLayout from "../components/LegalLayout.jsx";
import Secao from "../components/Secao.jsx";
import { BRAND } from "../config.js";

export default function Privacidade() {
  return (
    <LegalLayout
      title="Política de privacidade"
      description="Como a ogis.cloud trata dados pessoais, em conformidade com a LGPD."
      path="/privacidade"
      atualizadoEm="Julho/2026"
    >
      <p>
        A {BRAND.name} respeita a sua privacidade e trata dados pessoais em conformidade com a Lei
        Geral de Proteção de Dados (LGPD, Lei nº 13.709/2018). Esta política explica quais dados
        coletamos e como os utilizamos.
      </p>

      <Secao titulo="1. Dados que coletamos">
        <p>
          Coletamos apenas os dados que você nos fornece ao solicitar um orçamento ou entrar em contato —
          como nome, empresa, WhatsApp, e-mail e informações sobre o seu negócio — e dados técnicos
          básicos de navegação para melhorar o site.
        </p>
      </Secao>

      <Secao titulo="2. Como usamos">
        <p>
          Usamos seus dados para responder ao seu contato, elaborar propostas, prestar os serviços
          contratados e manter você informado sobre o andamento. Não vendemos seus dados a terceiros.
        </p>
      </Secao>

      <Secao titulo="3. Compartilhamento">
        <p>
          Podemos usar fornecedores de infraestrutura (hospedagem, e-mail, cobrança) estritamente para
          operar os serviços contratados, sempre com o cuidado de proteger suas informações.
        </p>
      </Secao>

      <Secao titulo="4. Seus direitos">
        <p>
          Você pode solicitar acesso, correção ou exclusão dos seus dados, além de revogar
          consentimentos, a qualquer momento, escrevendo para {BRAND.email}.
        </p>
      </Secao>

      <Secao titulo="5. Segurança">
        <p>
          Adotamos medidas técnicas e organizacionais para proteger seus dados, incluindo acesso
          restrito às informações e ao ambiente onde o seu negócio está hospedado.
        </p>
      </Secao>
    </LegalLayout>
  );
}
