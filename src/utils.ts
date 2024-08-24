// Error Handling Functionality
import { writable } from 'svelte/store';

export let error: string = "";
export const errorStore = writable(error);

export function setError(message: string) {
    errorStore.set(message);
}

export function clearError() {
    errorStore.set("");
    console.log("error: " + error);
}

// The storage functions with IndexedDB

export function getStorage(key: string): Promise<any> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("aiui", 1);

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains("chat")) {
              db.createObjectStore("chat");
            }
        };

        request.onerror = (event) => {
            reject(event);
        };

        request.onsuccess = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            const transaction = db.transaction(["chat"], "readonly");
            const objectStore = transaction.objectStore("chat");
            const request = objectStore.get(key);

            
            request.onerror = (event) => {
                reject(event);
            };

            request.onsuccess = (event) => {
                resolve(request.result);
            }
        }
    })
}

export function setStorage(key: string, value: any) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("aiui", 1);

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains("chat")) {
              db.createObjectStore("chat");
            }
        };

        request.onerror = (event) => {
            reject(event);
        }

        request.onsuccess = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            const transaction = db.transaction(["chat"], "readwrite");
            const objectStore = transaction.objectStore("chat");
            const request = objectStore.put(value, key);

            request.onerror = (event) => {
                reject(event);
            }

            request.onsuccess = (event) => {
                resolve(event);
            }
        }
    })
}

// localStorage functions for less important settings.

export function getSetting(key: string, defaultValue: any = null): any | null {
    return JSON.parse(localStorage.getItem(key) ?? 'null') ?? defaultValue;
}

export function setSetting(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
}

export function fileToBase64(file: File): Promise<string>{
    const reader = new FileReader();
    reader.readAsDataURL(file);
    return new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = e => {
            reject(e)
            setError("Error reading file: " + e.toString());
        };
    });
}