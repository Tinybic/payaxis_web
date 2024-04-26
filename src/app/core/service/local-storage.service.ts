import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  _key = CryptoJS.enc.Utf8.parse('0123456789123456');
  _iv = CryptoJS.enc.Utf8.parse('0123456789123456');
  constructor() {}

  setItem(key, value) {
    localStorage.setItem(key, this.encrypt(value.toString()));
  }

  getItem(key) {
    return this.decrypt(localStorage.getItem(key));
  }

  encrypt(password: string): string {
    return CryptoJS.AES.encrypt(password, this._key, {
      keySize: 16,
      iv: this._iv,
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    }).toString();
  }

  decrypt(passwordToDecrypt: string) {
    if (passwordToDecrypt) {
      return CryptoJS.AES.decrypt(passwordToDecrypt, this._key, {
        keySize: 16,
        iv: this._iv,
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      }).toString(CryptoJS.enc.Utf8);
    } else return null;
  }
}
