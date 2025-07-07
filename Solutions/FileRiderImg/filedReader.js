'use strict';

const FileCheckFormat = class { 

  constructor(initialFile = null, initialBlob = null) {
    this.file = initialFile;
    this.blob = initialBlob;
  }

  detectImageType(header) {
    let typeFile = 'Не подходящий формат файла';
    // PNG : 89 50 4E 47 
    if (header[0] === '89' && header[1] === '50' && header[2] === '4E' && header[3] === '47') {
        typeFile = 'png';
    } 
    // GIF: 47 49 46 38
    else if (header[0] === '47' && header[1] === '49' && header[2] === '46' && header[3] === '38') {
        typeFile = 'gif';
    } 
    // JPEG: FF D8 FF xx
    else if (header[0] === 'FF' && header[1] === 'D8' && header[2] === 'FF') {
        typeFile = 'jpeg';
    } 
    // WEBP: RIFF xxxx WEBP
    else if ((header[0] === '52' && header[1] === '49' && header[2] === '46' && header[3] === '46') || (header[0] === '57' && header[1] === '45' && header[2] === '42' && header[3] === '50' && header[4] === '38')) {
        typeFile = 'webp';
    }
    return typeFile;
  }

  checkFile() {
    const input = document.getElementById('dsvcUploadFiles');
    const output = document.getElementById('output');
    const reader = new FileReader();
    
    input.addEventListener('change', (e) => {
      this.file = e.target.files[0];
      if (!this.file) return;
      this.blob = this.file.slice(0, 32);
  
      reader.onload = (event) => {
        const buffer = event.target.result;
        const bytes = new Uint8Array(buffer);
        const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0').toUpperCase()).join(' ').split(" ");
        const type = this.detectImageType(hex);
        output.textContent = `Формат: ${type}`;
      };

      reader.onerror = (event) => {
        console.error("Ошибка чтения файла", event.target.error);
      };
  
      reader.readAsArrayBuffer(this.blob);
    });   
  } 
}

document.addEventListener("DOMContentLoaded", () => {
  const fileChecker = new FileCheckFormat(); 
  fileChecker.checkFile();
});
