const mongoose = require('mongoose');
const { decodeBase64 } = require('../../utilities/Base64Util');

const { UserModel, User } = require('../../models/UserModel');

/**
 * connectDB function pen connection to mongoDB cloud database discover-app
 * @returns instance object mongoose.connection
 */

const connectDB = async () => {
    const host = process.env.DB_HOST;
    const user = process.env.DB_USER;
    const dbName = process.env.DB_NAME;
    const dbToken = process.env.DB_TOKEN;
    const protocol = process.env.DB_PROTOCOL;
    const url = `${protocol}://${user}:${decodeBase64(dbToken)}@${host}/${dbName}`;
    await mongoose.connect(url);

    const dbConnection = mongoose.connection;
    dbConnection.once("open", (_) => {
        console.log(`Database connected: ${url}`);
    });

    dbConnection.on("error", (err) => {
        console.error(`connection error: ${err}`);
    });

    return dbConnection
}

module.exports = { connectDB }