'use strict'
// пояснение в index.js
// Создаём буфер из 8 байт
const buffer = new ArrayBuffer(8);

// Получаем доступ к данным как к DataView
const view = new DataView(buffer);

// Записываем магическую сигнатуру PNG // по этим значениям понимаем пнг это или нет - оффициальная кодировка 
const pngSignature = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A];
// [00000000] 89 50 4E 47 0D 0A 1A 0A 00 00 00 0D 49 48 44 52 .PNG........IHDR

for (let i = 0; i < pngSignature.length; i++) {
  view.setUint8(i, pngSignature[i]);
}

function isPng(buffer) {
  const expected = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A];
  const view = new DataView(buffer);

  for (let i = 0; i < expected.length; i++) {
    if (view.getUint8(i) !== expected[i]) {
      return false;
    }
  }

  return true;
}

console.log(isPng(buffer)); 