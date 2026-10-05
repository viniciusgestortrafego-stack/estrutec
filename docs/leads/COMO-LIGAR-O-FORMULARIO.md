# Formulário ligado à planilha de leads do grupo

O formulário envia os dados para o receptor único de leads do grupo (Google Apps Script), que grava na aba **ESTRUTEC** da planilha "GRUPO ESTRUTALICA - LEADS". O endereço fica em `outputs/dist/form-config.js` (`window.ESTRUTEC_LEAD_ENDPOINT`).

O código do receptor está no repositório `onsuprimentos`, em `scripts/google-apps-script.gs`, e atende também ON Suprimentos, Estrutálica Civil e Estrutálica Automotiva (campo `brand` do envio). Cada envio cria uma linha com data, nome, WhatsApp, cidade, tipo de local, interesse, origem, ID, UTMs e página. Se o visitante reenviar o mesmo cadastro por falha de conexão, a linha não se repete.

Depois de mexer no script, use **Implantar → Gerenciar implantações → editar → Nova versão** para manter o mesmo endereço.
