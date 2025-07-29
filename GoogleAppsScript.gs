/**
 * Google Apps Script WebApp para guardar datos en diferentes pestañas de un Google Sheets.
 * 
 * 1. Abre tu Google Sheets.
 * 2. Ve a Extensiones > Apps Script.
 * 3. Pega este código y guarda.
 * 4. Publica como WebApp: Implementar > Nueva implementación > Tipo: WebApp
 *    - Ejecutar como: Tú mismo
 *    - Quién tiene acceso: Cualquiera, incluso anónimo
 * 5. Copia la URL y pégala en tu variable SHEETS_WEBAPP_URL en tu frontend.
 */

function doPost(e) {
  try {
    const params = JSON.parse(e.postData.contents);
    const tab = params.tab;
    const data = params.data;
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(tab);
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'Sheet not found' }))
        .setMimeType(ContentService.MimeType.JSON)
        .setHeader("Access-Control-Allow-Origin", "*");
    }

    // Limpia la hoja (excepto encabezados)
    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      sheet.deleteRows(2, lastRow - 1);
    }

    // Si no hay datos, termina
    if (!data || data.length === 0) {
      return ContentService.createTextOutput(JSON.stringify({ success: true }))
        .setMimeType(ContentService.MimeType.JSON)
        .setHeader("Access-Control-Allow-Origin", "*");
    }

    // Escribe los datos (asume que las claves del primer objeto son los encabezados)
    const headers = Object.keys(data[0]);
    // Asegura que los encabezados estén en la hoja
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    // Escribe los datos
    const values = data.map(row => headers.map(h => row[h] ?? ''));
    sheet.getRange(2, 1, values.length, headers.length).setValues(values);

    return ContentService.createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader("Access-Control-Allow-Origin", "*");
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader("Access-Control-Allow-Origin", "*");
  }
}
