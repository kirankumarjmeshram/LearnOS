const canUseStorage = () => typeof window !== "undefined";
export function getLocalStorageItem(key, fallback = null) { if (!canUseStorage()) return fallback; try { const value = window.localStorage.getItem(key); return value ? JSON.parse(value) : fallback; } catch { return fallback; } }
export function setLocalStorageItem(key, value) { if (!canUseStorage()) return false; try { window.localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; } }
export function removeLocalStorageItem(key) { if (canUseStorage()) window.localStorage.removeItem(key); }
