'use strict';

/**
 * ImageTypeDetector - библиотека для определения типа изображения по магическим числам
 * @version 1.1.0
 * @license MIT
 */
class ImageTypeDetector {
  static SIGNATURES = new Map([
    [[0xFF, 0xD8, 0xFF], 'jpeg'],
    [[0x89, 0x50, 0x4E, 0x47], 'png'],
    [[0x52, 0x49, 0x46, 0x46], 'webp'],
    [[0x57, 0x45, 0x42, 0x50, 0x38], 'webp'],
    [[0x42, 0x4D], 'bmp']
  ]);

  /**
   * Создает экземпляр ImageTypeDetector
   * @constructor
   * @param {string|HTMLInputElement} input - ID input элемента или сам элемент
   * @param {Object} options - Настройки
   * @param {Function} options.onDetect - Колбек при успешном определении
   * @param {Function} options.onError - Колбек при ошибке
   */
  constructor(input, { onDetect = null, onError = null } = {}) {
    this.input = typeof input === 'string' ? document.getElementById(input) : input;
    this.onDetect = onDetect;
    this.onError = onError;
    
    if (!this.input) {
      this._handleError(new Error('Input element not found'));
      return;
    }
    
    this.input.addEventListener('change', this._handleFileChange.bind(this));
  }

  /**
   * Определяет тип файла по ArrayBuffer
   * @param {ArrayBuffer} buffer
   * @returns {string|null}
   */
  static detectFromBuffer(buffer) {
    const bytes = new Uint8Array(buffer);
    
    for (const [signature, type] of ImageTypeDetector.SIGNATURES) {
      if (signature.length > bytes.length) continue;
      
      let match = true;
      for (let i = 0; i < signature.length; i++) {
        if (bytes[i] !== signature[i]) {
          match = false;
          break;
        }
      }
      
      if (match) return type;
    }
    
    return null;
  }

  /**
   * Обрабатывает изменение файла в input
   * @private
   * @param {Event} event
   */
  async _handleFileChange(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    try {
      const type = await this.detect(file);
      if (this.onDetect) this.onDetect(type, file);
    } catch (error) {
      this._handleError(error);
    }
  }

  /**
   * Определяет тип файла
   * @param {File} file
   * @returns {Promise<string>}
   */
  async detect(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const type = ImageTypeDetector.detectFromBuffer(event.target.result);
        if (type) {
          resolve(type);
        } else {
          reject(new Error('Unsupported file type'));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('File reading error'));
      };
      
      reader.readAsArrayBuffer(file.slice(0, 32));
    });
  }

  /**
   * Обрабатывает ошибки
   * @private
   * @param {Error} error
   */
  _handleError(error) {
    console.error('ImageTypeDetector error:', error);
    if (this.onError) this.onError(error);
  }
}

// Автоматическая инициализация для элементов с data-image-detector
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-image-detector]').forEach(element => {
    const options = {
      onDetect: (type, file) => {
        console.log(`Detected image type: ${type}`, file);
        // Можно добавить автоматическую валидацию в UI
        element.dispatchEvent(new CustomEvent('image-type-detected', {
          detail: { type, file, valid: type !== null }
        }));
      },
      onError: (error) => {
        console.error('Detection failed:', error);
      }
    };
    
    new ImageTypeDetector(element, options);
  });
});

// Экспорт для использования как модуля
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ImageTypeDetector;
} else if (typeof window !== 'undefined') {
  window.ImageTypeDetector = ImageTypeDetector;
}