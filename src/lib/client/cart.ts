import { writable } from "svelte/store";

interface Item {
    id: number;
    quantity: number;
}

interface Data {
    items: Item[];
    getItem: (id: number) => Item | undefined;
    addItem: (id: number, quantity: number) => void;
    removeItem: (id: number) => void;
    refresh: () => void;
}

const STORAGE_KEY = "cartItems";

const getStoredItems = (): Item[] => {
    if (typeof localStorage === "undefined") {
        return [];
    }

    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
};

const saveItems = (items: Item[]): void => {
    if (typeof localStorage === "undefined") {
        return;
    }

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
        return;
    }
};

let data: Data = {
    items: getStoredItems(),
    getItem: (id: number) => {
        return data.items.find((item) => item.id === id);
    },
    addItem: (id: number, quantity: number = 1) => {
        const existingItemIndex = data.items.findIndex((item) =>
            item.id === id
        );

        if (existingItemIndex >= 0) {
            data.items[existingItemIndex].quantity += quantity;
        } else {
            data.items.push({ id, quantity });
        }

        saveItems(data.items);
        cart.set(data);
    },
    removeItem: (id: number) => {
        const existingItemIndex = data.items.findIndex((item) =>
            item.id === id
        );

        if (existingItemIndex >= 0) {
            if (data.items[existingItemIndex].quantity > 1) {
                data.items[existingItemIndex].quantity -= 1;
            } else {
                data.items.splice(existingItemIndex, 1);
            }

            saveItems(data.items);
            cart.set(data);
        }
    },
    refresh: () => {
        data.items = getStoredItems();
        cart.set(data);
    },
};

export const cart = writable(data);
