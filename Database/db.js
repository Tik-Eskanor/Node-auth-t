 const {MongoClient, ServerApiVersion} = require("mongodb")
    

    const client = new MongoClient(process.env.MONGO_URL,  {
      serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
      }
  }
)
   
 const DB = client.db('node-auth')

 module.exports = DB