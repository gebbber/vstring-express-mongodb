# `vstring-express-mongodb` v1.0.0

## MongoDb data store for use with [`vstring-express`](https://www.npmjs.com/package/vstring-express)

Stores verification strings in a MongoDB database.

Can be used as a model for developing new stores for use with [`vstring-express`](https://www.npmjs.com/package/vstring-express).

---

## Quick Start:

1. Initialize a Mongo store, and use it to initialize Vstring:

```javascript
const Vstring = require('vstring-express');
const MongoStore = require('vstring-express-mongodb');

const vstring = new Vstring(
    new MongoStore({
        uri: process.env.MONGO_URI,
    })
);
```

2. Continue using `vstring-express` as explained in its documentation:

```javascript
const app = express();

app.get('/vstring/:vstring', vstring.intercept);
```

```javascript
const {string, expires} = await vstring.newString({
    action: 'verify-email',
    ttl: 14 * 24 * 60 * 60 * 1000, // 14 days
    email:'someone@example.com'}
});

const link = `http://${host}/vstring/${string}`;

sendEmail({
    to: 'someone@example.com',
    content: `Click: ${link}`,
});
```

```javascript
vstring.handle('verify-email', (req, res, next) => {
    const {email} = req.vparams;
    await markVerified(email);
    res.redirect('/email-verified.html');
})
```

&copy;2024 by Gregory Everett Brandon. See [LICENSE](./LICENSE).
