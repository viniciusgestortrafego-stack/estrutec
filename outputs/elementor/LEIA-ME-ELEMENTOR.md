# Estrutec no WordPress / Elementor

Arquivos desta pasta:
- `estrutec-elementor.html`: a página inteira (HTML + CSS + JavaScript) para colar em **um** widget HTML do Elementor.
- `estrutec-assets.zip`: imagens, fontes e vídeo que a página usa (pasta `assets`).

## 1. Enviar as imagens

Os arquivos precisam ficar no endereço `https://SEU-SITE/wp-content/uploads/estrutec/assets/`.

1. No painel da hospedagem (Gerenciador de Arquivos ou FTP), abra `wp-content/uploads/`.
2. Crie a pasta `estrutec` e envie o `estrutec-assets.zip` para dentro dela.
3. Extraia o zip ali. O resultado deve ser `wp-content/uploads/estrutec/assets/` com os arquivos `.webp`, `.png`, `.woff2` e `colorvu.mp4`.

Não use a Biblioteca de Mídia do WordPress para isso: ela renomeia os arquivos e cria pastas por mês, e os endereços da página deixam de funcionar.

Se preferir outra pasta, gere o arquivo de novo com o endereço desejado: `node scripts/build-elementor.cjs /wp-content/uploads/OUTRA-PASTA` (precisa de `npm i postcss postcss-prefix-selector`).

## 2. Montar a página no Elementor

1. Crie uma página nova e escolha o modelo **Elementor Tela Cheia** (Elementor Canvas) ou **Largura total**. Isso tira o cabeçalho e o rodapé do tema, que atrapalhariam a página.
2. Adicione uma **Seção** com layout **Largura total** e coloque **uma coluna**.
3. Na seção e na coluna, zere os espaçamentos: **Avançado > Margem 0 e Padding 0**.
4. Arraste o widget **HTML** para a coluna e cole todo o conteúdo de `estrutec-elementor.html`.
5. Em **Avançado** do widget, tire qualquer animação de entrada. Animação com movimento quebra o botão flutuante de WhatsApp.
6. Publique e abra a página em uma janela anônima.

## 3. Google Tag Manager

O código do GTM (`GTM-5DLHWFCJ`) **não** está no arquivo, porque ele precisa ficar no `<head>` e no início do `<body>`. Instale pelo plugin de GTM do site, pelo tema ou em **Elementor > Código personalizado**. A página já manda os eventos `lead_form_open` e `lead_form_submit` para o `dataLayer`.

## 4. Formulário de leads

O endereço que recebe os cadastros ainda está vazio: o formulário mostra "cadastro temporariamente indisponível" e oferece o WhatsApp. Para ligar, siga `docs/leads/COMO-LIGAR-O-FORMULARIO.md` e coloque o endereço no começo do `<script>` do arquivo, na linha `window.ESTRUTEC_LEAD_ENDPOINT = '';`.

## 5. Cuidados

- O CSS está todo dentro de `#estrutec-lp`, então o tema não muda a aparência. Foi testado contra um tema com regras agressivas para títulos, listas, botões e imagens.
- Plugins de cache e de otimização (Autoptimize, WP Rocket) às vezes alteram scripts em linha. Se o popup ou o formulário não funcionar, exclua a página da minificação de JavaScript.
- Não edite o HTML pelo editor visual do Elementor. Altere o texto no widget HTML ou me peça um arquivo novo.
- Os links internos (`#inicio`) e o botão flutuante de WhatsApp só funcionam com a página aberta normalmente, e não dentro do editor.
