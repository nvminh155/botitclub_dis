const {Schema, model} = require('mongoose');


const levelSchema = new Schema({
    userId: {
        type: String,
        required: false,
        default: "123"
    },
    guildId: {
        type: String,
        require: false,
    },
    xp: {
        type: Number,
        default: 0
    },
    level: {
        type: Number,
        default: 1
    }
})


module.exports = model('Level', levelSchema);