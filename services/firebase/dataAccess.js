import { db } from './config';
import { collection, getDocs, where, query } from "firebase/firestore";
import { doc, setDoc } from 'firebase/firestore';

export const getAllBooks = async () => {
    try {
        const items = await getDocs(collection(db, "books"));
        let books = [];
        items.forEach((item) => {
            books.push(item.data());
        });
        return books;
    }
    catch(error) {
        console.log("Error getting books: ", error);
    } 
};

export const getBookById = async (id) => {
    try {
        const q = query(collection(db, "books"), where("id", "==", id));
        const items = await getDocs(q);
        let book;
        items.forEach((item) => {
            book = item.data();
        });
        return book;
    }
    catch(error) {
        console.log("Error getting book by id: " + id, error);
    }
};

export const setAccount = async (uid, nameInput, emailInput) => {
    try {
        await setDoc(doc(db, 'account', uid), {
            name: nameInput,
            email: emailInput,
        });
    }
    catch(error) {
        console.log("Error setting wishlist for uid: " + uid, error);
    }
};

export const setWishlist = async (uid, items) => {
    try {
        await setDoc(doc(db, 'wishlist', uid), {
            items: items,
        });
    }
    catch(error) {
        console.log("Error setting wishlist for uid: " + uid, error);
    }
};

export const setCart = async (uid, items) => {
    try {
        await setDoc(doc(db, 'cart', uid), {
            items: items,
        });
    }
    catch(error) {
        console.log("Error setting cart for uid: " + uid, error);
    }
};

export const setOrder = async (orderId, params) => {
    try {
        await setDoc(doc(db, 'orders', orderId), {
            ...params
        });
    }
    catch(error) {
        console.log("Error setting cart for uid: " + uid, error);
    }
};