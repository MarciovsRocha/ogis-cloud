import LegalLayout from "../components/LegalLayout.jsx";
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

      <div>
        <h2>1. Serviços</h2>
        <p>
          A ogis.cloud fornece presença digital (sites, domínios, e-mail profissional), sistemas sob
          medida e sustentação, conforme o plano ou proposta contratada. O escopo de cada projeto é
          definido por escrito; alterações de escopo são tratadas como aditivo.
        </p>
      </div>

      <div>
        <h2>2. Mensalidade e sustentação</h2>
        <p>
          Todo projeto entregue possui um plano de sustentação mensal, que inclui hospedagem,
          monitoramento, backups, atualizações de segurança e um volume de ajustes acordado. A
          mensalidade é cobrada de forma recorrente. Não há fidelidade obrigatória.
        </p>
      </div>

      <div>
        <h2>3. Domínio e propriedade</h2>
        <p>
          O domínio é sempre registrado em nome do cliente. Os dados e o conteúdo do negócio pertencem
          ao cliente, que pode solicitar a migração a qualquer momento, com apoio de até 30 dias.
        </p>
      </div>

      <div>
        <h2>4. Disponibilidade</h2>
        <p>
          Trabalhamos com melhor esforço para manter os serviços no ar, com monitoramento contínuo. A
          responsabilidade por indisponibilidades é limitada nos termos da proposta assinada.
        </p>
      </div>

      <div>
        <h2>5. Pagamento e suspensão</h2>
        <p>
          O não pagamento da mensalidade pode acarretar suspensão do serviço após aviso. Os dados são
          preservados por um período de carência antes de qualquer remoção definitiva.
        </p>
      </div>

      <div>
        <h2>6. Contato</h2>
        <p>
          Dúvidas sobre estes termos podem ser enviadas para {BRAND.email}.
        </p>
      </div>
    </LegalLayout>
  );
}
