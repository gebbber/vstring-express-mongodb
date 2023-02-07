const app = require('express')();
const vstring = require('vstring-express');

const PORT = process.env.PORT || 3000;
const uri = process.env.MONGO_URL || 'mongodb://localhost:27017';
const db = process.env.MONGO_DB || 'vstring-express-mongodb-test';

// Install MongoDB Store
const store = require('./index.js')({
    uri,
    db,
});

vstring.use({ store });

// Install middleware
vstring.intercept('/vstring', app);

// Routes...
app.get('/verify-email', async (req, res) => {
    const userId = req.session?.userId;
    const { email } = awaitFindUser(userId);

    const action = 'verify-email';
    const params = { email };
    const { string, expires } = await vstring.new({ action, params, seconds: 90 });

    sendEmail(email, string, expires);

    res.send('Please check your email and click the link to verify your address...');
});

app.get('/done.html', (req, res) => {
    res.send('Done!');
});

// Add a handler for vstring action:
vstring.handle('verify-email', (req, res) => {
    markEmailAddressVerified(req.vstring);

    res.redirect(req.url);

    setTimeout(process.exit, 250);
});

app.use((req, res) => {
    res.sendStatus(404);
});

app.listen(PORT, () => {
    console.log(`\nListening on port ${PORT}...`);
    console.log(instructions);
});

// Below helper functions for demo purposes:
const awaitFindUser = () => {
    return { email: 'someone@example.com' };
};
const markEmailAddressVerified = () => {
    console.log('\nEmail verified!');
};
const sendEmail = (email, str, exp) => {
    console.log('Email sent to console.log:', {
        to: email,
        date: new Date(),
        subject: 'Password Reset',
        body: `Click the following link to verify your email address:\n\nhttp://localhost:${PORT}/vstring/${str}/done.html. This link will be valid until ${exp}.`,
    });
};

const instructions = `
1. Navigate to http://localhost:3000/verify-email
2. The console (here) will show an object representing the email sent
3. Navigate to the link found in the email
`;
