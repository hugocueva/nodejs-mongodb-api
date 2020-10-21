const { mongoose } = require(".");
const mongoosePaginate = require('mongoose-paginate-v2'); 

module.exports = mongoose => {
    const schema = mongoose.Schema({ 
        title: String, 
        description: String, 
        published: Boolean
    }, {
        timestamps: true
    });       

    schema.method("toJSON", function(){
        const {__v, _id, ...object} = this.toObject(); 
        object.id = _id; 
        return object; 
    }); 


    schema.plugin(mongoosePaginate); 

    const Tutorial = mongoose.model("tutorial", schema); 
    return Tutorial; 
}; 