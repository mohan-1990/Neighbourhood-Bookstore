import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './config';

export const signIn = (emailInput, passwordInput) => {
    return new Promise((resolve, reject) => {
        signInWithEmailAndPassword(auth, emailInput, passwordInput).then((user) => {
            resolve(user);
        })
        .catch((error) => {
            reject(error);
        });
    });
};