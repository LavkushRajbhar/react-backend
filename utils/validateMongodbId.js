const mongoose = require("mongoose");

const validateMongoDbId = (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("This ID is not valid or not found");
    }
};

module.exports = validateMongoDbId;
