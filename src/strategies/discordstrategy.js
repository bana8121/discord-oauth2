const DiscordStrategy = require('passport-discord').Strategy;
const passport = require('passport');
const DiscordUser = require('../models/DiscordUser');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await DiscordUser.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

passport.use(new DiscordStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.CLIENT_REDIRECT,
    scope: ['identify', 'email', 'guilds']  // 이메일 스코프 추가
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const user = await DiscordUser.findOne({ discordId: profile.id });
        if (user) {
            // 이메일이 업데이트되었을 경우 처리
            if (user.email !== profile.email) {
                user.email = profile.email;
                await user.save();
            }
            return done(null, user);
        } else {
            const newUser = new DiscordUser({
                discordId: profile.id,
                username: profile.username,
                email: profile.email  // 새 사용자 생성 시 이메일도 저장
            });
            const savedUser = await newUser.save();
            return done(null, savedUser);
        }
    } catch (err) {
        return done(err, null);
    }
}));
