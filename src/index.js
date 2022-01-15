const {MongoClient} = require('mongodb');

const settings = {collection: 'vstring Verification Strings'};

module.exports = ({uri, db, collection, user, password}={}) => {
    
    if (collection) settings.collection = collection;
    if (uri) settings.uri = uri;
    if (db) settings.db = db;
    if (user) settings.user = user;
    if (password) settings.password = password;
    
    return { 
        init,
        flushExpired,
        
        save,
        findById,
        findByIdAndDelete,
    }
    
}

let db; //the db collection object

// Do whatever needs to get done to initialize a
// connection; etc.
const init = async () => {
    if (!settings.uri) throw new Error('Need connection URI');
    if (!settings.uri.startsWith('mongodb://')) throw new Error('Needs to start with mongodb://');
    if (!settings.db) throw new Error('Need target db');
    const splitUrl = settings.uri.slice(10).split('/');
    const creds = (settings.user && settings.password) ? `${settings.user}:${settings.password}@` : '';
    splitUrl[0] = creds+splitUrl[0];

    const client = new MongoClient('mongodb://'+splitUrl.join('/'));
    await client.connect();
    const rightDb = client.db(settings.db);
    const collection = rightDb.collection(settings.collection);
    db = collection;
}


// Guaranteed to get String for each of '_id',
// 'action', 'params'; and Number for 'expires'
function save({_id, action, params, expires}) {
    return db.insertOne({_id, action, params, expires});
}


// Must return same as fields/formats as above,
// or null if not found
function findById(_id) {
    return db.findOne({_id});    
}


// No need to return anything but a promise
function findByIdAndDelete(_id) {
    return db.deleteOne({_id});
}

// 'expires' is millisecs since Unix epoch; can do
// simple number comparison with parameter
function flushExpired(thanThis) {
    return db.deleteMany({expires: {$lt: thanThis}});
}
