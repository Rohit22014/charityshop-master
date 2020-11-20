const mongoose = require('mongoose');


/*This model schema will be exported to different files
and used to create and update data in the database using this schema
Create the model schema based on the document structure*/
const CustomersSchema = mongoose.Schema({
    Username: String,
    Password: String,
    FirstNames: String,
    Surname:String,
    Mobile:String,
    Email:String,
    DOB:String,
    "AddressHome.AddressLine1":String,
    "AddressHome.AddressLine2":String,
    "AddressHome.Town":String,
    "AddressHome.countyORcity":String,
    "AddressHome.EIRCODE":String,
    "AddressBilling.AddressLine1":String,
    "AddressBilling.AddressLine2":String,
    "AddressBilling.Town":String,
    "AddressBilling.countyORcity":String,
    "AddressBilling.EIRCODE":String,
    "cachedPaymentInfo.CardNumber":String,
    "cachedPaymentInfo.CardHolder":String,
    "cachedPaymentInfo.PaymentType":String,
    "cachedPaymentInfo.SecurityCode":String,
    "cachedPaymentInfo.ExpiryDate":String
});

module.exports = mongoose.model('Customer', CustomersSchema);
