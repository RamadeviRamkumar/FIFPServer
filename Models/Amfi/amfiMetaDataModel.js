// const mongoose = require('mongoose');

// const metaDataSchema = new mongoose.Schema({
//     fund_hose:{ type:String},
//     scheme_type:{ type:String},
//     scheme_category:{ type:String},
//     scheme_code:{ type:Number},
//     scheme_name: { type:String}
// })

// const schemeMetaDataSchema = new mongoose.Schema(
//     {
//       meta: metaDataSchema,
//       status: { type: String, required: true },
//       scheme_code: { type: Number, required: true, unique: true }, 
//     },
//     // {
//     //   timestamps: true, 
//     // }
//   );

  

// const result = new mongoose.model('metaData',schemeMetaDataSchema)

// module.exports = result



const mongoose = require('mongoose');


const metaDataSchema = new mongoose.Schema({
  fund_house: { type: String },
  scheme_type: { type: String },
  scheme_category: { type: String },
  scheme_code: { type: Number },
  scheme_name: { type: String }
});


const schemeMetaDataSchema = new mongoose.Schema(
  {
    meta: metaDataSchema,
    status: { type: String, required: true },
    scheme_code: { type: Number, required: true, unique: true }, 
  }
);


// schemeMetaDataSchema.index({ scheme_code: 1 });
// schemeMetaDataSchema.index({ 'meta.scheme_name': 1 });
// schemeMetaDataSchema.index({ 'meta.scheme_category': 1 }); 


const SchemeMetaData = mongoose.model('SchemeMetaData', schemeMetaDataSchema);
module.exports = SchemeMetaData;
