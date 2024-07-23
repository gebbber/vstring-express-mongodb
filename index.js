const { MongoClient } = require('mongodb');

module.exports = class VStringMongoStore {
    mongoClient;
    db;
    collection;

    #collectionName;
    #uri;

    constructor({ uri, collection }) {
        this.#collectionName = collection || 'Verification Strings';
        this.#uri = uri;
    }

    async connect() {
        if (!this.#uri) throw new Error('Need connection URI');
        this.mongoClient = new MongoClient(this.#uri);
        await this.mongoClient.connect();
        this.collection = this.mongoClient.db().collection(this.#collectionName);
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
