# `vstring-express-mongodb` v0.0.1
## MongoDb data store for use with [`vstring-express`](https://www.npmjs.com/package/vstring-express)


Stores verification strings in a MongoDB database.

Can be used as a model for developing new stores for use with [`vstring-express`](https://www.npmjs.com/package/vstring-express).

---

## Quick Start

1. Add `vstring-express` and `vstring-express-mongodb` to an Express app...
```javascript
const express = require('express');
const app = express();

const vstring = require('vstring-express')
const store = require('vstring-express-mongodb')
```
2. Before initializing `vstring` with `vstring.intercept(path, app)`, configure the MongoDB data store::
```javascript
const uri = 'mongodb://localhost:27017';
const db = 'My Verification Strings';

store({uri, db});
```
3. Add the store to `vstring-express` with `vstring.use()`:
```javascript
vstring.use({store}); // configured vstring-express-mongodb data store
```
4. Add `vstring-express` to `app` using `vstring.intercept`: *(see `vstring-express` docs)*
```javascript
// Install verification string middleware
vstring.intercept('/vstring', app);
```
5. And then configure the rest of the app:  *(see `vstring-express` docs)*
```javascript
// Add route to initiate email verification request
app.get('/request' (req, res)=>{
    
    const {string} = vstring.new({'verify-email', vparams: {email}});
    
    const link = `http://${req.hostname}/vstring/${string}/complete.html`;
    
    console.log({email: {
        to: email,
        content: `Click to verify: ${link}`
    }});

})

// Add '/complete.html' (end of the URL above)
app.get('/complete.html', (req, res)=>{
    res.send('Complete!');
})

// Add handler for our 'verify-email' action:
vstring.handle('verify-email', (req, res)=>{
    const {email} = req.vparams;
    markEmailVerified(email);
    res.redirect(req.url);
})

app.listen(3000);
```

---

## Configuration Options:

### `MongoStore({uri, db, collection, user, password})`

- `uri`: MongoDB connection string (`"mongodb://hostname:port"`)
- `db`: MongoDB database name **(required)**
- `collection`: Collection to use (default is `'vstring Verification Strings'`)
- `user`: MongoDB username, if required
- `password`: MongoDB password, if required

---
&copy;2021 by Gregory Everett Brandon. See [LICENSE](./LICENSE).