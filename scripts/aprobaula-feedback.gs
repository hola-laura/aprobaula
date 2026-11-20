function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const parent = DriveApp.getFolderById('1HkLzq1-TLbQ_Db8JCRIg4XMlMvs8mxeH');
  if (data.kind === 'temario') return saveTemario(parent, data);

  let sheetFile;
  const sheets = parent.getFilesByName('Reportes Aprobaula');
  if (sheets.hasNext()) {
    sheetFile = sheets.next();
  } else {
    const ssNew = SpreadsheetApp.create('Reportes Aprobaula');
    sheetFile = DriveApp.getFileById(ssNew.getId());
    sheetFile.moveTo(parent);
  }

  const ss = SpreadsheetApp.openById(sheetFile.getId());
  let sheet = ss.getSheetByName('Reportes');
  if (!sheet) {
    sheet = ss.insertSheet('Reportes');
    sheet.appendRow(['Fecha', 'Tipo', 'ID', 'Pregunta', 'Comentario', 'Foto']);
    const extra = ss.getSheets();
    if (extra.length > 1 && extra[0].getName() !== 'Reportes') {
      ss.deleteSheet(extra[0]);
    }
  }

  let photos;
  const folders = parent.getFoldersByName('Fotos reportes');
  photos = folders.hasNext() ? folders.next() : parent.createFolder('Fotos reportes');

  let photoUrl = '';
  if (data.photo) {
    const raw = String(data.photo).replace(/^data:image\/\w+;base64,/, '');
    const blob = Utilities.newBlob(
      Utilities.base64Decode(raw),
      'image/jpeg',
      'reporte-' + Date.now() + '.jpg'
    );
    const file = photos.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    photoUrl = file.getUrl();
  }

  sheet.appendRow([
    new Date(),
    String(data.type || '').replace(/^Aprobaula · /, ''),
    data.questionId || '',
    data.questionText || '',
    data.userNote || '',
    photoUrl
  ]);

  return ContentService.createTextOutput('ok');
}

function saveTemario(parent, data) {
  const folders = parent.getFoldersByName('Temarios compartidos');
  const folder = folders.hasNext() ? folders.next() : parent.createFolder('Temarios compartidos');
  const fileName = new Date().toISOString().slice(0, 10) + ' - ' + String(data.fileName || 'tema').slice(0, 120);
  const blob = Utilities.newBlob(Utilities.base64Decode(String(data.data || '')), data.mimeType || 'application/octet-stream', fileName);
  const file = folder.createFile(blob);

  const ssFiles = parent.getFilesByName('Reportes Aprobaula');
  if (ssFiles.hasNext()) {
    const ss = SpreadsheetApp.openById(ssFiles.next().getId());
    let sheet = ss.getSheetByName('Temarios');
    if (!sheet) {
      sheet = ss.insertSheet('Temarios');
      sheet.appendRow(['Fecha', 'Nombre del tema', 'Archivo', 'Tamaño (KB)', 'Enlace']);
    }
    sheet.appendRow([new Date(), data.name || '', data.fileName || '', Math.round((data.size || 0) / 1024), file.getUrl()]);
  }

  const me = Session.getEffectiveUser().getEmail();
  const body = 'Alguien ha compartido un tema en Aprobaula.\n\nNombre: ' + (data.name || '') + '\nArchivo: ' + (data.fileName || '') + '\nEnlace en Drive: ' + file.getUrl();
  const options = {};
  if (blob.getBytes().length < 20 * 1024 * 1024) options.attachments = [blob];
  MailApp.sendEmail(me, 'Aprobaula · Nuevo tema compartido: ' + (data.name || data.fileName || ''), body, options);

  return ContentService.createTextOutput('ok');
}
