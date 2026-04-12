<!DOCTYPE html>
<html lang="pt-BR">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Biblioteca Mahal</title>
  <link rel="shortcut icon" href="/assets/img/logos/logo-bilbioteca.png" type="image/x-icon">

  <!-- Fonte + Ícones -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

  <!-- CSS PADRÃO (paths ABSOLUTOS para funcionar com /biblioteca e .htaccess) -->

  <link rel="stylesheet" href="/assets/css/oferta.css" />
  <link rel="stylesheet" href="/assets/css/biblioteca.css" />
  <link rel="stylesheet" href="/assets/css/base.css" />
  <link rel="stylesheet" href="/assets/css/section.css" />
  <link rel="stylesheet" href="/assets/css/section_oferta.css" />

</head>

<body>

  <div class="main page" id="page">

    <!-- SEÇÃO DESTAQUE -->
    <!-- SEÇÃO BANNER HOME -->
    <section class="home-hero" id="inicio">
      <div class="home-hero__bg" aria-hidden="true"></div>

      <div class="home-hero__grid">

        <!-- LADO ESQUERDO: TEXTO + CONSOLE -->
        <div class="home-hero__content">
          <div class="home-hero__badge">
            <span class="pulse"></span>
            <span>Biblioteca Mahal</span>
          </div>

          <h1 class="home-hero__title">
            Biblioteca
            <span class="glow">Open-Source</span>
          </h1>

          <p class="home-hero__subtitle">
            Uma plataforma de aulas construída, versionada e evoluída pela própria comunidade.
            Aqui você não consome conteúdo. Você participa do código.
          </p>

          <div class="home-hero__actions">
            <a class="home-btn primary" href="/login">
              <i class="fa-solid fa-brain"></i> Acessar Biblioteca
            </a>

            <a class="home-btn ghost" href="https://pay.mahal.pro/ticket-founder/a/cupomtemporario">
              <i class="fa-solid fa-ticket"></i> Garantir Ticket Founder!
            </a>

            <a class="home-btn ghost" href="https://api.whatsapp.com/send/?phone=5511958379385&text&type=phone_number&app_absent=0">
              <i class="fa-solid fa-bolt"></i> Suporte
            </a>
          </div>

          <!-- Console -->
          <div class="home-console" aria-label="Console de status">
            <div class="home-console__top">
              <span class="dot r"></span>
              <span class="dot y"></span>
              <span class="dot g"></span>
              <strong>biblioteca-mahal://boot</strong>
              <span class="tag">online</span>
            </div>

            <div class="home-console__body" id="homeConsole">
              <div class="line"><span class="k">[OK]</span> kernel iniciado</div>
              <div class="line"><span class="k">[SYNC]</span> comunidade conectada</div>
              <div class="line"><span class="k">[OK]</span> módulos carregados: Infra, IA, SaaS</div>
              <div class="line"><span class="k">[BUILD]</span> novas aulas sendo versionadas</div>
              <div class="line"><span class="k">[RUN]</span> aguardando próxima missão...</div>
            </div>
          </div>

          <!-- Mini chips -->
          <div class="home-hero__chips">
            <span class="chip"><i class="fa-solid fa-diagram-project"></i> Infra</span>
            <span class="chip"><i class="fa-solid fa-server"></i> Deploy</span>
            <span class="chip"><i class="fa-solid fa-database"></i> Banco & Auth</span>
            <span class="chip"><i class="fa-solid fa-robot"></i> Agentes</span>
          </div>
        </div>

        <!-- LADO DIREITO: CARD MAPA -->
        <div class="home-hero__media" data-tilt>
          <div class="home-mapCard">
            <div class="home-mapCard__top">
              <div class="chipIcon"></div>
              <div>
                <strong>Mapa de Evolução</strong>
                <span>do zero ao sistema</span>
              </div>
            </div>

            <div class="home-mapCard__steps">
              <div class="step">
                <span class="n">01</span>
                <div class="c">
                  <strong>Arquitetar</strong>
                  <span>stack, auth e banco</span>
                </div>
              </div>

              <div class="step">
                <span class="n">02</span>
                <div class="c">
                  <strong>Integrar LLM</strong>
                  <span>prompts, funções, guardrails</span>
                </div>
              </div>

              <div class="step">
                <span class="n">03</span>
                <div class="c">
                  <strong>Dar contexto</strong>
                  <span>RAG, embeddings, histórico</span>
                </div>
              </div>

              <div class="step">
                <span class="n">04</span>
                <div class="c">
                  <strong>Produção</strong>
                  <span>Docker, VPS, métricas, billing</span>
                </div>
              </div>
            </div>

            <div class="home-mapCard__footer">
              <div class="meter">
                <span>Progresso do sistema</span>
                <div class="bar"><i></i></div>
              </div>

              <a class="miniLink" href="/login">
                Acessar agora <i class="fa-solid fa-arrow-right"></i>
              </a>
            </div>

            <div class="home-mapCard__thumb" aria-hidden="true"></div>
          </div>
        </div>

      </div>
    </section>

    <!-- ENTRE "HERO" e "AULAS" (sem oferta, só explicação de valor) -->
    <section id="como-funciona" class="how">
      <div class="how__wrap">

        <header class="how__head">
          <span class="how__kicker">
            <span class="how__dot" aria-hidden="true"></span>
            Como funciona a Biblioteca Open-Source
          </span>

          <h2 class="how__title">As aulas não são soltas. Elas formam um sistema em produção.</h2>

          <p class="how__subtitle">
            Você aprende seguindo uma lógica de construção: cada módulo vira uma peça real do seu projeto.
            No final, você não “termina um curso”. Você termina com um sistema publicado — com IA, stack e deploy.
          </p>
        </header>

        <div class="how__grid">

          <!-- Coluna esquerda: pilares -->
          <div class="how__cards" aria-label="Pilares da Biblioteca Mahal">
            <article class="howCard">
              <div class="howCard__icon"><i class="fa-solid fa-diagram-project"></i></div>
              <div class="howCard__content">
                <h3>Trilha em lógica de build</h3>
                <p>
                  Cada aula encaixa numa sequência (MVP → Stack → LLM → Deploy). Nada é “vídeo perdido”.
                  Você monta o projeto por camadas, como um produto real.
                </p>
              </div>
            </article>

            <article class="howCard">
              <div class="howCard__icon"><i class="fa-solid fa-robot"></i></div>
              <div class="howCard__content">
                <h3>Agente de IA te guia</h3>
                <p>
                  Um agente acompanha sua jornada, identifica onde você está e recomenda o próximo passo
                  (sem sobrecarga). Você aprende com clareza de progresso.
                </p>
              </div>
            </article>

            <article class="howCard">
              <div class="howCard__icon"><i class="fa-solid fa-people-group"></i></div>
              <div class="howCard__content">
                <h3>Comunidade + missões</h3>
                <p>
                  Você evolui com missões, revisões e troca de prática. A matilha participa: feedback,
                  ajustes, e gente construindo junto de verdade.
                </p>
              </div>
            </article>

            <article class="howCard">
              <div class="howCard__icon"><i class="fa-brands fa-github"></i></div>
              <div class="howCard__content">
                <h3>Open-source com GitHub</h3>
                <p>
                  O conteúdo e a plataforma evoluem como software: issues, pull requests e versionamento.
                  A comunidade propõe melhorias, implementa e faz merge.
                </p>
              </div>
            </article>
          </div>

          <!-- Coluna direita: “como fazemos isso no GitHub” -->
          <div class="how__right">

            <div class="howPanel">
              <div class="howPanel__top">
                <span class="howPanel__badge">
                  <span class="dot"></span>
                  Fluxo de contribuição • GitHub
                </span>
                <h3 class="howPanel__title">Como a comunidade coda a biblioteca</h3>
                <p class="howPanel__desc">
                  Tudo é tratado como produto: o que é aula vira feature; o que é dúvida vira issue;
                  o que é melhoria vira pull request. Assim o conhecimento não fica parado — ele evolui.
                </p>
              </div>

              <ol class="howFlow" aria-label="Passos no GitHub">
                <li class="howFlow__item">
                  <span class="howFlow__n">01</span>
                  <div class="howFlow__txt">
                    <strong>Abrir Issue</strong>
                    <span>uma aula nova, ajuste, bug ou melhoria</span>
                  </div>
                </li>
                <li class="howFlow__item">
                  <span class="howFlow__n">02</span>
                  <div class="howFlow__txt">
                    <strong>Criar Branch</strong>
                    <span>feature/..., fix/..., docs/...</span>
                  </div>
                </li>
                <li class="howFlow__item">
                  <span class="howFlow__n">03</span>
                  <div class="howFlow__txt">
                    <strong>Pull Request</strong>
                    <span>revisão em grupo + comentários</span>
                  </div>
                </li>
                <li class="howFlow__item">
                  <span class="howFlow__n">04</span>
                  <div class="howFlow__txt">
                    <strong>Merge + Versão</strong>
                    <span>conteúdo atualizado e publicado</span>
                  </div>
                </li>
              </ol>

              <div class="howConsole" aria-hidden="true">
                <div class="howConsole__top">
                  <span class="dot r"></span><span class="dot y"></span><span class="dot g"></span>
                  <strong>mahal://github</strong>
                  <span class="pill">versionado</span>
                </div>
                <div class="howConsole__body">
                  <div class="line"><span class="k">[ISSUE]</span> sugestão: aula “RAG do zero”</div>
                  <div class="line"><span class="k">[BRANCH]</span> feature/rag-aula</div>
                  <div class="line"><span class="k">[PR]</span> revisão da comunidade</div>
                  <div class="line"><span class="k">[MERGE]</span> v1.3 publicado ✅</div>
                </div>
              </div>
            </div>

            <div class="howNote">
              <i class="fa-solid fa-circle-info"></i>
              <p>
                Resultado: você aprende construindo um sistema completo — e ainda participa do código que mantém a biblioteca viva.
              </p>
            </div>

          </div>
        </div>

      </div>
    </section>



    <!-- COMBOS -->
    <section id="combos" class="#combos">
      <h2 class="section-title"></h2>
      <div class="cards">
        <div class="card">
          <span class="combo-badge" style="background-color: #ff7b00ff;">Introdução</span>
          <img src="/assets/img/pages/biblioteca/banner_n8n_2.png" alt="Introdução ao Agente via n8n">
        </div>

        <div class="card">
          <span class="combo-badge" style="background-color: #ff7b00ff;">Intermediário</span>
          <img src="/assets/img/pages/biblioteca/banner_docker_servidor.png" alt=" Pasta Docker Padrão + Aulas">

        </div>

        <div class="card">
          <span class="combo-badge" style="background-color: #ff7b00ff;">Facil</span>
          <img src="/assets/img/pages/biblioteca/banner_vibecede_red.png" alt="Introdução ao Agente via n8n">
        </div>
      </div>
    </section>


    <section id="trilha" class="trail">
      <div class="trail__grid">

        <!-- ESQUERDA: etapas -->
        <div class="trail__steps" role="tablist" aria-label="Trilha Biblioteca Mahal — SaaS com LLM">

          <button class="trail-step is-active" type="button" role="tab" aria-selected="true"
            data-step="1"
            data-title="1) Ideia + MVP (o que vai virar produto)"
            data-desc="Você sai do ‘projeto solto’ e define um SaaS de verdade: nicho, dor, oferta e o MVP enxuto. Aqui a gente corta o excesso e cria um plano que dá pra construir e colocar no ar rápido."
            data-tags="Produto;MVP;Validação"
            data-bullets="Escolher nicho e dor real;Definir MVP em 1 página;Roadmap de 3 sprints"
            data-icon="fa-lightbulb">
            <span class="trail-step__n">01</span>
            <span class="trail-step__icon"><i class="fa-solid fa-lightbulb"></i></span>
            <span class="trail-step__text">
              <strong>MVP</strong>
              <small>ideia → produto</small>
            </span>
          </button>

          <button class="trail-step" type="button" role="tab" aria-selected="false"
            data-step="2"
            data-title="2) Stack real (Auth + Banco + API)"
            data-desc="Você monta a base do SaaS como gente grande: autenticação, banco de dados, API e estrutura de pastas. Tudo organizado pra crescer sem virar gambiarra."
            data-tags="Auth;Banco;API"
            data-bullets="Login seguro + permissões;Banco modelado (Postgres/MySQL);API + webhooks"
            data-icon="fa-layer-group">
            <span class="trail-step__n">02</span>
            <span class="trail-step__icon"><i class="fa-solid fa-layer-group"></i></span>
            <span class="trail-step__text">
              <strong>Stack</strong>
              <small>base do SaaS</small>
            </span>
          </button>

          <button class="trail-step" type="button" role="tab" aria-selected="false"
            data-step="3"
            data-title="3) LLM na prática (RAG + memória + tools)"
            data-desc="Agora o SaaS vira ‘inteligente’: você integra LLM com contexto real. RAG com documentos, histórico/memória, ferramentas (tools) e automações com n8n pra executar ações."
            data-tags="LLM;RAG;Automação"
            data-bullets="Prompt + guardrails;RAG (embeddings + docs);Tools + workflows n8n"
            data-icon="fa-brain">
            <span class="trail-step__n">03</span>
            <span class="trail-step__icon"><i class="fa-solid fa-brain"></i></span>
            <span class="trail-step__text">
              <strong>LLM</strong>
              <small>com contexto</small>
            </span>
          </button>

          <button class="trail-step" type="button" role="tab" aria-selected="false"
            data-step="4"
            data-title="4) Produção (Docker + VPS + domínio + recorrência)"
            data-desc="A parte que quase ninguém ensina: colocar no ar de verdade. Docker/Compose, servidor VPS, HTTPS, domínio e o básico de recorrência (checkout/billing). Resultado: seu SaaS rodando em produção."
            data-tags="Docker;Deploy;Billing"
            data-bullets="Docker Compose em produção;VPS + SSL + domínio;Checkout + recorrência básica"
            data-icon="fa-rocket">
            <span class="trail-step__n">04</span>
            <span class="trail-step__icon"><i class="fa-solid fa-rocket"></i></span>
            <span class="trail-step__text">
              <strong>Deploy</strong>
              <small>no ar + venda</small>
            </span>
          </button>

          <!-- progresso -->
          <div class="trail-progress" aria-hidden="true">
            <span class="trail-progress__bar"></span>
          </div>
        </div>

        <!-- DIREITA: painel (muda com clique) -->
        <div class="trail__panel" aria-live="polite">
          <div class="trail__panelTop">
            <div class="trail__badge">
              <span class="dot"></span>
              <span>Trilha Founder • do MVP ao SaaS em produção</span>
            </div>

            <h3 class="trail__title" id="trailTitle">1) Ideia + MVP (o que vai virar produto)</h3>
            <p class="trail__desc" id="trailDesc">
              Você sai do ‘projeto solto’ e define um SaaS de verdade: nicho, dor, oferta e o MVP enxuto.
              Aqui a gente corta o excesso e cria um plano que dá pra construir e colocar no ar rápido.
            </p>
          </div>

          <div class="trail__meta">
            <div class="trail__tags" id="trailTags">
              <span class="tag">Produto</span>
              <span class="tag">MVP</span>
              <span class="tag">Validação</span>
            </div>

            <ul class="trail__list" id="trailBullets">
              <li>Escolher nicho e dor real</li>
              <li>Definir MVP em 1 página</li>
              <li>Roadmap de 3 sprints</li>
            </ul>
          </div>

          <div class="trail__cta">
            <a class="trail-btn primary" href="https://pay.mahal.pro/ticket-founder/a/cupomtemporario"><i class="fa-solid fa-ticket"></i> Garantir Ticket Founder</a>
            <a class="trail-btn ghost" href="#comunidade"><i class="fa-solid fa-people-group"></i> Entrar na comunidade</a>
          </div>

          <!-- mini “console” decorativa -->
          <div class="trail__console" aria-hidden="true">
            <div class="trail__consoleTop">
              <span class="dot r"></span><span class="dot y"></span><span class="dot g"></span>
              <strong>biblioteca-mahal://build</strong>
              <span class="pill">sprint ativa</span>
            </div>
            <div class="trail__consoleBody" id="trailConsole">
              <div class="line"><span class="k">[ISSUE]</span> definir MVP e escopo</div>
              <div class="line"><span class="k">[COMMIT]</span> auth + banco + API base</div>
              <div class="line"><span class="k">[MERGE]</span> LLM + RAG + tools</div>
              <div class="line"><span class="k">[DEPLOY]</span> VPS + domínio + produção ✅</div>
            </div>
          </div>
        </div>

      </div>
    </section>


        <!-- OFERTA (Ticket Founder) - sem preço -->
    <section id="ticket-founder" class="offer">
      <div class="offer__container">

        <header class="offer__head">
          <div class="offer__badge">
            <span class="offer__dot"></span>
            <span>Pré-venda com bônus • Encontros de aquecimento + Evento ao vivo</span>
          </div>

          <h2 class="offer__title">
            Ticket Founder: <span>construa seu SaaS com LLM</span><br />
            do zero até produção (em comunidade).
          </h2>

          <p class="offer__sub">
            Acesso antecipado ao modelo <strong>open-source</strong> da Biblioteca Mahal.
            Aqui você não só assiste: você entra na <strong>matilha</strong> e participa do código no GitHub
            (issues, PRs e merges).
          </p>
        </header>

        <div class="offer__grid">

          <!-- COLUNA ESQUERDA -->
          <div class="offer__left">

            <div class="offer__console" aria-hidden="true">
              <div class="offer__consoleTop">
                <span class="dot r"></span><span class="dot y"></span><span class="dot g"></span>
                <strong>mahal://founder</strong>
                <span class="pill">build ao vivo</span>
              </div>
              <div class="offer__consoleBody">
                <div class="line"><span class="k">[AQUECIMENTO]</span> setup do ambiente + stack base + acesso Discord/GitHub</div>
                <div class="line"><span class="k">[DIA 1]</span> MVP + auth + banco + API</div>
                <div class="line"><span class="k">[DIA 2]</span> LLM + prompts + funções + contexto (RAG/embeddings)</div>
                <div class="line"><span class="k">[DIA 3]</span> Docker + VPS + domínio + HTTPS + deploy ✅</div>
                <div class="line"><span class="k">[RUN]</span> revisão em grupo + PRs + merge (matilha)</div>
              </div>
            </div>

            <!-- Encontros antes do evento -->
            <div class="offer__warmup">
              <div class="offer__warmupTop">
                <i class="fa-solid fa-fire"></i>
                <strong>Pré-venda com bônus</strong>
                <span>encontros antes do evento</span>
              </div>

              <div class="offer__warmupGrid">
                <div class="offer__warmupCard">
                  <span class="n">01</span>
                  <div class="c">
                    <strong>Onboarding da Matilha</strong>
                    <p>Entrar no Discord, acessar repositórios, entender como contribuir sem travar.</p>
                  </div>
                </div>

                <div class="offer__warmupCard">
                  <span class="n">02</span>
                  <div class="c">
                    <strong>Setup da Stack</strong>
                    <p>Ambiente, Docker/Compose, banco, variáveis e estrutura do projeto base.</p>
                  </div>
                </div>

                <div class="offer__warmupCard">
                  <span class="n">03</span>
                  <div class="c">
                    <strong>Plano do SaaS</strong>
                    <p>Definir MVP, fluxo de usuário, módulos e o que vira “feature” (issue → PR).</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="offer__bullets">
              <div class="offer__item">
                <div class="offer__icon"><i class="fa-solid fa-users"></i></div>
                <div>
                  <strong>Matilha (network de builders)</strong>
                  <p>Feedback, revisão e troca real. Você evolui mais rápido cercado de gente que constrói.</p>
                </div>
              </div>

              <div class="offer__item">
                <div class="offer__icon"><i class="fa-brands fa-github"></i></div>
                <div>
                  <strong>A comunidade coda a biblioteca</strong>
                  <p>O conteúdo é versionado: o que é dúvida vira issue, o que é melhoria vira pull request.</p>
                </div>
              </div>

              <div class="offer__item">
                <div class="offer__icon"><i class="fa-solid fa-robot"></i></div>
                <div>
                  <strong>LLM aplicado no sistema</strong>
                  <p>Prompts, funções e contexto (RAG) conectados a um produto real — não “demo”.</p>
                </div>
              </div>

              <div class="offer__item">
                <div class="offer__icon"><i class="fa-solid fa-server"></i></div>
                <div>
                  <strong>Produção de verdade</strong>
                  <p>Docker + VPS + domínio + HTTPS. Você sai com o projeto online e operável.</p>
                </div>
              </div>
            </div>

          </div>

          <!-- COLUNA DIREITA (card premium sem preço) -->
          <aside class="offer__card" id="offerCard">
            <button class="offer__close" type="button" id="offerClose" aria-label="Fechar oferta">
              <i class="fa-solid fa-xmark"></i>
            </button>

            <div class="offer__cardTop">
              <div class="offer__tag">ACESSO ANTECIPADO</div>
              <h3 class="offer__cardTitle">Ticket Founder</h3>
              <p class="offer__cardDesc">pré-venda com bônus + evento ao vivo + open-source</p>
            </div>

            <ul class="offer__list">
              <li><i class="fa-solid fa-check"></i> Comunidade ativa no Discord</li>
              <li><i class="fa-solid fa-check"></i> Encontros da Matilha</li>
              <li><i class="fa-solid fa-check"></i> Evento ao vivo (2, 3 e 4 de Março • Discord)</li>
              <li><i class="fa-solid fa-check"></i> Construção de um SaaS com LLM do zero</li>
              <li><i class="fa-solid fa-check"></i> Docker + VPS + domínio + deploy</li>
              <li><i class="fa-solid fa-check"></i> Acesso antecipado ao modelo open-source (GitHub)</li>
              <li><i class="fa-solid fa-check"></i> Acesso vitalício à Biblioteca</li>
            </ul>

            <div class="offer__actions">
              <a class="offer__btn offer__btn--primary" href="https://pay.mahal.pro/ticket-founder/a/cupomtemporario">
                <i class="fa-solid fa-ticket"></i> Garantir Ticket Founder
              </a>
              <a class="offer__btn offer__btn--ghost" href="#como-funciona">
                <i class="fa-solid fa-diagram-project"></i> Como funciona por dentro
              </a>
            </div>

            <p class="offer__fine">
              * Você entra no Discord, recebe o passo a passo e já participa da construção.
            </p>
          </aside>

        </div>

        <button class="offer__peek" type="button" id="offerPeek">
          <i class="fa-solid fa-ticket"></i>
          Ver Ticket Founder
        </button>

      </div>
    </section>


    <!-- SERVIÇOS / O QUE VOCÊ APRENDE -->
    <section id="servicos">
      <h2 class="section-title">O que você aprende</h2>
      <p class="section-sub">
        Conhecimento aplicado para criar, automatizar e escalar produtos digitais.
      </p>

      <div class="cards">
        <div class="card">
          <h4>Agentes de IA</h4>
          <p>
            Criação de agentes inteligentes conectados a APIs, bancos de dados,
            documentos e sistemas reais. IA que executa tarefas, toma decisões
            e aprende com contexto.
          </p>
        </div>

        <div class="card">
          <h4>Automação com n8n</h4>
          <p>
            Workflows prontos e explicados para vendas, suporte, marketing,
            operações e integrações. Automação de verdade, não só exemplos.
          </p>
        </div>

        <div class="card">
          <h4>SaaS & Infraestrutura</h4>
          <p>
            Estruturas reais de projetos: Docker, servidores, deploy,
            autenticação, permissões e arquitetura pronta para produção.
          </p>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section id="faq" class="faq">
      <h2 class="section-title">Dúvidas Frequentes</h2>

      <div class="faq-item">
        <div class="faq-question">Isso é curso ou biblioteca?</div>
        <div class="faq-answer">
          É uma biblioteca viva. Você aprende construindo sistemas reais,
          com missões, projetos e materiais reutilizáveis.
        </div>
      </div>

      <div class="faq-item">
        <div class="faq-question">Preciso ser programador avançado?</div>
        <div class="faq-answer">
          Não. O conteúdo é progressivo: do básico ao avançado,
          sempre com aplicação prática.
        </div>
      </div>

      <div class="faq-item">
        <div class="faq-question">Os materiais são atualizados?</div>
        <div class="faq-answer">
          Sim. A Biblioteca Mahal evolui junto com as tecnologias
          e novos conteúdos são adicionados constantemente.
        </div>
      </div>
    </section>

    <!--
    <section id="biblioteca" class="biblioteca">
      <div class="container">
        <div class="text-center mb-16">
          <h1 class="text-4xl font-bold text-white mb-4">Escolha seu Pacote</h1>
          <p class="text-lg text-gray-400 max-w-2xl mx-auto">
            Comece no gratuito e evolua até colocar seus agentes em produção com Docker + VPS — e, se quiser, com acompanhamento pessoal.
          </p>


          <div class="duration-tabs">
            <button class="duration-btn active" data-duration="monthly" type="button">À vista</button>
            <button class="duration-btn" data-duration="quarterly" type="button">2x</button>
            <button class="duration-btn" data-duration="annual" type="button">12x</button>
          </div>
        </div>

        <div class="plan-row">


          <div class="plan-card rounded-xl p-6 relative">
            <div class="text-center mb-6">
              <p>/start</p>
              <h3 class="text-2xl font-bold text-white">
                <i class="fa-solid fa-meteor"></i> Explorador
              </h3>
            </div>

            <div class="price text-center mb-6">
              <span class="text-4xl font-bold text-white">R$ 0</span>
              <p class="text-gray-500">pacote</p>
            </div>

            <ul class="feature-list mb-4">
              <p class="text-gray-400" style="font-size: 14px; margin-bottom: 15px;">
                Introdução prática: crie seu primeiro agente com n8n e conecte um Webchat via Webhook.
              </p>

              <li><i class="fas fa-check"></i> O que é um agente (visão clara)</li>
              <li><i class="fas fa-check"></i> n8n do zero (fluxo simples)</li>
              <li><i class="fas fa-check"></i> Webhook funcionando (teste real)</li>
              <li><i class="fas fa-check"></i> Webchat integrado (end-to-end)</li>

              <li class="hidden-feature"><i class="fas fa-check"></i> Template do projeto base</li>
              <li class="hidden-feature"><i class="fas fa-check"></i> Checklist de primeiros passos</li>

              <li class="hidden-feature"><i class="fa-solid fa-ban" style="color:#ff0000;"></i> Sem Pasta Docker</li>
              <li class="hidden-feature"><i class="fa-solid fa-ban" style="color:#ff0000;"></i> Sem VPS / Deploy</li>
              <li class="hidden-feature"><i class="fa-solid fa-ban" style="color:#ff0000;"></i> Sem acompanhamento</li>
            </ul>

            <button class="toggle-btn" type="button">Ver mais</button>
            <a href="https://biblioteca.mahal.pro/">
              <button class="btn btn-secondary" type="button">Começar agora</button>
            </a>
          </div>


          <div class="plan-card rounded-xl p-6 relative popular-border">
            <div class="popular-badge">POPULAR</div>

            <div class="text-center mb-6">
              <p>Pacote 2</p>
              <h3 class="text-2xl font-bold text-white">
                <i class="fa-solid fa-user-astronaut"></i> Construtor
              </h3>
            </div>

            <div class="price text-center mb-6">
              <span class="text-4xl font-bold text-white">R$ 497</span>
              <p class="text-gray-500">pacote</p>
              <p class="text-sm text-gray-400">N8N avançado + Pasta Docker</p>
            </div>

            <ul class="feature-list mb-4">
              <p class="text-gray-400" style="font-size:14px; margin-bottom: 15px;">
                Você sai do “teste” e vira construtor: fluxos avançados e estrutura profissional em Docker.
              </p>

              <li><i class="fas fa-check"></i> N8N avançado (IF/Switch/Loop/Erros)</li>
              <li><i class="fas fa-check"></i> Sub-workflows e organização por projeto</li>
              <li><i class="fas fa-check"></i> Templates de agentes reutilizáveis</li>
              <li><i class="fas fa-check"></i> 📂 Pasta Docker (padrão Mahal)</li>
              <li><i class="fas fa-check"></i> docker-compose + volumes + backup</li>

              <li class="hidden-feature"><i class="fas fa-check"></i> Webchat “versão 2” (melhorias)</li>
              <li class="hidden-feature"><i class="fas fa-check"></i> Boas práticas de produção</li>

              <li class="hidden-feature"><i class="fa-solid fa-ban" style="color:#ff0000;"></i> Sem VPS / Deploy completo</li>
              <li class="hidden-feature"><i class="fa-solid fa-ban" style="color:#ff0000;"></i> Sem acompanhamento pessoal</li>
            </ul>

            <button class="toggle-btn" type="button">Ver mais</button>

            <button
              class="btn btn-primary"
              type="button"
              onclick="window.location.href='https://pay.kiwify.com.br/SEU_LINK_PACOTE2'">
              Comprar pacote
            </button>
          </div>


          <div class="plan-card rounded-xl p-6 relative">
            <div class="text-center mb-6">
              <p>Pacote 3</p>
              <h3 class="text-2xl font-bold text-white">
                <i class="fa-solid fa-rocket"></i> Arquiteto
              </h3>
            </div>

            <div class="price text-center mb-6">
              <span class="text-4xl font-bold text-white">R$ 1.497</span>
              <p class="text-gray-500">pacote</p>
              <p class="text-sm text-gray-400">Tudo + Docker + VPS Linux + VibeCode</p>
            </div>

            <ul class="feature-list mb-4">
              <p class="text-gray-400" style="font-size:14px; margin-bottom: 15px;">
                Você coloca no ar de verdade: servidor, deploy, domínio, segurança básica e ritmo de dev.
              </p>

              <li><i class="fas fa-check"></i> Tudo do Pacote 2</li>
              <li><i class="fas fa-check"></i> Docker avançado (rede, logs, manutenção)</li>
              <li><i class="fas fa-check"></i> VPS Linux (SSH, firewall, hardening básico)</li>
              <li><i class="fas fa-check"></i> Deploy em produção (stack rodando)</li>
              <li><i class="fas fa-check"></i> Domínio + HTTPS (setup guiado)</li>
              <li><i class="fas fa-check"></i> VibeCode (padrão de projeto e execução)</li>

              <li class="hidden-feature"><i class="fas fa-check"></i> Checklist “produção” (erros comuns)</li>
              <li class="hidden-feature"><i class="fas fa-check"></i> Rotina de backup e restore</li>

              <li class="hidden-feature"><i class="fa-solid fa-ban" style="color:#ff0000;"></i> Sem acompanhamento 1:1</li>
            </ul>

            <button class="toggle-btn" type="button">Ver mais</button>

            <button
              class="btn btn-primary"
              type="button"
              onclick="window.location.href='https://pay.kiwify.com.br/SEU_LINK_PACOTE3'">
              Comprar pacote
            </button>
          </div>

          <div class="premium-plan rounded-xl premium-border">
            <div class="premium-badge">ACOMPANHAMENTO</div>

            <div class="premium-plan-content">
              <div class="premium-plan-info">
                <div class="text-center mb-6">
                  <p>🔥 Pacote 4</p>
                  <h3 class="text-2xl font-bold text-white">
                    <i class="fa-solid fa-hurricane"></i> Alpha
                  </h3>
                </div>

                <div class="price text-center mb-6">
                  <span class="text-4xl font-bold text-white">Sob consulta</span>
                  <p class="text-sm text-gray-400">vagas limitadas</p>
                </div>

                <a href="https://api.whatsapp.com/send/?phone=5511958379385&text=Quero%20o%20Pacote%204%20(Acompanhamento%20Pessoal)%20—%20me%20explica%20as%20vagas%20e%20o%20formato.&type=phone_number&app_absent=0">
                  <button class="btn btn-black" type="button">Chamar no WhatsApp</button>
                </a>
              </div>

              <div class="premium-plan-features">
                <ul class="feature-list mb-4">
                  <p class="text-gray-400" style="font-size:14px; margin-bottom: 15px;">
                    Acompanhamento pessoal para tirar do papel e colocar em produção (com revisão de fluxo, stack e arquitetura).
                  </p>

                  <li><i class="fas fa-check"></i> Tudo do Pacote 3</li>
                  <li><i class="fas fa-check"></i> Diagnóstico do seu projeto</li>
                  <li><i class="fas fa-check"></i> Plano de execução (passo a passo)</li>
                  <li><i class="fas fa-check"></i> Revisão e correção de fluxos n8n</li>
                  <li><i class="fas fa-check"></i> Revisão de Docker + VPS (deploy assistido)</li>
                  <li><i class="fas fa-check"></i> Prioridade de suporte (canal direto)</li>

                  <li class="hidden-feature"><i class="fas fa-check"></i> Ajuda para empacotar e vender o agente</li>
                  <li class="hidden-feature"><i class="fas fa-check"></i> Checklist de segurança e manutenção</li>
                  <li class="hidden-feature"><i class="fas fa-check"></i> Roadmap personalizado</li>
                </ul>

                <button class="toggle-btn" type="button">Ver mais</button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
