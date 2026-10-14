import LegalLayout from "../components/LegalLayout.jsx";
import Secao from "../components/Secao.jsx";
import { BRAND } from "../config.js";

export default function Termos() {
  return (
    <LegalLayout
      title="Termos de uso"
      description="Termos de uso dos serviços da ogis.cloud."
      path="/termos"
      atualizadoEm="Julho/2026"
    >
      <p>
        Estes termos regem a contratação dos serviços digitais gerenciados oferecidos pela {BRAND.name}
        {" "}({BRAND.cnpj}), com atendimento em {BRAND.cidade}. Ao contratar, o cliente concorda com as
        condições abaixo.
      </p>

      <Secao titulo="1. Serviços">
        <p>
          A ogis.cloud fornece presença digital (sites, domínios, e-mail profissional), sistemas sob
          medida e sustentação, conforme o plano ou proposta contratada. O escopo de cada projeto é
          definido por escrito; alterações de escopo são tratadas como aditivo.
        </p>
      </Secao>

      <Secao titulo="2. Mensalidade e sustentação">
        <p>
          Todo projeto entregue possui um plano de sustentação mensal, que inclui hospedagem,
          monitoramento, atualizações de segurança e um volume de ajustes acordado. A
          mensalidade é cobrada de forma recorrente. Não há fidelidade obrigatória.
        </p>
      </Secao>

      <Secao titulo="3. Domínio e propriedade">
        <p>
          O domínio é sempre registrado em nome do cliente. Os dados e o conteúdo do negócio pertencem
          ao cliente, que pode solicitar a migração a qualquer momento, com o nosso apoio.
        </p>
      </Secao>

      <Secao titulo="4. Disponibilidade">
        <p>
          Trabalhamos com melhor esforço para manter os serviços no ar, com monitoramento contínuo. A
          responsabilidade por indisponibilidades é limitada nos termos da proposta assinada.
        </p>
      </Secao>

      <Secao titulo="5. Pagamento e suspensão">
        <p>
          O não pagamento da mensalidade pode acarretar suspensão do serviço após aviso. Os dados são
          preservados por um período de carência antes de qualquer remoção definitiva.
        </p>
      </Secao>

      <Secao titulo="6. Contato">
        <p>Dúvidas sobre estes termos podem ser enviadas para {BRAND.email}.</p>
      </Secao>
    </LegalLayout>
  );
}
