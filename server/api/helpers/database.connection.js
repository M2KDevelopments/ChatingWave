const mongoose = require('mongoose');

/**
 * Connects to the MongoDB database
 * @function startMongoDB
 * @memberOf module:api/helpers/database.connection
 * @example
 * require('api/helpers/database.connection').startMongoDB()
 */
exports.startMongoDB = (production = false) => {
    const databasename = process.env.MONGO_DB_NAME;
    const user = process.env.MONGO_DB_USER;
    const password = process.env.MONGO_DB_PASS;

    console.log({user});

    const connection = production ?
        `mongodb+srv://${user}:${password}@m2kdevelopmentscluster.xval1.mongodb.net/${databasename}?retryWrites=true&w=majority`
        :
        `mongodb://127.0.0.1:27017/${databasename}?retryWrites=true&w=majority`;
    mongoose.connect(connection, {});
    mongoose.Promise = global.Promise;
    console.log('✅✅', databasename, 'Datbase Connection ✔✔')
}