const express = require('express');
const router = express.Router();
const { googleLogin } = require('../controller/googleLogin.controller');


const passport  = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientKey = process.env.GOOGLE_CLIENT_KEY;

router.use(passport.initialize());

passport.use(
    new GoogleStrategy({
        clientID: clientId,
        clientSecret: clientKey,
        callbackURL: '/auth/google/callback'
    },
    (accessToken, refreshToken, profile, done) => {
        return done(null, profile)
    })
);

router.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
    })
);

router.get(
	"/auth/google/callback",
	passport.authenticate("google", { failureRedirect: "/failed" }),
	googleLogin
);

router.get("/failed", (req, res) => {
    res.send("Failed")
})

passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser((user, done) => {
	done(null, user);
});

const { auth_google_login_user } = require('../controller/googleLogin.controller');
router.post('/auth-user-oauth', auth_google_login_user);

module.exports = router;