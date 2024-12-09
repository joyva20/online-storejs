import { 
    getFirestore, collection, getDocs, getDoc, doc, addDoc, query, where 
} from 'firebase/firestore';
import app from './init.jsx';

const firestore = getFirestore(app);

export async function retrieveData(collectionName) {
    try {
        if (!collectionName) {
            throw new Error("Collection name is required");
        }
        const snapshot = await getDocs(collection(firestore, collectionName));
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        return data;
    } catch (error) {
        console.error("Error retrieving data:", error);
        throw error;
    }
}

export async function retrieveDataById(collectionName, id) {
    try {
        if (!collectionName || !id) {
            throw new Error("Collection name and ID are required");
        }
        const snapshot = await getDoc(doc(firestore, collectionName, id));
        if (!snapshot.exists()) {
            throw new Error(`No document found with ID: ${id}`);
        }
        const data = snapshot.data();
        return { id: snapshot.id, ...data };
    } catch (error) {
        console.error("Error retrieving data by ID:", error);
        throw error;
    }
}

export async function signUp(userData, callback) {
    try {
        if (!userData || !userData.email) {
            throw new Error("User data with a valid email is required");
        }
        const q = query(
            collection(firestore, 'users'),
            where('email', '==', userData.email)
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        
        if (data.length === 0) {
            await addDoc(collection(firestore, 'users'), userData);
            if (callback && typeof callback === 'function') {
                callback();
            }
        } else {
            console.warn("User already exists with this email");
        }
    } catch (error) {
        console.error("Error signing up user:", error);
        throw error;
    }
}

export default firestore;
