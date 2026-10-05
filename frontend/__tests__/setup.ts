import "@testing-library/jest-dom";

// Polyfill Web Crypto API for jsdom
import { webcrypto } from "crypto";
Object.defineProperty(globalThis, "crypto", {
  value: webcrypto,
  writable: false,
});

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();
Object.defineProperty(globalThis, "localStorage", { value: localStorageMock });
