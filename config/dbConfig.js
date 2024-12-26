const { default: mongoose } = require("mongoose");
const dbConfig = () => {
    try {
        const conn = mongoose.connect("mongodb+srv://rajbharlav90:nFIJmbfWP8f80EA6@myreact.b4zik.mongodb.net/?retryWrites=true&w=majority&appName=myreact");
        console.log("MongoDB connected successfully");
    }catch(error) {
    console.log("Could not connect to MongoDB");}
}

module.exports = dbConfig;