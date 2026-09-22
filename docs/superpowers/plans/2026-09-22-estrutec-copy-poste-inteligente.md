# Estrutec Copy e Poste Inteligente Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Atualizar a landing page e o PDF da Estrutec com a nova mensagem preventiva, novos públicos, autonomia de até 6 horas e destaque para o poste inteligente.

**Architecture:** A página continuará como HTML estático responsivo, com copy e componentes ajustados dentro da estrutura existente. O PDF será regenerado a partir do HTML final, com uma página por seção e FAQ aberto.

**Tech Stack:** HTML5, CSS3, JavaScript, Playwright/Chromium e pypdf.

## Global Constraints

- Preservar o formulário existente, sua validação e o destino de WhatsApp.
- Preservar sete seções e a identidade preta, grafite, branca e laranja.
- Usar exatamente a autonomia confirmada: as câmeras e o poste inteligente continuam gravando por até 6 horas em caso de falta de energia.
- Não adicionar especificações técnicas ou promessas além das fornecidas pelo usuário.
- Manter responsividade sem rolagem horizontal em desktop ou mobile.

---

### Task 1: Atualizar a copy e o bloco de soluções

**Files:**
- Modify: `outputs/dist/index.html`
- Modify: `outputs/dist/styles.css`

**Interfaces:**
- Consumes: estrutura HTML existente, classes `.hero`, `.problem-list`, `.services`, `.audiences` e os estilos responsivos atuais.
- Produces: nova copy do hero, novo fechamento da seção de problema, públicos ampliados e componente `.smart-pole` dentro da grade de soluções.

- [ ] **Step 1: Registrar verificações de conteúdo que devem falhar antes da edição**

Executar uma busca que exija a nova manchete, a nova frase preventiva, “Poste inteligente” e “até 6 horas”. Confirmar que os textos ainda não existem na página.

- [ ] **Step 2: Atualizar o hero e a seção de problema**

Substituir a manchete por “Sua segurança está preparada para identificar o risco ou só gravar o que aconteceu?”. Manter “Muitas falhas só aparecem depois de uma ocorrência.”, alterar o item para “Uma câmera fora de posição (ponto cego).”, remover o item isolado sobre ponto cego e usar o fechamento “Segurança não é descobrir a falha depois. É identificá-la antes que vire um problema.”

- [ ] **Step 3: Ampliar os públicos atendidos**

Atualizar os textos para incluir empresas, residências, condomínios residenciais, condomínios empresariais, galpões, lojas e áreas públicas, sem duplicar categorias.

- [ ] **Step 4: Incluir poste inteligente e autonomia sem energia**

Adicionar um artigo `.smart-pole` à grade de soluções. O texto deve explicar que é uma plataforma para áreas públicas e privadas com câmeras, inteligência artificial, monitoramento 24 horas e integração com sistemas de segurança pública. Incluir: “Em caso de falta de energia, as câmeras e o poste inteligente continuam gravando por até 6 horas.”

- [ ] **Step 5: Ajustar o layout responsivo**

Fazer o artigo `.smart-pole` ocupar largura maior em desktop e voltar a uma coluna no mobile. Manter contraste, legibilidade e alinhamento com os demais serviços.

- [ ] **Step 6: Verificar conteúdo e estrutura**

Executar buscas exatas pelos novos textos; confirmar que o item isolado “Um ponto cego” não existe; validar HTML, carregamento de imagens, sete seções, formulário, links de WhatsApp e ausência de rolagem horizontal em 1440 px e 390 px.

- [ ] **Step 7: Commit**

Adicionar somente `outputs/dist/index.html` e `outputs/dist/styles.css` junto das alterações do formulário já presentes nesses arquivos e criar um commit que descreva a atualização de conteúdo e o poste inteligente.

### Task 2: Regenerar e verificar o PDF

**Files:**
- Modify: `outputs/Estrutec-Monitoramento-Landing-Page.pdf`
- Reuse: `work/render-pdf.cjs`

**Interfaces:**
- Consumes: `outputs/dist/index.html`, `outputs/dist/styles.css`, fontes e imagens locais.
- Produces: PDF final com sete páginas e a mesma copy da página.

- [ ] **Step 1: Renderizar o HTML atualizado**

Executar `node work/render-pdf.cjs` para produzir os PDFs intermediários das sete seções com o FAQ aberto.

- [ ] **Step 2: Unir as páginas**

Usar `pypdf.PdfWriter.append()` para unir `work/section-1.pdf` até `work/section-7.pdf` em `outputs/Estrutec-Monitoramento-Landing-Page.pdf`.

- [ ] **Step 3: Verificar conteúdo do PDF**

Reabrir o arquivo com `pypdf`, confirmar sete páginas e localizar no texto extraído a nova manchete, “Poste inteligente” e “até 6 horas”.

- [ ] **Step 4: Verificar visualmente todas as páginas**

Renderizar as sete páginas em PNG, montar a folha de revisão e conferir ausência de cortes, sobreposições, texto ilegível ou seções incompletas.

- [ ] **Step 5: Commit**

Adicionar o PDF atualizado e criar um commit específico para a nova exportação.

### Task 3: Publicar a versão atualizada

**Files:**
- Read: `.openai/hosting.json`
- Package: site estático configurado no projeto.

**Interfaces:**
- Consumes: arquivos finais verificados e o projeto Sites existente.
- Produces: versão privada publicada e URL de revisão confirmada pelo status da implantação.

- [ ] **Step 1: Reabrir o projeto de hospedagem**

Consultar o Site usando o `project_id` existente e preservar sua audiência atual.

- [ ] **Step 2: Preparar e enviar a fonte exata**

Usar o fluxo oficial de Sites para verificar o commit, empacotar o diretório estático permitido e enviar a fonte correspondente.

- [ ] **Step 3: Salvar e publicar**

Salvar uma nova versão com o arquivo empacotado e publicar usando a audiência já configurada.

- [ ] **Step 4: Confirmar a implantação**

Aguardar o status `succeeded` e devolver a URL literal fornecida pelo serviço.
