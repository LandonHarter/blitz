import { QueryDocumentSnapshot, collection, doc, getDoc, getDocs } from "firebase/firestore";
import { firestore } from "./init";

export enum Roles {
    ADMIN = 'admin',
};

export enum Permissions {
    ReadTeacherApplications = 'read:teacherapps',
    WriteTeacherApplications = 'write:teacherapps',
};

export const getPermissions = async (role: Roles): Promise<Permissions[]> => {
    const roleRef = doc(collection(firestore, 'roles'), role.toString());
    const roleData = await getDoc(roleRef);

    if (!roleData.exists() || !roleData.data()) {
        return [];
    }

    const permissions: string[] = roleData.data().permissions;
    return permissions as Permissions[];
};

export const hasRole = async (uid: string, role: Roles): Promise<boolean> => {
    const rolesRef = doc(collection(firestore, 'roles'), role.toString());
    const roleData = await getDoc(rolesRef);

    if (!roleData.exists() || !roleData.data()) {
        return false;
    }

    return roleData.data().users.includes(uid);
};

export const getRoles = async (uid: string): Promise<Roles[]> => {
    const rolesRef = collection(firestore, 'roles');
    const allRoles = await getDocs(rolesRef);

    const userRoles: Roles[] = [];
    allRoles.forEach((result: QueryDocumentSnapshot) => {
        const roleData = result.data();
        if (roleData.users.includes(uid)) {
            userRoles.push(result.id as Roles);
        }
    });

    return userRoles;
};

export const hasPermission = async (uid: string, permission: Permissions): Promise<boolean> => {
    const userRoles = await getRoles(uid);
    for (const role of userRoles) {
        const permissions = await getPermissions(role);
        if (permissions.includes(permission)) {
            return true;
        }
    }

    return false;
};