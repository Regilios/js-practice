'use strict';

const FileCheckFormat = class { 

  constructor(initialFile = null) {
    this.file = initialFile;
  }

   detectImageType(header) {
    const output = document.getElementById('output');
    let type = 'Не подходящий формат файла';
    console.log('hex:', header[0],header[1],header[2],header[3])
    // PNG : 89 50 4E 47 
    if (header[0] === '89' && header[1] === '50' && header[2] === '4e' && header[3] === '47') {
        type = 'png';
    } 
    // GIF: 47 49 46 38
    else if (header[0] === '47' && header[1] === '49' && header[2] === '46' && header[3] === '38') {
        type = 'gif';
    } 
    // JPEG: FF D8 FF xx
    else if (header[0] === 'ff' && header[1] === 'd8' && header[2] === 'ff') {
        type = 'jpeg';
    } 
    // WEBP: RIFF xxxx WEBP
    else if (header[0] === '52' && header[1] === '49' && header[2] === '46' && header[3] === '46') {
        type = 'webp';
    }

    output.textContent = `Формат: ${type}`;
  }

  checkFile() {
    const input = document.getElementById('dsvcUploadFiles');
   
    input.addEventListener('change', (e) => {
      this.file = e.target.files[0];
      if (!this.file) return;

      const reader = new FileReader();

      reader.onload = (event) => {
        const buffer = event.target.result;
        const bytes = new Uint8Array(buffer);

        // Отображаем весь файл в виде шестнадцатеричных значений
        const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join(' ');
        this.detectImageType(hex);

        console.log('hex:', hex);
        //output.textContent = hex;  
   
      };

      reader.onerror = (event) => {
        console.error("Ошибка чтения файла", event.target.error);
      };

      const blob = this.file.slice(0, 16);
      reader.readAsArrayBuffer(blob);
    });
  } }


document.addEventListener("DOMContentLoaded", () => {
  const fileChecker = new FileCheckFormat(); 
  fileChecker.checkFile();
});
