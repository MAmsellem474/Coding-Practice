import path from "path";
import fs from "fs";
const DB_PATH = path.join(import.meta.dirname, "../data/users.json");

export function readUsers(){
    const data = fs.readFileSync(DB_PATH, "utf-8").trim();
    if (!data){
        return []
    } else {
        return JSON.parse(data);
    }
}

export function writeUsers(users){
    const data = JSON.stringify(users, null, 2);
    fs.writeFileSync(DB_PATH, data, "utf-8");
}

export function findByEmail(email){
    return readUsers().find((u) => u.email === email) || null
}

export function findByIDl(id){
    return readUsers().find((u) => u.id === id) || null
}