-->


    <footer>
      <p>© 2026 Biblioteca Mahal — Conhecimento que constrói sistemas.</p>
      <p>
        <a href="#servicos">Aprendizado</a> •
        <a href="#combos">Produtos</a> •
        <a href="#faq">FAQ</a>
      </p>
    </footer>

  </div>
  <script src="/assets/js/home.js?v=1"></script>

  <script src="/assets/js/biblioteca.js"></script>

  <script>
    (function() {
      const card = document.getElementById('offerCard');
      const closeBtn = document.getElementById('offerClose');
      const peekBtn = document.getElementById('offerPeek');
      if (!card || !closeBtn || !peekBtn) return;

      const KEY = 'bm_offer_closed';

      function closeCard() {
        card.classList.add('is-collapsed');
        peekBtn.classList.add('is-visible');
        try {
          localStorage.setItem(KEY, '1');
        } catch (e) {}
      }

      function openCard() {
        card.classList.remove('is-collapsed');
        peekBtn.classList.remove('is-visible');
        try {
          localStorage.removeItem(KEY);
        } catch (e) {}
      }
      closeBtn.addEventListener('click', closeCard);
      peekBtn.addEventListener('click', openCard);
      try {
        if (localStorage.getItem(KEY) === '1') closeCard();
      } catch (e) {}
    })();
  </script>

  <script>
    window.addEventListener('DOMContentLoaded', () => {
      document.querySelectorAll('.page').forEach(el => el.classList.add('is-ready'));
    });
  </script>


  <script>
    // Tabs de duração
    const durationBtns = document.querySelectorAll('.duration-btn');

    durationBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        durationBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const duration = btn.dataset.duration;

        document.querySelectorAll('.price span').forEach(span => span.classList.add('hidden'));
        document.querySelectorAll(`.price .${duration}`).forEach(span => span.classList.remove('hidden'));

        document.querySelectorAll('.price p.text-sm').forEach(p => {
          if (p.classList.contains(duration)) p.classList.remove('hidden');
          else if (!p.classList.contains('text-gray-500')) p.classList.add('hidden');
        });
      });
    });

    // Ver mais / ver menos
    document.querySelectorAll('.toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const featureList = btn.previousElementSibling;
        featureList.classList.toggle('expanded');
        btn.classList.toggle('expanded');
      });
    });

    // Links dinâmicos do botão Assinar por período
    function updateAssinarLinks(period) {
      document.querySelectorAll('.btn-assinar').forEach(btn => {
        const link = btn.getAttribute('data-link-' + period);
        if (link) btn.onclick = () => window.open(link, '_blank');
      });
    }

    // Inicializa mensal
    updateAssinarLinks('mensal');

    // Atualiza ao trocar período
    durationBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        let period = 'mensal';
        if (btn.dataset.duration === 'quarterly') period = 'trimestral';
        if (btn.dataset.duration === 'annual') period = 'anual';
        updateAssinarLinks(period);
      });
    });

    // FAQ toggle
    document.querySelectorAll('.faq-item').forEach(item => {
      item.querySelector('.faq-question').addEventListener('click', () => {
        item.classList.toggle('active');
      });
    });
  </script>
</body>

</html>