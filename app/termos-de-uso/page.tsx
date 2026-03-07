export default function TermosDeUso() {
  return (
    <div className="min-h-screen bg-[#F7F7F2] text-[#0A0A0A]">

 

      {/* HERO */}
      <section className="bg-[#0A0A0A] px-8 pt-20 pb-16 relative overflow-hidden">
        <div
          className="absolute -top-16 -right-16 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(27,255,17,0.12) 0%, transparent 70%)" }}
        />
        <div className="max-w-3xl mx-auto relative">
    
          <h1 className="font-display font-extrabold text-[clamp(40px,6vw,64px)] text-white leading-[0.95] tracking-[-2px] mb-5">
            Termos<br />de <span className="text-[#1BFF11]">Uso</span>
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
              "A Reppy conecta universitários a eventos — somos o canal de venda, não o organizador.",
              "O Reppy Radar é anônimo até o match mútuo. Seus dados somem até 48h após o evento.",
              "No Reppy Market, o dinheiro fica em escrow e só vai pro vendedor após confirmação de entrada.",
              "O ingresso revendido sempre custa menos que o lote atual em venda. Sem exceção.",
              "Problemas no evento (segurança, cancelamento, alvarás) são responsabilidade do organizador.",
              "Sua taxa de serviço aparece sempre antes de você confirmar a compra.",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-[#F0F0EB] text-[15px] leading-relaxed">
                <span className="text-[#1BFF11] font-display font-bold text-sm flex-shrink-0 mt-0.5">✓</span>
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
            { num: "01", label: "Glossário", href: "#glossario" },
            { num: "02", label: "A plataforma", href: "#plataforma" },
            { num: "03", label: "Acesso e uso", href: "#acesso" },
            { num: "04", label: "Propriedade intelectual", href: "#propriedade" },
            { num: "05", label: "Organizadores", href: "#organizador" },
            { num: "06", label: "Compradores", href: "#comprador" },
            { num: "07", label: "Responsabilidades", href: "#reppy" },
            { num: "08", label: "Pagamento e taxas", href: "#pagamento" },
            { num: "09", label: "Reppy Market", href: "#market" },
            { num: "10", label: "Reppy Radar", href: "#radar" },
            { num: "11", label: "Reppy Ranks", href: "#ranks" },
            { num: "12", label: "Cancelamento", href: "#cancelamento" },
            { num: "13", label: "Privacidade e LGPD", href: "#privacidade" },
            { num: "14", label: "Penalidades", href: "#penalidades" },
            { num: "15", label: "Alterações", href: "#alteracoes" },
            { num: "16", label: "Foro e legislação", href: "#foro" },
            { num: "17", label: "Contato", href: "#contato" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="flex items-center gap-2.5 px-4 py-3 bg-[#F0F0EB] hover:bg-[#E0E0D8] border border-transparent hover:-translate-y-px rounded-2xl text-[#0A0A0A] font-display text-[13px] font-semibold transition-all"
            >
              <span className="text-[11px] font-bold text-[#9A9A8F] min-w-[20px]">{item.num}</span>
              {item.label}
            </a>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <main className="max-w-3xl mx-auto px-8 pb-32">

        {/* 1. GLOSSÁRIO */}
        <Section id="glossario" num="01" title="Glossário">
          <p className="text-[15px] text-[#2a2a2a] leading-[1.75] mb-5">
            Antes de tudo, alinhando os termos que aparecem por aqui:
          </p>
          <div className="overflow-x-auto rounded-2xl border border-[#E0E0D8]">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[#0A0A0A]">
                  <th className="font-display font-bold text-[11px] tracking-[1.5px] uppercase text-[#9A9A8F] px-4 py-3.5 text-left">Termo</th>
                  <th className="font-display font-bold text-[11px] tracking-[1.5px] uppercase text-[#9A9A8F] px-4 py-3.5 text-left">Significado</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Usuário", "Qualquer pessoa que acesse ou utilize a plataforma Reppy, seja por app ou web."],
                  ["Comprador", "Usuário que adquire ingressos para eventos na plataforma."],
                  ["Organizador", "Pessoa física ou jurídica (república, produtora, entidade) que cria e vende eventos pela Reppy."],
                  ["Reppy", "A empresa Reppy, gestora da plataforma e do marketplace de ingressos."],
                  ["Reppy Market", "Marketplace secundário onde usuários revendem ingressos que já compraram."],
                  ["Reppy Radar", "Funcionalidade social que permite ver quem mais comprou ingresso pro mesmo evento."],
                  ["Reppy Ranks", "Sistema de progressão baseado em festas confirmadas via check-in."],
                  ["Tap", "Ação discreta de interesse em outro usuário dentro do Reppy Radar."],
                  ["Match", "Quando dois usuários dão tap um no outro simultaneamente."],
                  ["Escrow", "Retenção temporária do valor pago pelo comprador até a confirmação de entrada no evento."],
                  ["Check-in", "Validação do ingresso na portaria do evento via QR Code."],
                ].map(([term, def]) => (
                  <tr key={term} className="border-t border-[#E0E0D8] hover:bg-[#F0F0EB] transition-colors">
                    <td className="px-4 py-3.5 font-display font-semibold text-[14px] align-top">{term}</td>
                    <td className="px-4 py-3.5 text-[14px] text-[#2a2a2a] align-top">{def}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* 2. PLATAFORMA */}
        <Section id="plataforma" num="02" title="A plataforma Reppy">
          <Body>
            A Reppy é um app de festas e experiências universitárias. Nosso papel é conectar universitários
            a eventos, repúblicas, bares e à vida social acadêmica — funcionando como o hub da vida social
            universitária brasileira.
          </Body>
          <Body>
            A Reppy é uma <strong>intermediadora</strong>. Funcionamos como um canal de venda entre
            organizadores e compradores. Não organizamos, produzimos, contratamos artistas, obtemos alvarás
            ou nos responsabilizamos por nenhum aspecto da realização dos eventos listados na plataforma.
            Essa responsabilidade é inteiramente do organizador.
          </Body>
          <Highlight>
            Comprando um ingresso pela Reppy, você está comprando diretamente do organizador do evento.
            A Reppy facilita a transação — não é a organizadora da festa.
          </Highlight>
        </Section>

        {/* 3. ACESSO */}
        <Section id="acesso" num="03" title="Acesso e uso">
          <Body>
            Para acessar eventos e a página pública da plataforma, nenhum cadastro é necessário. Para
            comprar ingressos ou criar eventos, você precisará de uma conta com: nome completo, e-mail,
            CPF, data de nascimento e telefone.
          </Body>
          <Body>
            O cadastro é permitido a partir dos <strong>16 anos</strong>. Usuários entre 16 e 18 anos
            devem ter autorização de seus responsáveis legais. O Reppy Radar exige 18 anos completos.
          </Body>
          <Subsection title="Proibido na plataforma">
            <BulletList items={[
              "Criar eventos ilegais, discriminatórios ou que violem direitos de terceiros.",
              "Tentar revender ingressos fora do Reppy Market ou burlar o preço máximo.",
              "Criar perfis falsos ou usar dados de terceiros sem autorização.",
              "Enviar spam, vírus ou tentar ataques de qualquer tipo ao sistema.",
              "Reproduzir conteúdo da plataforma sem autorização expressa da Reppy.",
            ]} />
          </Subsection>
        </Section>

        {/* 4. PROPRIEDADE INTELECTUAL */}
        <Section id="propriedade" num="04" title="Propriedade intelectual">
          <Body>
            A marca Reppy, o logotipo, o design da plataforma, os textos, os sistemas e todos os elementos
            da interface são protegidos pela Lei de Propriedade Industrial (Lei nº 9.279/96) e pela Lei de
            Direitos Autorais (Lei nº 9.610/98).
          </Body>
          <Body>
            O uso da plataforma não transfere ao usuário ou organizador nenhum direito de propriedade
            intelectual. O acesso é pessoal, individual e intransferível.
          </Body>
        </Section>

        {/* 5. ORGANIZADORES */}
        <Section id="organizador" num="05" title="Responsabilidades dos organizadores" green>
          <Body>
            Ao publicar um evento na Reppy, o organizador assume integralmente as obrigações abaixo:
          </Body>
          <Subsection title="Sobre o evento">
            <BulletList items={[
              "Responsabilidade total pelo evento: segurança, alvarás, licenças, capacidade do local, contratação de profissionais e cumprimento de legislação municipal, estadual e federal.",
              "Publicar informações completas e verídicas: local, data, horário, valores, atrações, restrição de faixa etária e política de cancelamento.",
              "Eventos com 'local a definir' devem ter o local confirmado com no mínimo 7 dias de antecedência. Caso contrário, a Reppy pode suspender ou remover o evento.",
              "Comunicar cancelamentos e adiamentos diretamente aos compradores com a maior antecedência possível.",
            ]} />
          </Subsection>
          <Subsection title="Sobre vendas e taxas">
            <BulletList items={[
              "O organizador aceita a estrutura de taxas vigente antes de publicar o evento. A taxa aparece explicitamente no dashboard antes de qualquer publicação.",
              "O repasse dos valores arrecadados é realizado conforme o cronograma da plataforma, após dedução da taxa de serviço.",
              "Em caso de chargeback solicitado pelo comprador por problemas no evento, o valor é estornado ao comprador e descontado do repasse ao organizador.",
              "O organizador pode ativar ou desativar o Reppy Market para seu evento a qualquer momento antes do início das vendas secundárias.",
            ]} />
          </Subsection>
          <Subsection title="Sobre o conteúdo publicado">
            <BulletList items={[
              "É vedado publicar eventos com conteúdo ilegal, racista, discriminatório, ameaçador ou que incite ódio.",
              "O organizador garante que possui todos os direitos e autorizações necessárias sobre o conteúdo publicado (músicas, imagens, marcas de terceiros).",
              "Variações de lote (preço e quantidade) são de responsabilidade do organizador. A Reppy não intervém nessa definição.",
            ]} />
          </Subsection>
          <Highlight>
            A Reppy fornece o app de leitura de QR Code para a portaria. É responsabilidade do organizador
            contratar profissional habilitado para operá-lo.
          </Highlight>
        </Section>

        {/* 6. COMPRADORES */}
        <Section id="comprador" num="06" title="Responsabilidades dos compradores">
          <Body>Ao comprar um ingresso pela Reppy, você confirma que:</Body>
          <BulletList items={[
            "Tem pelo menos 16 anos (ou 18 anos para funcionalidades sociais).",
            "As informações fornecidas no cadastro são verdadeiras.",
            "Está ciente de que a Reppy é intermediadora — problemas relacionados ao evento em si devem ser tratados com o organizador.",
            "Autoriza a Reppy a compartilhar seus dados necessários com o organizador para fins de validação do ingresso.",
            "Entende que a transferência do ingresso a terceiros só é permitida pelo Reppy Market, conforme as regras descritas na seção 9.",
          ]} />
        </Section>

        {/* 7. RESPONSABILIDADES DA REPPY */}
        <Section id="reppy" num="07" title="Responsabilidades da Reppy">
          <Body>A Reppy se responsabiliza por:</Body>
          <BulletList items={[
            "Manter a infraestrutura técnica da plataforma funcionando e disponível.",
            "Processar pagamentos com segurança, diretamente ou via parceiros (ex: Abacatepay).",
            "Emitir e validar os QR Codes dos ingressos.",
            "Garantir que a taxa cobrada seja exibida ao organizador antes da publicação e ao comprador antes da confirmação.",
            "Executar a lógica do escrow no Reppy Market conforme descrito na seção 9.",
            "Realizar o estorno integral ao comprador em caso de cancelamento do evento pelo organizador.",
          ]} />
          <AlertBox>
            <strong>A Reppy não se responsabiliza por:</strong> cancelamento ou alteração de eventos pelo
            organizador, qualidade do evento, segurança no local, conteúdo publicado pelos organizadores,
            ou problemas decorrentes de links externos presentes nas páginas de eventos.
          </AlertBox>
        </Section>

        {/* 8. PAGAMENTO */}
        <Section id="pagamento" num="08" title="Pagamento e taxas" green>
          <Body>
            A Reppy cobra uma taxa de serviço sobre cada ingresso vendido. Essa taxa é cobrada do
            organizador — <strong>o comprador nunca paga taxa extra</strong> além do valor do ingresso.
          </Body>
          <Subsection title="Estrutura de taxas">
            <div className="overflow-x-auto rounded-2xl border border-[#E0E0D8] mt-3">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[#0A0A0A]">
                    {["Faixa de preço", "Taxa permanente", "Quem paga"].map((h) => (
                      <th key={h} className="font-display font-bold text-[11px] tracking-[1.5px] uppercase text-[#9A9A8F] px-4 py-3.5 text-left">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Até R$10", "10%", "Organizador Escolhe"],
                    ["R$11 – R$14", "8%", "Organizador Escolhe"],
                    ["R$15 ou mais", "7%", "Organizador Escolhe"],
                  ].map(([faixa, taxa, quem]) => (
                    <tr key={faixa} className="border-t border-[#E0E0D8] hover:bg-[#F0F0EB] transition-colors">
                      <td className="px-4 py-3.5 font-display font-semibold text-[14px]">{faixa}</td>
                      <td className="px-4 py-3.5 text-[14px] text-[#2a2a2a]">{taxa}</td>
                      <td className="px-4 py-3.5 text-[14px] text-[#2a2a2a]">{quem}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Subsection>
          <Body>
            Eventos estratégicos selecionados pela Reppy podem receber <strong>taxa promocional</strong>{" "}
            temporária (entre 4% e 6%). A taxa exata é exibida no dashboard antes da publicação. Após o
            período promocional, o evento migra automaticamente para a taxa permanente. A transição é
            comunicada ao organizador com aviso prévio de pelo menos 15 dias dentro da plataforma.
          </Body>
          <Subsection title="Formas de pagamento">
            <Body>
              Cartão de crédito e Pix. O pagamento via Pix deve ser confirmado em até 30 minutos após a
              geração do código, caso contrário a reserva é cancelada automaticamente.
            </Body>
          </Subsection>
        </Section>

        {/* 9. REPPY MARKET */}
        <Section id="market" num="09" title="Reppy Market" green>
          <Body>
            O Reppy Market é o marketplace oficial de revenda de ingressos dentro da plataforma. É a
            única forma autorizada de transferir um ingresso para outra pessoa.
          </Body>
          <Subsection title="Regra central do preço">
            <div className="bg-[#0A0A0A] rounded-[20px] px-7 py-6 mt-3">
              <p className="text-[#F0F0EB] text-[15px] leading-relaxed">
                O ingresso revendido precisa obrigatoriamente custar{" "}
                <strong className="text-[#1BFF11]">menos que o preço do lote atual em venda</strong>. Se o
                lote atual está R$40, o valor máximo de revenda é R$39. O sistema bloqueia automaticamente
                qualquer tentativa de ultrapassar esse limite. Sem exceção.
              </p>
            </div>
          </Subsection>
          <Subsection title="Escrow — como funciona o dinheiro">
            <Body>
              O valor pago pelo comprador fica retido na plataforma (escrow) até a confirmação de entrada
              do comprador no evento. O vendedor não recebe antes disso.
            </Body>
            <div className="overflow-x-auto rounded-2xl border border-[#E0E0D8] mt-3">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[#0A0A0A]">
                    {["Situação", "O que acontece"].map((h) => (
                      <th key={h} className="font-display font-bold text-[11px] tracking-[1.5px] uppercase text-[#9A9A8F] px-4 py-3.5 text-left">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Comprador entra na festa (check-in)", "Pix liberado pro vendedor automaticamente"],
                    ["Comprador não aparece", "Pix liberado pro vendedor 24h após o fim do evento"],
                    ["Evento cancelado pelo organizador", "Estorno integral pro comprador"],
                  ].map(([sit, acao]) => (
                    <tr key={sit} className="border-t border-[#E0E0D8] hover:bg-[#F0F0EB] transition-colors">
                      <td className="px-4 py-3.5 font-display font-semibold text-[14px] align-top">{sit}</td>
                      <td className="px-4 py-3.5 text-[14px] text-[#2a2a2a] align-top">{acao}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Subsection>
          <Subsection title="Taxa do Reppy Market">
            <Body>
              O vendedor não paga taxa adicional. O comprador paga uma taxa sobre o valor da revenda
              (R$0.80), já embutida no preço exibido. A taxa exata é sempre mostrada antes de
              confirmar a listagem.
            </Body>
          </Subsection>
          <Subsection title="Transferência do ingresso">
            <BulletList items={[
              "Assim que o pagamento é confirmado, o ingresso é transferido automaticamente para o nome do comprador.",
              "O QR Code antigo do vendedor é invalidado imediatamente.",
              "Um novo QR Code é gerado vinculado ao CPF do comprador.",
              "O organizador vê o nome atualizado na portaria — sem ambiguidade.",
            ]} />
          </Subsection>
          <Subsection title="Regras para o vendedor">
            <BulletList items={[
              "Só podem ser listados ingressos comprados diretamente na plataforma Reppy.",
              "Cada ingresso só pode ser listado uma vez — sem listagem duplicada.",
              "Ingressos de eventos já encerrados não podem ser listados.",
              "Tentar burlar o limite de preço configura violação dos termos e pode resultar em suspensão da conta.",
            ]} />
          </Subsection>
          <Highlight>
            Se o organizador desativar o Reppy Market para o evento dele, o card some da página do evento
            e nenhuma revenda é possível.
          </Highlight>
        </Section>

        {/* 10. REPPY RADAR */}
        <Section id="radar" num="10" title="Reppy Radar">
          <Body>
            O Reppy Radar é uma funcionalidade social desbloqueada após a compra do ingresso. Permite ver
            quem mais vai no mesmo evento e dar taps discretos de interesse. Não é um app de
            relacionamento — é contexto social com hora marcada.
          </Body>
          <Subsection title="Anonimato e privacidade">
            <BulletList items={[
              "O tap é anônimo — a pessoa não é notificada quando você tapa nela.",
              "A notificação só acontece em caso de match mútuo (os dois taparam um no outro).",
              "A Reppy não garante que a outra pessoa vá responder ou que o match aconteça.",
              "O perfil no Radar exibe apenas: foto, primeiro nome e Instagram (opcional). Nenhuma outra informação é compartilhada.",
              "Os dados do Radar são visíveis apenas para quem comprou ingresso do mesmo evento.",
            ]} />
          </Subsection>
          <Subsection title="Modo Radar — opt-in">
            <Body>
              O Modo Radar é desativado por padrão. Para aparecer na lista de outros usuários, é
              necessário ativá-lo manualmente no ingresso. Quem não ativa pode ver os outros, mas não
              aparece para ninguém.
            </Body>
          </Subsection>
          <Subsection title='Retenção de dados — "tudo some depois da festa"'>
            <div className="bg-[#0A0A0A] rounded-[20px] px-7 py-6 mt-3">
              <p className="text-[#F0F0EB] text-[15px] leading-relaxed">
                Os dados do Reppy Radar — perfis, taps e matches — são{" "}
                <strong className="text-[#1BFF11]">
                  excluídos automaticamente em até 48 horas após o encerramento do evento
                </strong>
                . Após esse prazo, nenhuma informação sobre quem participou do Radar do evento é mantida
                na plataforma.
              </p>
            </div>
          </Subsection>
          <Subsection title="Proteções contra assédio">
            <BulletList items={[
              "O tap nunca gera notificação unilateral — apenas o match mútuo notifica ambos.",
              "Bloqueio disponível direto do card de qualquer usuário, sem fricção.",
              "Usuário bloqueado desaparece permanentemente do Radar para quem bloqueou.",
              "O uso do Radar exige 18 anos completos.",
            ]} />
          </Subsection>
          <Body>
            A Reppy não realiza verificação de antecedentes dos usuários. Toda interação social entre
            usuários é de responsabilidade dos próprios usuários. Encontros pessoais decorrentes do Radar
            ocorrem por conta e risco dos envolvidos.
          </Body>
        </Section>

        {/* 11. REPPY RANKS */}
        <Section id="ranks" num="11" title="Reppy Ranks">
          <Body>
            O Reppy Ranks é o sistema de progressão baseado em festas confirmadas via check-in. Quanto
            mais rolês você for usando a Reppy, maior o seu rank.
          </Body>
          <div className="overflow-x-auto rounded-2xl border border-[#E0E0D8] my-5">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[#0A0A0A]">
                  {["Nível", "Nome", "Rolês", "Visibilidade"].map((h) => (
                    <th key={h} className="font-display font-bold text-[11px] tracking-[1.5px] uppercase text-[#9A9A8F] px-4 py-3.5 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["1", "Bixo", "1–4", "Só você vê"],
                  ["2", "Iniciante", "5–9", "Só você vê"],
                  ["3", "Veterano", "10–17", "Público no perfil e Radar"],
                  ["4", "Veterano+", "18–29", "Público no perfil e Radar"],
                  ["5", "Veterano Mor", "30+", "Público no perfil e Radar"],
                ].map(([nivel, nome, roles, vis]) => (
                  <tr key={nivel} className="border-t border-[#E0E0D8] hover:bg-[#F0F0EB] transition-colors">
                    <td className="px-4 py-3.5 font-display font-semibold text-[14px]">{nivel}</td>
                    <td className="px-4 py-3.5 font-display font-semibold text-[14px]">{nome}</td>
                    <td className="px-4 py-3.5 text-[14px] text-[#2a2a2a]">{roles}</td>
                    <td className="px-4 py-3.5 text-[14px] text-[#2a2a2a]">{vis}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Subsection title="Regras do rank">
            <BulletList items={[
              "Só contam festas confirmadas via check-in na portaria — comprar e não ir não conta.",
              "Ingressos recebidos via Reppy Market não contam pro rank de quem recebeu.",
              "O rank nunca regride, mesmo com conta inativa.",
              "O rank não é transferível entre contas.",
              "A Reppy se reserva o direito de ajustar os critérios e limiares de cada nível com aviso prévio de pelo menos 15 dias dentro da plataforma.",
            ]} />
          </Subsection>
        </Section>

        {/* 12. CANCELAMENTO */}
        <Section id="cancelamento" num="12" title="Cancelamento e reembolso" green>
          <Body>
            A política de cancelamento é definida pelo organizador no momento da criação do evento.
            Existem três opções:
          </Body>
          <div className="flex flex-col gap-3 my-5">
            {[
              {
                label: "Opção A — Cancelamento dentro de 7 dias e até 48h antes",
                desc: "O comprador pode cancelar dentro de 7 dias corridos após a compra E com mais de 48h de antecedência do evento. Fora desse prazo, é necessário contato direto com o organizador.",
              },
              {
                label: "Opção B — Cancelamento até a data do evento",
                desc: "O comprador pode cancelar a qualquer momento antes do evento. Após a data, é necessário contato com o organizador.",
              },
              {
                label: "Opção C — Apenas via organizador",
                desc: "Todo cancelamento deve ser tratado diretamente com o organizador do evento.",
              },
            ].map((opt) => (
              <div key={opt.label} className="bg-[#F0F0EB] border border-[#E0E0D8] rounded-[20px] px-7 py-5">
                <strong className="font-display font-bold text-[15px] block mb-2">{opt.label}</strong>
                <p className="text-[15px] text-[#2a2a2a] leading-relaxed">{opt.desc}</p>
              </div>
            ))}
          </div>
          <Subsection title="Direito de arrependimento (CDC)">
            <Body>
              De acordo com o art. 49 do Código de Defesa do Consumidor (Lei 8.078/1990), compras
              realizadas fora do estabelecimento comercial — como pela internet — garantem ao consumidor
              o direito de arrependimento em até 7 dias corridos após a compra, com reembolso integral.
              Esse direito prevalece sobre qualquer política de cancelamento escolhida pelo organizador.
            </Body>
          </Subsection>
          <Subsection title="Cancelamento do evento pelo organizador">
            <Body>
              Se o evento for cancelado pelo organizador, todos os compradores recebem reembolso integral
              automaticamente, incluindo casos de ingressos revendidos via Reppy Market.
            </Body>
          </Subsection>
        </Section>

        {/* 13. PRIVACIDADE */}
        <Section id="privacidade" num="13" title="Privacidade e LGPD">
          <Body>
            A Reppy trata seus dados pessoais em conformidade com a Lei Geral de Proteção de Dados
            (Lei nº 13.709/2018 — LGPD).
          </Body>
          <Subsection title="Dados coletados e uso">
            <BulletList items={[
              "Dados de cadastro (nome, CPF, e-mail, telefone) são usados para identificação e processamento de pagamentos.",
              "Dados do Reppy Radar (foto, primeiro nome, Instagram) são compartilhados apenas com compradores do mesmo evento e excluídos em até 48h após o encerramento do evento.",
              "Dados de compra são compartilhados com o organizador do evento para fins de validação de ingresso.",
            ]} />
          </Subsection>
          <Subsection title="Seus direitos">
            <BulletList items={[
              "Solicitar acesso, correção ou exclusão dos seus dados a qualquer momento.",
              "Revogar o consentimento para uso de dados não essenciais.",
              "Solicitar a portabilidade dos seus dados.",
            ]} />
            <Body>
              Para exercer seus direitos, entre em contato pelo e-mail listado na seção 17.
            </Body>
          </Subsection>
          <Body>
            Para mais detalhes sobre como tratamos seus dados, consulte nossa{" "}
            <a href="/privacidade" className="text-[#0FD40A] font-semibold hover:underline">
              Política de Privacidade
            </a>
            .
          </Body>
        </Section>

        {/* 14. PENALIDADES */}
        <Section id="penalidades" num="14" title="Penalidades">
          <Body>
            A Reppy pode, a qualquer momento e a seu critério, advertir, suspender temporariamente ou
            banir permanentemente qualquer usuário ou organizador que:
          </Body>
          <BulletList items={[
            "Violar qualquer cláusula destes termos.",
            "Tentar burlar o preço máximo do Reppy Market.",
            "Criar eventos com conteúdo ilegal, discriminatório ou enganoso.",
            "Publicar informações falsas no cadastro ou nas páginas de eventos.",
            "Realizar qualquer ação fraudulenta envolvendo ingressos, pagamentos ou identidade de terceiros.",
            "Assediar ou ameaçar outros usuários dentro ou fora da plataforma.",
          ]} />
          <Body>
            A Reppy também pode cancelar qualquer transação que identifique como suspeita ou fraudulenta,
            a seu critério exclusivo.
          </Body>
        </Section>

        {/* 15. ALTERAÇÕES */}
        <Section id="alteracoes" num="15" title="Alterações nos termos">
          <Body>
            A Reppy pode atualizar estes termos a qualquer momento. Alterações relevantes — especialmente
            em taxas — serão comunicadas ao organizador com aviso prévio por escrito dentro da plataforma.
          </Body>
          <Body>
            Para mudança de taxa promocional para permanente, o aviso será dado com pelo menos 15 dias de
            antecedência.
          </Body>
          <Body>
            O uso continuado da plataforma após a publicação de novos termos implica na aceitação das
            alterações. Se você não concordar com os novos termos, deve encerrar sua conta e interromper
            o uso da plataforma.
          </Body>
        </Section>

        {/* 16. FORO */}
        <Section id="foro" num="16" title="Foro e legislação aplicável">
          <Body>
            Estes termos são regidos pelas leis da República Federativa do Brasil. Em caso de conflito,
            fica eleito o foro da comarca de <strong>[cidade-sede da Reppy]</strong>, com renúncia
            expressa a qualquer outro, por mais privilegiado que seja.
          </Body>
          <Body>
            A relação entre a Reppy e os usuários é regulada, especialmente, pelo Código de Defesa do
            Consumidor (Lei 8.078/1990), pelo Marco Civil da Internet (Lei 12.965/2014) e pela Lei Geral
            de Proteção de Dados (Lei 13.709/2018).
          </Body>
        </Section>

        {/* 17. CONTATO */}
        <section id="contato" className="scroll-mt-20 mb-16">
          <div className="bg-[#0A0A0A] rounded-[28px] px-10 py-12 text-center relative overflow-hidden">
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-48 pointer-events-none"
              style={{ background: "radial-gradient(ellipse, rgba(27,255,17,0.1) 0%, transparent 70%)" }}
            />
            <h2 className="font-display font-extrabold text-[28px] text-white tracking-[-1px] mb-3 relative">
              Ainda com dúvida?
            </h2>
            <p className="text-[#9A9A8F] text-[15px] mb-7 relative">
              Fala com a gente. A resposta vem rápido.
            </p>
            <a
              href="mailto:oi@reppy.app"
              className="relative inline-flex items-center gap-2 bg-[#1BFF11] hover:bg-[#0FD40A] text-[#0A0A0A] font-display font-bold text-[15px] px-7 py-3.5 rounded-full transition-all hover:-translate-y-0.5"
            >
              ✉ oi@reppy.app
            </a>
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
            green
              ? "bg-[#1BFF11] text-[#0A0A0A]"
              : "bg-[#0A0A0A] text-white"
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
          <span className="text-[#0FD40A] font-bold flex-shrink-0 mt-0.5">→</span>
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