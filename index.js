const { MongoClient } = require('mongodb');

module.exports = class VStringMongoStore {
    mongoClient;
    db;
    collection;

    #collectionName;
    #uri;
    #dbName;
    #user;
    #password;

    constructor({ uri, db, collection, user, password }) {
        this.#collectionName = collection || 'vstring Verification Strings';
        this.#uri = uri;
        this.#dbName = db;
        this.#user = user;
        this.#password = password;
    }

    onDisconnect(cb) {}

    async connect() {
        if (!this.#uri) throw new Error('Need connection URI');
        if (!this.#uri.startsWith('mongodb://')) throw new Error('Needs to start with mongodb://');
        if (!this.#dbName) throw new Error('Need target database name');

        const credentials = this.#user && this.#password ? `${this.#user}:${this.#password}@` : '';
        const uri = this.#uri.slice(10);
        const connectString = `mongodb://${credentials}${uri}`;
        this.mongoClient = new MongoClient(connectString);
        await this.mongoClient.connect();
        this.db = this.mongoClient.db(this.#dbName);
        this.collection = this.db.collection(this.#collectionName);
        await this.flushExpired();
    }

    save(_id, action, expires, params) {
        return this.collection.insertOne({ _id, action, params, expires });
    }

    findById(_id) {
        return this.collection.findOne({ _id });
    }

    findByIdAndDelete(_id) {
        return this.collection.deleteOne({ _id });
    }

    flushExpired() {
        return this.collection.deleteMany({ expires: { $lt: new Date() } });
    }
};
