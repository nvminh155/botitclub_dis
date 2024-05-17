const {Schema, model} = require('mongoose');


const contestRegisterSchema = new Schema({
    contestID: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        default: "",
    },
    registers: {
        type: Array,
        default: [],
    },
})


module.exports = model('ContestRegister', contestRegisterSchema);