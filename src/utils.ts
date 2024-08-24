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

// Text formatting

function balanceText(input: string) {
    // Balancing asterisks
    let asteriskCount = (input.match(/\*/g) || []).length;
    if (asteriskCount % 2 !== 0) {
        input += '*';
    }

    // Balancing quotation marks
    let quoteCount = (input.match(/"/g) || []).length;
    if (quoteCount % 2 !== 0) {
        input += '"'; 
    }

    // Balancing backticks
    let backtickCount = (input.match(/`/g) || []).length;
    if (backtickCount % 2 !== 0) {
        input += '`';
    }

    return input;
}

export function formatText(input: string) {
    let output = '';
    let i = 0;

    input = balanceText(input);

    while (i < input.length) {
        if (input[i] === '*') {
            if (input[i + 1] === '*') {
                let end = input.indexOf('**', i + 2);
                if (end !== -1) {
                    output += `<span class="bold">${input.slice(i + 2, end)}</span>`;
                    i = end + 2; // Move past the closing double asterisks
                } else {
                    output += '**';
                    i += 2; // Move past the opening double asterisks
                }
            } else {
                let end = input.indexOf('*', i + 1);
                if (end !== -1) {
                    output += `<span class="asterisk">*${input.slice(i + 1, end)}*</span>`;
                    i = end + 1;
                } else {
                    output += '*';
                    i++;
                }
            }
        } else if (input[i] === '"') {
            let end = input.indexOf('"', i + 1);
            if (end !== -1) {
                output += `<span class="quote">"${input.slice(i + 1, end)}"</span>`;
                i = end + 1;
            } else {
                output += '"';
                i++;
            }
        } else if (input[i] === '`') {
            let end = input.indexOf('`', i + 1);
            if (end !== -1) {
                output += `<span class="code">\`${input.slice(i + 1, end)}\`</span>`;
                i = end + 1;
            } else {
                output += '`';
                i++;
            }
        } else {
            output += input[i];
            i++;
        }
    }

    return output;
}