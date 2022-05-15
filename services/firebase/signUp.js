import { auth } from './config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setAccount, setCart, setWishlist } from './dataAccess';

export const signUp = (nameInput, emailInput, passwordInput) => {
    return new Promise((resolve, reject) => {
        createUserWithEmailAndPassword(auth, emailInput, passwordInput).then((userCredential) => {
            const uid = userCredential.user.uid;
            setAccount(uid, nameInput, emailInput).then(() => {
                setWishlist(uid, []).then(() => {
                    setCart(uid, []).then(() => {
                        resolve();
                    });
                });
            })
            .catch((error) => {
                console.log(error);
                reject(error);
            });
        })
        .catch((error) => {
            reject(error);
        });
    });
};
