const mongoose = require('mongoose');
const connectToCluster = process.env.CLUSTER_CONNECTION; //  url env file me hai CLUSTER_CONNECTION variable me

mongoose.connect(
    connectToCluster,
    {useNewUrlParser: true, useUnifiedTopology: true}
).then((res)=>{
    console.log("Connected to DB..");
}).catch((err)=>{
    console.log(err);
})

module.exports = mongoose;

