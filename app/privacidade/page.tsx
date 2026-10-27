"use client";
import {
  Lock,
  Ticket,
  User,
  WifiHigh,
  Trophy,
  ShieldCheck,
  ChartBar,
  Scales,
  Eye,
  PencilSimple,
  Trash,
  ArrowsDownUp,
  Prohibit,
  ArrowCounterClockwise,
  Info,
  Robot,
  Check,
  ArrowRight,
  ArrowLeft,
} from "@phosphor-icons/react";

export default function PoliticaDePrivacidade() {
  return (
    <div className="min-h-screen bg-[#F7F7F2] text-[#0A0A0A]">


      {/* HERO */}
      <section className="bg-[#0A0A0A] px-8 pt-20 pb-16 relative overflow-hidden">
        <div
          className="absolute -top-16 -right-16 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(27,255,17,0.12) 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-0 left-0 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(139,47,255,0.06) 0%, transparent 70%)" }}
        />
        <div className="max-w-3xl mx-auto relative">
          <div className="inline-flex items-center gap-2 bg-[#1BFF11]/10 border border-[#1BFF11]/25 text-[#1BFF11] font-display font-bold text-[11px] tracking-[2px] uppercase px-3.5 py-1.5 rounded-full mb-6">
            <Lock size={12} weight="bold" />
            Documento legal
          </div>
          <h1 className="font-display font-extrabold text-[clamp(40px,6vw,64px)] text-white leading-[0.95] tracking-[-2px] mb-5">
            Política de<br /><span className="text-[#1BFF11]">Privacidade</span>
          </h1>
          <p className="text-sm font-semibold text-[#9A9A8F]">
            Última atualização: março de 2026 · Versão 1.0
          </p>
        </div>
      </section>

      {/* RESUMO */}
      <div className="max-w-3xl mx-auto px-8 mt-12">
        <div className="bg-[#0A0A0A] rounded-[28px] p-8 relative overflow-hidden">
          <div
            className="absolute bottom-0 right-0 w-44 h-44 pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(27,255,17,0.08) 0%, transparent 70%)" }}
          />
          <h2 className="font-display font-extrabold text-xl text-[#1BFF11] mb-5 tracking-[-0.5px]">
            O que você precisa saber
          </h2>
          <ul className="flex flex-col gap-3">
            {[
              "Coletamos apenas o necessário para fazer a plataforma funcionar direito.",
              "Seus dados do Reppy Radar somem em até 48h após o encerramento do evento.",
              "Nunca vendemos seus dados para terceiros.",
              "Você pode pedir a exclusão, correção ou portabilidade dos seus dados a qualquer momento.",
              "Seguimos a LGPD (Lei 13.709/2018) e o Marco Civil da Internet (Lei 12.965/2014).",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-[#F0F0EB] text-[15px] leading-relaxed">
                <Check size={16} weight="bold" className="text-[#1BFF11] flex-shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ÍNDICE */}
      <div className="max-w-3xl mx-auto px-8 mt-12 mb-12">
        <p className="font-display font-bold text-[11px] tracking-[2px] uppercase text-[#9A9A8F] mb-4">
          Índice
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[
            { num: "01", label: "Quem somos",           href: "#quem-somos" },
            { num: "02", label: "Dados que coletamos",  href: "#dados" },
            { num: "03", label: "Como coletamos",       href: "#como-coletamos" },
            { num: "04", label: "Finalidade do uso",    href: "#finalidade" },
            { num: "05", label: "Armazenamento",        href: "#armazenamento" },
            { num: "06", label: "Segurança",            href: "#seguranca" },
            { num: "07", label: "Compartilhamento",     href: "#compartilhamento" },
            { num: "08", label: "Radar e dados sociais",href: "#radar" },
            { num: "09", label: "Cookies",              href: "#cookies" },
            { num: "10", label: "Seus direitos (LGPD)", href: "#direitos" },
            { num: "11", label: "Menores de idade",     href: "#menores" },
            { num: "12", label: "Alterações",           href: "#alteracoes" },
            { num: "13", label: "Responsabilidade",     href: "#responsabilidade" },
            { num: "14", label: "Contato e DPO",        href: "#contato" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="flex items-center gap-2.5 px-4 py-3 bg-[#F0F0EB] hover:bg-[#E0E0D8] hover:-translate-y-px rounded-2xl text-[#0A0A0A] font-display text-[13px] font-semibold transition-all"
            >
              <span className="text-[11px] font-bold text-[#9A9A8F] min-w-[20px]">{item.num}</span>
              {item.label}
            </a>
          ))}
        </div>
      </div>

      {/* INTRO TEXT */}
      <div className="max-w-3xl mx-auto px-8 mb-12">
        <p className="text-[15px] text-[#5C5C52] leading-[1.75]">
          Na Reppy, privacidade não é burocracia — é parte de como a gente opera. Esta Política descreve
          como coletamos, usamos e protegemos seus dados pessoais, em conformidade com a{" "}
          <strong className="text-[#2a2a2a]">Lei Geral de Proteção de Dados (LGPD, Lei 13.709/2018)</strong>,
          o Marco Civil da Internet (Lei 12.965/2014), o Código de Defesa do Consumidor (Lei 8.078/1990)
          e a Constituição Federal (art. 5º, LXXIX, incluído pela EC 115/2022).
        </p>
      </div>

      {/* CONTENT */}
      <main className="max-w-3xl mx-auto px-8 pb-32">

        {/* 1. QUEM SOMOS */}
        <Section id="quem-somos" num="01" title="Quem somos">
          <Body>
            A Reppy é a controladora dos dados pessoais tratados nos termos desta Política. Somos
            responsáveis por decidir como e por que seus dados são usados dentro da plataforma.
          </Body>
          <Body>
            Operamos como um marketplace de ingressos para eventos universitários — conectando
            compradores, organizadores e a vida social acadêmica brasileira. Todos os dados que
            coletamos servem exclusivamente para fazer essa conexão funcionar bem.
          </Body>
        </Section>

        {/* 2. DADOS QUE COLETAMOS */}
        <Section id="dados" num="02" title="Dados que coletamos" green>
          <Body>Coletamos apenas o necessário para prestar o serviço e garantir segurança nas transações.</Body>

          <Subsection title="Dados de cadastro">
            <BulletList items={["Nome completo", "E-mail", "CPF", "Data de nascimento", "Telefone", "Nacionalidade"]} />
          </Subsection>

          <Subsection title="Dados de compra">
            <BulletList items={[
              "Dados do cartão de crédito (processados via gateway seguro — a Reppy não armazena o número completo do cartão)",
              "Chave Pix utilizada para transações no Reppy Market",
              "Histórico de ingressos comprados e eventos frequentados (check-ins confirmados)",
            ]} />
          </Subsection>

          <Subsection title="Dados do Reppy Radar (opt-in)">
            <BulletList items={[
              "Foto de perfil",
              "Primeiro nome",
              "Usuário do Instagram (opcional — você escolhe exibir ou não)",
              "Taps dados e recebidos dentro de um evento específico",
            ]} />
            <Highlight>
              Esses dados são visíveis apenas para compradores do mesmo evento e excluídos automaticamente
              em até 48 horas após o encerramento do evento.
            </Highlight>
          </Subsection>

          <Subsection title="Dados coletados automaticamente">
            <BulletList items={[
              "Endereço IP e porta lógica de origem",
              "Data, hora e fuso horário do acesso",
              "Tipo de dispositivo e navegador",
              "Páginas visitadas dentro da plataforma Reppy (não inclui navegação fora do nosso domínio)",
              "Dados de localização aproximada (via IP)",
            ]} />
          </Subsection>

          <Subsection title="Dados para prevenção de fraude">
            <Body>
              Em casos de suspeita de fraude, podemos solicitar selfie com documento ou cartão. Essas
              imagens são usadas exclusivamente para verificar a autenticidade da operação e descartadas
              após a análise. Nenhuma outra finalidade.
            </Body>
          </Subsection>
        </Section>

        {/* 3. COMO COLETAMOS */}
        <Section id="como-coletamos" num="03" title="Como coletamos seus dados">
          <Subsection title="Diretamente por você">
            <Body>
              No momento do cadastro, da compra de ingressos, da ativação do Modo Radar, ou ao
              preencher qualquer formulário dentro da plataforma.
            </Body>
          </Subsection>
          <Subsection title="Automaticamente">
            <Body>
              Quando você navega pela plataforma, dados técnicos como IP, tipo de dispositivo e
              histórico de páginas são coletados automaticamente para garantir segurança e melhorar
              a experiência.
            </Body>
          </Subsection>
          <Subsection title="Via cookies">
            <Body>A Reppy utiliza cookies para personalizar a experiência e manter sessões ativas. Veja a seção 9 para detalhes.</Body>
          </Subsection>
          <Subsection title="Via parceiros de pagamento">
            <Body>
              Informações sobre transações podem ser recebidas dos nossos processadores de pagamento
              (ex: Abacatepay) para confirmação e validação de compras.
            </Body>
          </Subsection>

          <div className="bg-[#F0F0EB] border border-[#E0E0D8] rounded-[20px] px-6 py-5 mt-5">
            <p className="font-display font-bold text-[14px] text-[#0A0A0A] mb-1">Base legal (LGPD)</p>
            <p className="text-[14px] text-[#5C5C52] leading-relaxed">
              O tratamento dos seus dados é baseado no seu <strong className="text-[#2a2a2a]">consentimento</strong> (art. 7º, I),
              na <strong className="text-[#2a2a2a]">execução do contrato</strong> de compra e venda de ingressos (art. 7º, V),
              no <strong className="text-[#2a2a2a]">legítimo interesse</strong> da Reppy para segurança e prevenção de fraudes (art. 7º, IX)
              e no <strong className="text-[#2a2a2a]">cumprimento de obrigação legal</strong> quando necessário (art. 7º, II).
            </p>
          </div>
        </Section>

        {/* 4. FINALIDADE */}
        <Section id="finalidade" num="04" title="Para que usamos seus dados">
          <div className="flex flex-col gap-3 mt-2">
            {(
              [
                { Icon: Ticket,      title: "Processar compras e emitir ingressos", desc: "Validar pagamentos, gerar QR Codes e garantir que o ingresso chegue no nome certo." },
                { Icon: User,        title: "Gerenciar sua conta",                  desc: "Permitir login, histórico de compras, rank e preferências dentro da plataforma." },
                { Icon: WifiHigh,    title: "Operar o Reppy Radar",                 desc: "Exibir seu perfil para outros compradores do mesmo evento, se você ativar o Modo Radar." },
                { Icon: Trophy,      title: "Calcular o Reppy Ranks",               desc: "Registrar check-ins confirmados para atualizar seu nível de progressão." },
                { Icon: ShieldCheck, title: "Prevenir fraudes",                      desc: "Identificar transações suspeitas e proteger compradores, vendedores e organizadores." },
                { Icon: ChartBar,    title: "Melhorar a plataforma",                desc: "Entender como os usuários navegam para aprimorar funcionalidades e corrigir problemas." },
                { Icon: Scales,      title: "Cumprir obrigações legais",            desc: "Guardar registros de acesso conforme o Marco Civil da Internet e atender determinações judiciais." },
              ] as const
            ).map(({ Icon, title, desc }) => (
              <div key={title} className="flex gap-4 bg-[#F0F0EB] border border-[#E0E0D8] rounded-[16px] px-5 py-4">
                <Icon size={22} weight="duotone" className="text-[#0A0A0A] flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="font-display font-bold text-[14px] text-[#0A0A0A] block mb-0.5">{title}</strong>
                  <p className="text-[14px] text-[#5C5C52] leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
          <Body>
            O tratamento de dados para finalidades não previstas aqui só ocorrerá com comunicação
            prévia e, quando necessário, novo consentimento seu.
          </Body>
        </Section>

        {/* 5. ARMAZENAMENTO */}
        <Section id="armazenamento" num="05" title="Por quanto tempo guardamos seus dados">
          <Body>
            Seus dados são mantidos enquanto sua conta estiver ativa ou enquanto for necessário para
            prestar o serviço. Ao encerrar a conta, os dados são excluídos ou anonimizados, exceto
            nas hipóteses previstas no art. 16 da LGPD:
          </Body>
          <BulletList items={[
            "Cumprimento de obrigação legal ou regulatória.",
            "Exercício de direito de defesa em processos judiciais ou administrativos.",
            "Determinação de autoridade judicial ou administrativa competente.",
          ]} />

          <div className="overflow-x-auto rounded-2xl border border-[#E0E0D8] my-5">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[#0A0A0A]">
                  {["Tipo de dado", "Prazo de retenção"].map((h) => (
                    <th key={h} className="font-display font-bold text-[11px] tracking-[1.5px] uppercase text-[#9A9A8F] px-4 py-3.5 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["Dados do Reppy Radar (taps, matches, perfil do evento)", "Excluídos em até 48h após o encerramento do evento"],
                  ["Dados de cadastro (nome, e-mail, CPF, telefone)", "Enquanto a conta estiver ativa"],
                  ["Histórico de compras e check-ins", "Enquanto a conta estiver ativa + 5 anos (obrigação legal)"],
                  ["Registros de acesso (IP, data, hora)", "6 meses — conforme art. 15 do Marco Civil da Internet"],
                  ["Dados de transações financeiras", "5 anos — conforme legislação fiscal e do CDC"],
                  ["Dados para defesa em processos legais", "Até o trânsito em julgado da ação"],
                ].map(([tipo, prazo]) => (
                  <tr key={tipo} className="border-t border-[#E0E0D8] hover:bg-[#F0F0EB] transition-colors">
                    <td className="px-4 py-3.5 font-display font-semibold text-[14px] align-top">{tipo}</td>
                    <td className="px-4 py-3.5 text-[14px] text-[#2a2a2a] align-top">{prazo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* 6. SEGURANÇA */}
        <Section id="seguranca" num="06" title="Como protegemos seus dados">
          <Body>
            A Reppy adota medidas técnicas e organizacionais para proteger seus dados contra acesso
            não autorizado, perda, destruição ou vazamento.
          </Body>
          <BulletList items={[
            "Acesso aos dados restrito a colaboradores autorizados, sob compromisso de confidencialidade.",
            "Dados armazenados em ambiente seguro com controle de acesso.",
            "Dados de cartão processados exclusivamente via gateway certificado (PCI-DSS) — a Reppy não armazena o número completo do cartão.",
            "Comunicações protegidas via HTTPS/TLS.",
          ]} />
          <AlertBox>
            Nenhuma plataforma é 100% invulnerável. Em caso de incidente de segurança que possa gerar
            risco ou dano relevante, notificaremos os usuários afetados e a Autoridade Nacional de
            Proteção de Dados (ANPD) conforme exigido pela LGPD.
          </AlertBox>
        </Section>

        {/* 7. COMPARTILHAMENTO */}
        <Section id="compartilhamento" num="07" title="Com quem compartilhamos seus dados" green>
          <Body>
            A Reppy <strong>não vende seus dados</strong> para ninguém. O compartilhamento acontece
            apenas nas situações abaixo:
          </Body>
          <div className="flex flex-col gap-3 mt-4">
            {[
              { title: "Organizadores do evento",       desc: "Nome, e-mail e telefone são compartilhados para validação do ingresso na portaria. O organizador recebe apenas o necessário para confirmar a entrada." },
              { title: "Processadores de pagamento",    desc: "Dados de pagamento são enviados ao gateway (ex: Abacatepay) exclusivamente para processar a transação com segurança." },
              { title: "Plataforma de escrow (Reppy Market)", desc: "No Reppy Market, dados da transação são mantidos pelo parceiro financeiro durante o período de escrow." },
              { title: "Autoridades competentes",       desc: "Mediante determinação judicial, requisição de órgão governamental ou para proteger direitos da Reppy em conflitos legais." },
              { title: "Movimentações societárias",     desc: "Em caso de fusão, aquisição ou incorporação da Reppy, seus dados podem ser transferidos ao novo controlador, que assume as obrigações desta Política." },
            ].map((item) => (
              <div key={item.title} className="bg-[#F0F0EB] border border-[#E0E0D8] rounded-[16px] px-5 py-4">
                <strong className="font-display font-bold text-[14px] text-[#0A0A0A] block mb-1">{item.title}</strong>
                <p className="text-[14px] text-[#5C5C52] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* 8. RADAR */}
        <Section id="radar" num="08" title="Reppy Radar — dados sociais">
          <Body>
            O Reppy Radar envolve o tratamento de dados com lógica própria, por isso merece atenção
            especial nesta Política.
          </Body>
          <div className="bg-[#0A0A0A] rounded-[20px] px-7 py-6 mt-3 mb-5">
            <p className="text-[#F0F0EB] text-[15px] leading-relaxed">
              Os dados do Radar — perfil, foto, taps e matches — são{" "}
              <strong className="text-[#1BFF11]">excluídos automaticamente em até 48 horas após o encerramento do evento</strong>.
              Não existe histórico de interações entre eventos. Cada festa começa do zero.
            </p>
          </div>
          <BulletList items={[
            "O Modo Radar é opt-in — desativado por padrão. Você precisa ativar manualmente para aparecer para outros.",
            "Seu perfil no Radar (foto, nome, Instagram) é visível apenas para quem comprou ingresso do mesmo evento.",
            "O Instagram é opcional — você decide se quer exibir ou não.",
            "Taps são anônimos. A outra pessoa só é notificada se o tap for mútuo (match).",
            "Você pode bloquear qualquer usuário direto do card, sem fricção. O bloqueio é permanente para aquele perfil.",
            "Ao desativar o Modo Radar, você some imediatamente da grade de outros usuários.",
          ]} />
          <Highlight>
            O Reppy Radar exige 18 anos completos. Se identificarmos uso por menores, o acesso à
            funcionalidade é desativado imediatamente.
          </Highlight>
        </Section>

        {/* 9. COOKIES */}
        <Section id="cookies" num="09" title="Cookies">
          <Body>
            Cookies são pequenos arquivos armazenados no seu dispositivo que ajudam a plataforma a
            funcionar corretamente e a personalizar sua experiência.
          </Body>
          <div className="overflow-x-auto rounded-2xl border border-[#E0E0D8] my-5">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[#0A0A0A]">
                  {["Tipo", "Finalidade", "Duração"].map((h) => (
                    <th key={h} className="font-display font-bold text-[11px] tracking-[1.5px] uppercase text-[#9A9A8F] px-4 py-3.5 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["Essenciais",  "Manter sessão ativa, autenticação e segurança",          "Sessão"],
                  ["Funcionais",  "Lembrar preferências (idioma, filtros, cidade)",          "Persistente"],
                  ["Analíticos",  "Entender como os usuários navegam pela plataforma",       "Até 12 meses"],
                ].map(([tipo, fin, dur]) => (
                  <tr key={tipo} className="border-t border-[#E0E0D8] hover:bg-[#F0F0EB] transition-colors">
                    <td className="px-4 py-3.5 font-display font-semibold text-[14px]">{tipo}</td>
                    <td className="px-4 py-3.5 text-[14px] text-[#2a2a2a]">{fin}</td>
                    <td className="px-4 py-3.5 text-[14px] text-[#2a2a2a]">{dur}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Body>
            Você pode alterar as permissões de cookies a qualquer momento nas configurações do seu
            navegador. Desativar cookies essenciais pode impedir o funcionamento correto da plataforma.
          </Body>
        </Section>

        {/* 10. DIREITOS */}
        <Section id="direitos" num="10" title="Seus direitos (LGPD)" green>
          <Body>
            A LGPD garante a você os seguintes direitos sobre seus dados pessoais. Para exercer
            qualquer um deles, basta entrar em contato pelo e-mail listado na seção 14.
          </Body>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            {(
              [
                { Icon: Eye,                   title: "Acesso",        desc: "Confirmar se tratamos seus dados e acessar uma cópia." },
                { Icon: PencilSimple,           title: "Correção",      desc: "Corrigir dados incompletos, inexatos ou desatualizados." },
                { Icon: Trash,                  title: "Exclusão",      desc: "Solicitar a exclusão dos dados tratados com base em consentimento." },
                { Icon: ArrowsDownUp,           title: "Portabilidade", desc: "Receber seus dados em formato estruturado para migrar a outro serviço." },
                { Icon: Prohibit,               title: "Oposição",      desc: "Se opor ao tratamento de dados em determinadas hipóteses." },
                { Icon: ArrowCounterClockwise,  title: "Revogação",     desc: "Revogar o consentimento dado anteriormente, a qualquer tempo." },
                { Icon: Info,                   title: "Informação",    desc: "Saber com quem compartilhamos seus dados e por quê." },
                { Icon: Robot,                  title: "Revisão",       desc: "Solicitar revisão de decisões tomadas de forma automatizada." },
              ] as const
            ).map(({ Icon, title, desc }) => (
              <div key={title} className="flex gap-3 bg-[#F0F0EB] border border-[#E0E0D8] rounded-[16px] px-4 py-4">
                <Icon size={20} weight="duotone" className="text-[#0A0A0A] flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="font-display font-bold text-[13px] text-[#0A0A0A] block mb-0.5">{title}</strong>
                  <p className="text-[13px] text-[#5C5C52] leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
          <Body>
            Atendemos solicitações em até <strong>15 dias úteis</strong>. Respostas sobre dados
            sensíveis (como CPF e transações financeiras) podem exigir verificação de identidade
            antes do processamento.
          </Body>
        </Section>

        {/* 11. MENORES */}
        <Section id="menores" num="11" title="Menores de idade">
          <Body>
            A Reppy permite cadastro a partir dos 16 anos. Usuários entre 16 e 18 anos devem ter
            autorização de seus responsáveis legais para utilizar a plataforma.
          </Body>
          <BulletList items={[
            "O Reppy Radar exige 18 anos completos. Identificado uso por menor, o acesso à funcionalidade é desativado.",
            "Não coletamos dados de menores de 16 anos intencionalmente. Se identificarmos um cadastro nessa situação, a conta é suspensa e os dados excluídos.",
            "Pais ou responsáveis podem solicitar a exclusão de dados de menores sob sua responsabilidade pelo canal de contato listado na seção 14.",
          ]} />
        </Section>

        {/* 12. ALTERAÇÕES */}
        <Section id="alteracoes" num="12" title="Alterações nesta Política">
          <Body>
            Podemos atualizar esta Política a qualquer momento, principalmente para adaptar a
            mudanças na plataforma ou na legislação. Alterações relevantes serão comunicadas por
            notificação dentro do app ou por e-mail com antecedência razoável.
          </Body>
          <Body>
            O uso continuado da plataforma após a publicação de alterações implica na aceitação
            da nova versão. A data de atualização no topo desta página sempre reflete a versão vigente.
          </Body>
        </Section>

        {/* 13. RESPONSABILIDADE */}
        <Section id="responsabilidade" num="13" title="Responsabilidade">
          <Body>
            A Reppy responde pelo tratamento de dados nos termos dos artigos 42 a 45 da LGPD e se
            compromete a manter esta Política atualizada, a adotar medidas técnicas e organizacionais
            adequadas e a seguir eventuais determinações da ANPD.
          </Body>
          <Subsection title="Isenção de responsabilidade">
            <BulletList items={[
              "Consequências decorrentes de negligência do próprio usuário com suas credenciais de acesso.",
              "Ações maliciosas de terceiros (ex: ataques de hackers), exceto se comprovada falha da Reppy.",
              "Informações falsas fornecidas pelo usuário no cadastro — a responsabilidade é inteiramente de quem as inseriu.",
            ]} />
          </Subsection>
        </Section>

        {/* 14. CONTATO */}
        <Section id="contato" num="14" title="Contato e DPO">
          <Body>
            Para exercer seus direitos, tirar dúvidas sobre esta Política ou reportar qualquer
            incidente relacionado aos seus dados, entre em contato com nosso Encarregado de Proteção
            de Dados (DPO):
          </Body>
          <div className="bg-[#F0F0EB] border border-[#E0E0D8] rounded-[20px] px-6 py-5 mt-4 mb-6">
            <p className="font-display font-bold text-[15px] text-[#0A0A0A] mb-1">Encarregado de Proteção de Dados</p>
            <p className="text-[15px] text-[#5C5C52]">
              E-mail:{" "}
              <a href="mailto:privacidade@reppy.app" className="text-[#0FD40A] font-semibold hover:underline">
                privacidade@reppy.app
              </a>
            </p>
            <p className="text-[14px] text-[#9A9A8F] mt-1">Prazo de resposta: até 15 dias úteis</p>
          </div>
          <Body>
            Caso não fique satisfeito com nossa resposta, você pode acionar a{" "}
            <strong>Autoridade Nacional de Proteção de Dados (ANPD)</strong> em{" "}
            <a href="https://www.gov.br/anpd" target="_blank" rel="noopener noreferrer" className="text-[#0FD40A] font-semibold hover:underline">
              gov.br/anpd
            </a>.
          </Body>
        </Section>

        {/* CTA */}
        <section className="mb-16">
          <div className="bg-[#0A0A0A] rounded-[28px] px-10 py-12 text-center relative overflow-hidden">
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-48 pointer-events-none"
              style={{ background: "radial-gradient(ellipse, rgba(27,255,17,0.1) 0%, transparent 70%)" }}
            />
            <h2 className="font-display font-extrabold text-[28px] text-white tracking-[-1px] mb-3 relative">
              Dúvida sobre seus dados?
            </h2>
            <p className="text-[#9A9A8F] text-[15px] mb-7 relative">
              Fala com a gente. Respondemos em até 15 dias úteis.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 relative">
              <a
                href="mailto:privacidade@reppy.app"
                className="inline-flex items-center gap-2 bg-[#1BFF11] hover:bg-[#0FD40A] text-[#0A0A0A] font-display font-bold text-[15px] px-7 py-3.5 rounded-full transition-all hover:-translate-y-0.5"
              >
                <Lock size={16} weight="bold" />
                privacidade@reppy.app
              </a>
              <a
                href="/termos-de-uso"
                className="inline-flex items-center gap-2 border border-[#2a2a2a] hover:border-[#5C5C52] text-[#9A9A8F] hover:text-white font-display font-bold text-[15px] px-7 py-3.5 rounded-full transition-all"
              >
                Ver Termos de Uso
                <ArrowRight size={15} weight="bold" />
              </a>
            </div>
          </div>
        </section>

      </main>


    </div>
  );
}

/* ── Sub-components ── */

function Section({
  id, num, title, green = false, children,
}: {
  id: string;
  num: string;
  title: string;
  green?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mb-16 scroll-mt-20">
      <div className="flex items-center gap-4 mb-7 pb-5 border-b border-[#E0E0D8]">
        <span
          className={`font-display font-bold text-[11px] tracking-[2px] uppercase px-2.5 py-1.5 rounded-lg flex-shrink-0 ${
            green ? "bg-[#1BFF11] text-[#0A0A0A]" : "bg-[#0A0A0A] text-white"
          }`}
        >
          {num}
        </span>
        <h2 className="font-display font-extrabold text-[24px] tracking-[-0.5px] text-[#0A0A0A]">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

function Subsection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-7">
      <h3 className="font-display font-bold text-[16px] text-[#0A0A0A] mb-3 flex items-center gap-2">
        <span className="inline-block w-1 h-4 bg-[#1BFF11] rounded-sm flex-shrink-0" />
        {title}
      </h3>
      {children}
    </div>
  );
}

function Body({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[15px] text-[#2a2a2a] leading-[1.75] mb-4 last:mb-0">{children}</p>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-2.5 my-4">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5 text-[15px] text-[#2a2a2a] leading-relaxed">
          <ArrowRight size={14} weight="bold" className="text-[#0FD40A] flex-shrink-0 mt-1" />
          {item}
        </li>
      ))}
    </ul>
  );
}

function Highlight({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#1BFF11]/8 border-l-[3px] border-[#1BFF11] rounded-r-2xl px-5 py-4 my-5 text-[14px] text-[#5C5C52] italic">
      {children}
    </div>
  );
}

function AlertBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#FF2D2D]/6 border-l-[3px] border-[#FF2D2D] rounded-r-2xl px-5 py-4 my-5 text-[14px] text-[#5a1010]">
      {children}
    </div>
  );
}