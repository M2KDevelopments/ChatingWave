const mongoose = require('mongoose');

const schema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assistantTool: { type: mongoose.Schema.Types.ObjectId, ref:"AssistantTool", required: true },
    image: { type: String, default: "" },
    audio: { type: String, default: "" },
    field: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, required: true },
},
    {
        timestamps: true,
    });


module.exports = mongoose.model('AssistantToolParameter', schema);