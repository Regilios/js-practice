'use strict'
// Создаём буфер из 8 байт
const buffer = new ArrayBuffer(8);

// Получаем доступ к данным как к DataView
const view = new DataView(buffer);

// Записываем магическую сигнатуру PNG
const pngSignature = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A];

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