const Joi = require ('joi')
const mongoose = require ('mongoose')

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required : true,
        minlength: 5,
        maxlength: 50
    },

    isGold: {
        type: Boolean,
        default: false,
    },
    phoneNumber: {
        type: String,
        required : true,
        minlength : 5,
        maxlength : 50,
    }
    
})

// now create model after creating schema

const Customer = mongoose.model('Customer', customerSchema)

function validateCustomer(customer){
    const schema =Joi.object({
        name: Joi.string().min(5).max(50).required(),
        isGold: Joi.boolean(),
        phoneNumber: Joi.string().min(5).max(50).required()
    })
    
 

    return schema.validate(customer);
}

exports.Customer = Customer;
exports.validate = validateCustomer; 

