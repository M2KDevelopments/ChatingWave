const mongoose = require('mongoose');

const schema = mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, default: "" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    api_key: { type: String, required: true }, // open key
    assistant_id: { type: String, required: true }, // openai assistant id
    tools: { type: [String], default: [] },
    voice: { type: String, default: "alloy" },
    model: { type: String, default: "gpt-3.5-turbo" },
    temperature: { type: Number, default: 0.8, min: 0.0, max: 2.0 },
    files: { type: Array, default: [] }, // url, name, type
    vector_store_id: { type: String, default: "" }, //https://platform.openai.com/docs/api-reference/vector-stores
    websites: { type: [String], default: [] },
    prompt: { type: String, default: "" },
    elevenlabs_voice_id: { type: String, default: "" },
    webhook_url: { type: String, default: "" },
    webhook_headers: { type: String, default: "" },
    webhook_method: { type: String, default: "" },
},
    {
        timestamps: true,
    });

module.exports = mongoose.model('Assistant', schema);