/**
 * Receptor de leads da landing page da Estrutec (Google Apps Script).
 * Grava cada cadastro em uma planilha e responde no formato que o site espera:
 * { ok: true, requestId: "<mesmo id enviado pelo site>" }
 */
const ABA = 'Leads';
const COLUNAS = ['Data', 'Nome', 'WhatsApp', 'Cidade', 'O que deseja proteger', 'O que procura', 'ID da solicitação'];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const dados = JSON.parse(e.postData.contents);
    const requestId = String(dados.requestId || '');
    if (dados.brand !== 'estrutec' || !/^[0-9a-f-]{36}$/.test(requestId)) return saida({ ok: false });
    if (dados.website) return saida({ ok: true, requestId }); // campo isca preenchido por robô

    const aba = obterAba();
    // Reenvio do mesmo cadastro (resposta perdida): não cria linha duplicada.
    const ids = aba.getLastRow() > 1
      ? aba.getRange(2, COLUNAS.length, aba.getLastRow() - 1, 1).getValues().flat()
      : [];
    if (ids.indexOf(requestId) === -1) {
      aba.appendRow([
        new Date(),
        limpar(dados.nome, 120),
        limpar(dados.telefone, 20),
        limpar(dados.cidade, 100),
        limpar(dados.imovel, 40),
        limpar(dados.interesse, 60),
        requestId,
      ]);
    }
    return saida({ ok: true, requestId });
  } catch (erro) {
    return saida({ ok: false });
  } finally {
    lock.releaseLock();
  }
}

function obterAba() {
  const planilha = SpreadsheetApp.getActiveSpreadsheet();
  let aba = planilha.getSheetByName(ABA);
  if (!aba) {
    aba = planilha.insertSheet(ABA);
    aba.appendRow(COLUNAS);
    aba.setFrozenRows(1);
  }
  return aba;
}

// Corta o tamanho e impede que o texto vire fórmula na planilha.
function limpar(valor, max) {
  const texto = String(valor || '').trim().slice(0, max);
  return /^[=+\-@]/.test(texto) ? "'" + texto : texto;
}

function saida(objeto) {
  return ContentService.createTextOutput(JSON.stringify(objeto)).setMimeType(ContentService.MimeType.JSON);
}
