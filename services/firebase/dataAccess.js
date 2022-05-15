import { db } from '../firebase-config';
import { collection, getDocs, where, query } from "firebase/firestore";


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