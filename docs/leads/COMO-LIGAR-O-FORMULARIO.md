# Ligar o formulário à planilha de leads

O formulário do site envia os dados para um endereço configurado em `outputs/dist/form-config.js`. Este guia cria a planilha e o endereço.

1. Crie uma planilha no Google Sheets (por exemplo, "Leads Estrutec").
2. Abra **Extensões → Apps Script**, apague o conteúdo e cole o arquivo `receptor-de-leads.gs`.
3. Clique em **Implantar → Nova implantação → App da Web**.
   - **Executar como:** você.
   - **Quem pode acessar:** Qualquer pessoa.
4. Autorize o acesso quando o Google pedir e copie o **URL do app da Web** (termina em `/exec`).
5. Envie esse URL para a equipe de desenvolvimento. Ele entra em `outputs/dist/form-config.js`:
   `window.ESTRUTEC_LEAD_ENDPOINT = 'URL_AQUI';`

Todos os botões de orçamento da página abrem um formulário em popup, e ele envia os dados para o mesmo endereço do formulário do topo. Cada envio cria uma linha com data, nome, WhatsApp, cidade, tipo de local, interesse, origem (formulário do topo ou o botão clicado) e um ID. Se o visitante enviar duas vezes o mesmo cadastro por falha de conexão, a planilha não duplica a linha.

Depois de mexer no script, faça uma **nova implantação** (ou gerencie a implantação e escolha "nova versão"), senão o site continua usando a versão antiga.
