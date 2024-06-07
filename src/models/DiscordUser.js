const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    discordId: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    email: { type: String, required: false },  // 이메일 필드 추가
    lastIpAddress: { type: String, required: false }
}, {
    timestamps: true
});

const DiscordUser = mongoose.model('User', UserSchema);
module.exports = DiscordUser;
