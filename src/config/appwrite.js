import { Client, Account, Databases, Storage, Functions } from "appwrite";

const client = new Client();

const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT;
const project = import.meta.env.VITE_APPWRITE_PROJECT_ID;

if (!endpoint || !project) {
  console.warn(
    "Appwrite configuration is missing. Check VITE_APPWRITE_ENDPOINT and VITE_APPWRITE_PROJECT_ID."
  );
}

if (endpoint) {
  client.setEndpoint(endpoint);
}

if (project) {
  client.setProject(project);
}

const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);
const functions = new Functions(client);

export { client, account, databases, storage, functions };
