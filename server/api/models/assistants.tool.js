const mongoose = require('mongoose');

const schema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    image: { type: String, default: "" },
    audio: { type: String, default: "" },
    field: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, required: true },

    // For sending information to
    webhook_url: { type: String, default: "" },
    webhook_headers: { type: String, default: "" },
    webhook_method: { type: String, default: "" },
},
    {
        timestamps: true,
    });


module.exports = mongoose.model('AssistantTool', schema);