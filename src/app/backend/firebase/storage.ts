import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { storage } from "./init"

export const uploadFile = async (file: Blob, path: string) => {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return url;
};

export const uploadAndReplaceFile = async (file: Blob, path: string) => {
    const storageRef = ref(storage, path);

    try {
        const url = await getDownloadURL(storageRef);
        await deleteObject(storageRef);
    } catch (error) { }

    await uploadBytes(storageRef, file);
    const newUrl = await getDownloadURL(storageRef);
    return newUrl;
};