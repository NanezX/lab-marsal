import { v4 as uuidv4, v5 as uuidv5 } from 'uuid';

enum NamespaceUUID {
    Patien = "patient"
}

export function generateRandomUUID() {
    return uuidv4()
}

export function generateFromNameUUID(value: string, namespace: NamespaceUUID) {
    return uuidv5(value, namespace)
}