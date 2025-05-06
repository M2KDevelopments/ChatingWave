const mongoose = require('mongoose');

const schema = mongoose.Schema({
  name: { type: String, required: true, minlength: 3 },
  email: { type: String, required: true, unique: true, match: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/ },
  image: { type: String },
  verified: { type: Boolean, default: false },

  verifiedDeadline: { type: Date },
  googleID: { type: String },
  facebookID: { type: String },
  linkedinID: { type: String },
  referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  referralCode: { type: String, required: true },
  password: { type: String, required: true },
  ip: { type: String },
  gcmWeb: { type: String, default: '' },
  gcmAndroid: { type: String, default: '' },
  gcmChrome: { type: String, default: '' },
  refreshToken: { type: String, default: '' },

  // Open AI
  openAIUs: { type: Boolean, default: false },
  openAIKey: { type: String, default: '' },
  openAITemperature: { type: Number, default: 0.8 },
  openAIModel: { type: String, default: 'gpt-3.5-turbo' },
  openAITokens: { type: Number, default: 0 },
  openAIMaxTokens: { type: Number, default: 350, min: 300 },

  
  // Business Details
  businessName: { type: String, default: '' },
  businessDescription: { type: String, default: '' },
  businessIdeal: { type: String, default: '' },
  businessWebsite: { type: String, default: '' },


  // Google Sheets
  googleSheetsAccessToken: { type: String, default: '' },
  googleSheetsRefreshToken: { type: String, default: '' },
  googleSheetExpiresAt: { type: Number, default: 0 },

  // mailchimp
  mailchimpAccessToken: { type: String, default: '' },
  mailchimpServer: { type: String, default: '' },

  // monday.com
  mondayAccessToken: { type: String, default: '' },

  // zoho
  zohoAccessToken: { type: String, default: '' },
  zohoRefreshToken: { type: String, default: '' },
  zohoAPIDomain: { type: String, default: '' },
  zohoExpiresIn: { type: Number, default: 0 },

  //mailerlite
  mailerliteAccessToken: { type: String, default: '' },

  //sendgrid
  sendgridAccessToken: { type: String, default: '' },


  //convertkit
  convertKitAccessToken: { type: String, default: '' },


  //active campaign
  activecampaignAccessToken: { type: String, default: '' },
  activecampaignURL: { type: String, default: '' },


  // zoho
  ghlAccessToken: { type: String, default: '' },
  ghlRefreshToken: { type: String, default: '' },
  ghlLocationId: { type: String, default: '' },
  ghlCompanyId: { type: String, default: '' },
  ghlExpiresIn: { type: Number, default: 0 },


  // HubSpot
  hubspotAccessToken: { type: String, default: '' },
  hubspotRefreshToken: { type: String, default: '' },
  hubspotExpiresIn: { type: Number, default: 0 },

},
  {
    timestamps: true,
  });


module.exports = mongoose.model('User', schema);
