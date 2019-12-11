const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

var employeeSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: 'this is field is required'
    },
    email: {
        type: String
    },
    mobile: {
        type: String
    },
    city: {
        type: String
    },
   
},
{
    timestamps: true,
}
);



employeeSchema.path('email').validate((val) => {
    emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(val)
}, 'invalid e-mail')

module.exports = mongoose.model('Employee', employeeSchema)