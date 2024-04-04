const mongoose = require('mongoose');

const connect = (url) => {
    return mongoose.connect(url, { dbName: "nutritionApp" });
}

module.exports = connect;