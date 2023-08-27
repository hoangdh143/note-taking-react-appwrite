const appwrite = require("node-appwrite");
const Query = appwrite.Query;

const formatDateToMMDDYYYY = (date) => {
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${month}/${day}/${year}`;
}


const getYesterday = (today) => {
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    return formatDateToMMDDYYYY(yesterday);
}

module.exports = async function(req, res) {
  const NOTES_COLLECTION = req.env.APP_COLLECTION_NOTES_ID;

  // Initialise the client SDK
  const client = new appwrite.Client();
  const database = new appwrite.Database(client);

  client
      .setEndpoint(req.env.APP_ENDPOINT) // Your API Endpoint
      .setProject(req.env.APP_PROJECT) // Your project ID
      .setKey(req.env.API_KEY) // Your secret API key
  ;

  const TODAY = new Date();
  const today = formatDateToMMDDYYYY(TODAY);
  const yesterday = getYesterday(TODAY);

  const listRemindedDocuments = (databaseId, collectionI) => {

    const queries = [
      Query.equal("remindDate", yesterday),
      Query.equal("remindCounted", 0),
      Query.orderDesc("$createdAt"),
    //   Query.limit(limit)
    ];
    return database.listDocuments(databaseId, collectionId, queries);
  };


  // Get the sum of Profiles and Posts
  const documents = listRemindedDocuments(databaseId, collectionId)
    .then(data => data.documents)
    .map(document => {
        const data = {
            remindDate: today
        };
        return database.updateDocument(databaseId, collectionId, document["$id"], data);
    })
    .then(res.send)
    .catch((err) => res.send(err, 500));;
};

// appwrite functions createDeployment --functionId=64cff8a02182049d382d --entrypoint='index.js' --code="." --activate=true
