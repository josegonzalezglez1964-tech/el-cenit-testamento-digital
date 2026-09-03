'use client';

const DEVICE_KEY_NAME = 'el-cenit-device-key';

function bufferToBase64(buffer: Uint8Array): string {
  let binary = '';
  buffer.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary);
}

function base64ToBuffer(base64: string): Uint8Array {
  const binary = atob(base64);
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

async function getOrCreateDeviceKey(): Promise<CryptoKey> {
  const stored = sessionStorage.getItem(DEVICE_KEY_NAME);
  let keyBytes: Uint8Array;

  if (stored) {
    keyBytes = base64ToBuffer(stored);
  } else {
    keyBytes = crypto.getRandomValues(new Uint8Array(32));
    sessionStorage.setItem(DEVICE_KEY_NAME, bufferToBase64(keyBytes));
  }

  const keyBuffer = new ArrayBuffer(keyBytes.byteLength);
  new Uint8Array(keyBuffer).set(keyBytes);

  return crypto.subtle.importKey('raw', keyBuffer, { name: 'AES-GCM' }, false, [
    'encrypt',
    'decrypt',
  ]);
}

export async function encryptData(plaintext: string): Promise<string> {
  const key = await getOrCreateDeviceKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(plaintext);
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoded);

  const combined = new Uint8Array(iv.length + ciphertext.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(ciphertext), iv.length);

  return bufferToBase64(combined);
}

export async function decryptData(payload: string): Promise<string> {
  const key = await getOrCreateDeviceKey();
  const combined = base64ToBuffer(payload);
  const iv = combined.slice(0, 12);
  const ciphertext = combined.slice(12);

  const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext);
  return new TextDecoder().decode(decrypted);
}