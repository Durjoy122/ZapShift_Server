const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion } = require('mongodb');

// middlewares
app.use(cors());
app.use(express.json());

// MongoDB Connection + Client Create 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@myfirstmongodb.noasusn.mongodb.net/?appName=MyFirstMongoDb`;
const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();

         
        const db = client.db('db_zap_shift');
        const parcelCollection = db.collection('parcels');

        app.get('/parcels' , async(req,res)=> {
            const query = {}
            const {email} = req.query;
            if(email){
                query.senderEmail = email;
            }
            const cursor = parcelCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })

        app.post('/parcels' , async(req,res)=> {
            const parcel = req.body; 
            const result = await parcelCollection.insertOne(parcel);
            res.json(result); 
        })


        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } 
    finally {
        
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Zap is shifting!');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});