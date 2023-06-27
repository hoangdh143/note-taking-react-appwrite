import {Client as Appwrite, Databases, Account, Query} from "appwrite";
import { Server } from "../utils/config";

let api = {
  sdk: null,

  provider: () => {
    if (api.sdk) {
      return api.sdk;
    }
    let appwrite = new Appwrite();
    appwrite.setEndpoint(Server.endpoint).setProject(Server.project);
    const account = new Account(appwrite);
    const database = new Databases(appwrite);

    api.sdk = { database, account };
    return api.sdk;
  },

  createAccount: (email, password, name) => {
    return api.provider().account.create("unique()", email, password, name);
  },

  getAccount: () => {
    let account = api.provider().account;
    return account.get();
  },

  createSession: (email, password) => {
    return api.provider().account.createEmailSession(email, password);
  },

  deleteCurrentSession: () => {
    return api.provider().account.deleteSession("current");
  },

  createDocument: (databaseId, collectionId, data, permissions) => {
    return api
      .provider()
      .database.createDocument(databaseId, collectionId, 'unique()', data, permissions);
  },

  listDocuments: (databaseId, collectionId, lastId = null, limit = 20) => {
    const queries = lastId ? [
      Query.orderDesc("$createdAt"),
      Query.limit(limit),
      Query.cursorAfter(lastId)
    ] : [
      Query.orderDesc("$createdAt"),
      Query.limit(limit)
    ];
    return api.provider().database.listDocuments(databaseId, collectionId, queries);
  },

  listDocumentsWithContent: (databaseId, collectionId, searchTerm) => {
    return api.provider().database.listDocuments(databaseId, collectionId, [
      Query.search("content", searchTerm),
    ]);
  },

  listDocumentsWithName: (databaseId, collectionId, searchTerm) => {
    return api.provider().database.listDocuments(databaseId, collectionId, [
      Query.search("name", searchTerm),
    ]);
  },

  listDocumentsWithIds: (databaseId, collectionId, ids) => {
    return api.provider().database.listDocuments(databaseId, collectionId, [
        Query.equal("$id", ids),
    ]);
  },

  listDocumentsWithCategoryId: (databaseId, collectionId, categoryId, lastId = null, limit = 20) => {
    const queries = lastId ? [
        Query.equal("categoryId", categoryId),
      Query.orderDesc("$createdAt"),
      Query.limit(limit),
      Query.cursorAfter(lastId)
    ] : [
      Query.equal("categoryId", categoryId),
      Query.orderDesc("$createdAt"),
      Query.limit(limit)
    ];
    return api.provider().database.listDocuments(databaseId, collectionId, queries);
  },

  listTop5RecentDocuments: (databaseId, collectionId) => {
    return api.provider().database.listDocuments(databaseId, collectionId, [
      Query.orderDesc("$createdAt"),
      Query.limit(5),
    ])
  },

  updateDocument: (databaseId, collectionId, documentId, data, permissions) => {
    return api
      .provider()
      .database.updateDocument(databaseId, collectionId, documentId, data, permissions);
  },

  deleteDocument: (databaseId, collectionId, documentId) => {
    return api.provider().database.deleteDocument(databaseId, collectionId, documentId);
  },
};

export default api;
