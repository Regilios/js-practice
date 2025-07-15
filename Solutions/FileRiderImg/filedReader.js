'use strict';

const ImageTypeDetector = class { 

  constructor(initialFile = null) {
    this.file = initialFile;
  }

  static SIGNATURES = [
    // [[0x47, 0x49, 0x46, 0x38], 'gif'],
    // [[0x25, 0x50, 0x44, 0x46], 'pdf'],
    [[0xFF, 0xD8, 0xFF], 'jpeg'],
    [[0x89, 0x50, 0x4E, 0x47], 'png'],
    [[0x52, 0x49, 0x46, 0x46], 'webp'],
    [[0x57, 0x45, 0x42, 0x50, 0x38], 'webp'],
    [[0x42, 0x4D], 'bmp']
  ];

  checkFile(inputFile) {
    const input = document.getElementById(inputFile);
    const reader = new FileReader();
    
    input.addEventListener('change', (e) => {
      this.file = e.target.files[0];
      if (!this.file) return;
     
      reader.onload = (event) => {
        const buffer = event.target.result;
        const bytes = new Uint8Array(buffer);
        const format = this.constructor.SIGNATURES.find(([sig]) => {
            if (sig.length > bytes.length) return false;
            return sig.every((elem, i) => bytes[i] === elem);
        })?.[1] || 'Не подходящий формат файла';
        /**
         * ([sig]) =>  деструктуризация : Каждый элемент массива и выбираешь только сигнатуру (первый элемент пары).
         * Это работает потому, что find() передаёт в колбэк каждый элемент массива, и ты можешь сразу деструктурировать его в параметре. 
        */
        console.log(`Формат: ${format}`);
        return format;
      };

      reader.onerror = (event) => {
        console.error("Ошибка чтения файла", event.target.error);
      };

      const blob = this.file.slice(0, 32);
      reader.readAsArrayBuffer(blob);
    });   
  } 
}

