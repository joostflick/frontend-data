const OBAWrapper = require("node-oba-api-wrapper");
require('dotenv').config()

const client = new OBAWrapper({
    public: process.env.DB_PUBLIC,
    secret: process.env.DB_SECRET
});

client.get("search", {
    q: 'test',
    refine: true,
    facet:'type(book)',
    count:20
}).then(results => {
        console.log(results)
    })