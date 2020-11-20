const Customer = require('../models/customer.model.js');
const Product = require('../models/product.model.js');
var Cart = require('../models/cart.model');
var handlebars = require('handlebars');
var hbs = require('nodemailer-express-handlebars');
var fs = require('fs');
var imgPath = 'C:\\Users\\alexm\\OneDrive\\Desktop\\Projects\\charityshop-master\\app\\controllers\\shoes.jpeg';
var nodemailer = require('nodemailer');
var flag=false;
var cart = new Cart(cart ? cart : {});
const { promisify } = require('util');
//const Transaction = require('../models/transaction.model.js');

//When the app is in the root location show the homepage
exports.root = (req, res) => {
    res.render('home_view')
};

//When the user has logged in and on home page
exports.loggedIn = (req, res) => {
    res.render('home_view')
};

exports.basket = (req, res) => {
    res.render('basket_view')
}
exports.Confirmation = async (req, res) => {
    var email = req.params.m;
    try {
        // create reusable transporter object using the default SMTP transport
        const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'help.jumble@gmail.com',
                    pass: 't3ampr0ject'
                }
        })

        transporter.use('compile', hbs({
            viewEngine: {
                extname: '.hbs', // handlebars extension
                partialsDir: 'views',
                layoutsDir: 'views',
                defaultLayout: 'confirmationEmail_view',
            },
            viewPath: 'views',
            extName: '.hbs'
        }))

        // send mail with defined transport object
        const mailOptions = {
            from: 'help.webtowardrobe@gmail.com',
            to: '' + email + '',
            subject: 'Order Confirmation',
            text: 'Hello world?', // plain text body
            template: 'confirmation_view',
            context: {
                    products: cart.generateArray(),
                    totalPrice: cart.totalPrice,
                    totalQty: cart.totalQty,
                    DeliveryPrice : cart.DeliveryPrice,
                    finalPrice : cart.finalPrice,
            }
        }
        const info = await transporter.sendMail(mailOptions)

        console.log('Message sent: %s', info.messageId)
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    } catch (error) {
        console.log(error)
    }
    res.render('confirmation_view',{
        products: cart.generateArray(),
        totalPrice: cart.totalPrice,
        totalQty : cart.totalQty,
        DeliveryPrice : cart.DeliveryPrice,
        finalPrice : cart.finalPrice,
    });
}

exports.Checkout=(req, res) => {
    var search = req.params.s;
    Customer.find({ Username: search})
        .then(data => {
            res.render('checkout_view',{
                Data : data,
                products: cart.generateArray(),
                totalPrice: cart.totalPrice,
                totalQty : cart.totalQty,
                DeliveryPrice : cart.DeliveryPrice,
                finalPrice : cart.finalPrice,
                }
            );
        }).catch(err => {
        res.status(500).send({
            message: err.message || "An error occurred while find the Customer."
        });
    });
}

exports.cart =(req,res) => {
    return res.render('basket_view', {products: cart.generateArray(), totalPrice: cart.totalPrice});
}

exports.addtocart =(req,res) => {
    var Name = req.params._id;
    Product.findById(Name, function(err, user) {
                cart.add(user,req.params._id);
                req.params.cart=cart;
                res.render('basket_view', {products: cart.generateArray(), totalPrice: cart.totalPrice});
    });
}

exports.addition =(req, res) => {
    var sample = req.params._id;
    cart.increaseByOne(sample);
    res.render('basket_view',{products: cart.generateArray(), totalPrice: cart.totalPrice});
}

exports.subtraction =(req, res) => {
    var sample = req.params._id;
    cart.subtractByOne(sample);
    res.render('basket_view',{products: cart.generateArray(), totalPrice: cart.totalPrice});
}

exports.check = (req,res) =>{
    let encrypted= req.params.k;
    let buff = Buffer.from(encrypted, 'base64');  
    let text = buff.toString('ascii');
    var ar=text.split(" ");
    let user=ar[0];
    let password=ar[1];
    flag=false;
    Customer.find({ Username: user})
    .then(data=>{
        var temp=JSON.stringify(data);
        if(temp.length>2){
          Customer.find({ Password: password})
          .then(result=>{
                var temp2=JSON.stringify(result);
                if(temp2.length>2){
                    flag=true;
                    res.send(flag);
                }else{
                    console.log("This is not a valid password");
                    res.send(flag);
                }
           });
        }else{
            console.log("This is not a valid username");
            res.send(flag);
        }
    })
}

//When the user wants to change their password show the reset page
exports.reset = (req, res) => {
    res.render('reset_view')
};

//Find email provided in all registered emails
exports.resetEmail = (req, res) => {
    var search = req.params.s;
    Customer.find({ Email: search})
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "An error occurred while find the Customer."
        });
    });
};

//Search all users for Username provided
exports.loginVerification = (req, res) => {
    var search = req.params.s;
    Customer.find({ Username: search})
    .then(data => {
        res.send(data);
        console.log(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "An error occurred while find the Customer with the username search."
        });
    });
};

//Search Bar
exports.searchProducts = (req, res) => {
    var search = req.params.s;
    console.log("Searching For Products: "+search)
    Product.find({ ProductName: new RegExp(search,"ig")})
    .then(Products => {
        res.render('product_view',{
            results: Products
          });
    }).catch(err => {
        res.status(500).send({
            message: err.message || "An error occurred while retrieving all Products."
        });
    });
};

//Search bar with user logged in
exports.searchProductsLoggedIn = (req, res) => {
    var search = req.params.s;
    console.log("Searching For Products: "+search)
    Product.find({ ProductName: new RegExp(search,"ig")})
    .then(Products => {
        res.render('product_view',{
            results: Products
          });
    }).catch(err => {
        res.status(500).send({
            message: err.message || "An error occurred while retrieving all Products."
        });
    });
};

//Login Page View
exports.loginView = (req, res) => {
    res.render('login_view');
};

//Registration Page View
exports.registrationView = (req, res) => {
    res.render('registration_view');
};

//This function is to search the database by a Product Name
exports.searchProductsByName = (req, res) => {
    var Name = req.params._id;
    Product.find({ ProductName: Name})
    .then(Products => {
        res.render('fullProduct_view',{
            results: Products
          });
    }).catch(err => {
        res.status(500).send({
            message: err.message || "An error occurred while retrieving all Products."
        });
    });
};

//Logged in version
exports.searchProductsByNameLoggedIn = (req, res) => {
    var Name = req.params._id;
    var encrypted= req.params._m;
    Product.find({ ProductName: Name})
    .then(Products => {
        res.render('fullProduct_view',{
            results: Products
          });
    }).catch(err => {
        res.status(500).send({
            message: err.message || "An error occurred while retrieving all Products."
        });
    });
};

//Update Customer informatiion
exports.updatePassword = (req, res) => {
    if(!req.body) {
        return res.status(400).send({
            message: "Customer content cannot be empty"
        });
    }


    Customer.updateOne({Email:req.params.s},  
    {Password:req.params.m}, 
       { new: true })
    .then(customer => {
        if(!customer) {
            return res.status(404).send({
                message: "Customeromer not found with Username " + req.params.Username
            });
        }
        res.send(customer);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Customer not found with Username" + req.params.Username
            });               
        }
        return res.status(500).send({
            message: "Error updating Customer with Username " + req.params.Username
        });
    });
};

/*Registration
This function is for creating a new customer*/
exports.registration = (req, res) => {
    //Request can't be empty for required fields
    if(!req.body.DOB || !req.body.FirstNames|| !req.body.Surname || !req.body.Mobile|| !req.body.Email || !req.body.AddressLine1 || !req.body.Town|| !req.body.countyORcity || !req.body.EIRCODE) {
        return res.status(400).send({
            message: "Customer content cannot be empty!"
        });
    }

    const customer = new Customer({
        Username: req.body.Username,
        Password: req.body.Password,
        FirstNames: req.body.FirstNames,
        Surname: req.body.Surname,
        MobilePhone: req.body.MobilePhone,
        HomePhone: req.body.HomePhone,
        Email: req.body.Email,
        DOB: req.body.DOB,
        "AddressHome.AddressLine1": req.body.AddressLine1,
        "AddressHome.AddressLine2": req.body.AddressLine2,
        "AddressHome.Town": req.body.Town,
        "AddressHome.countyORcity": req.body.countyORcity,
        "AddressHome.EIRCODE": req.body.EIRCODE,
        "AddressBilling.AddressLine1":req.body.AddressLine1,
        "AddressBilling.AddressLine2":req.body.AddressLine2,
        "AddressBilling.Town":req.body.Town,
        "AddressBilling.countyORcity":req.body.countyORcity,
        "AddressBilling.EIRCODE":req.body.EIRCODE,
        "cachedPaymentInfo.CardNumber":req.body.CardNumber,
        "cachedPaymentInfo.CardHolder":req.body.CardHolder,
        "cachedPaymentInfo.PaymentType":req.body.PaymentType,
        "cachedPaymentInfo.SecurityCode":req.body.SecurityCode,
        "cachedPaymentInfo.ExpiryDate":req.body.ExpiryDate
    });

    //save it to the database
    customer.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "An error occurred while creating the Customer."
        });
    });
};

//Find all registered users
exports.findAllCustomers = (req, res) => {
    Customer.find()
    .then(Customers => {
        res.render('client_view',{
            results: Customers
          });
    }).catch(err => {
        res.status(500).send({
            message: err.message || "An error occurred while retrieving all Customers."
        });
    });
};

exports.sendEmails = (req,res) => {
    var rand = req.params.s;
    var email=req.params.m;
    var deliverer = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'help.webtowardrobe@gmail.com',
        pass: 't3ampr0ject'
      }
    });

    var content = {
      from: 'help.webtowardrobe@gmail.com',
      to: ''+email+'',
      subject: 'Code for Resetting your Password',
      html:'<h1>Reset Password</h1><br><p>A password reset event has been triggered.</p><br><p>To complete the password reset process, use this code:'+rand+'.</p>'
    };

    deliverer.sendMail(content, function(err, res){
      if (err) {
        console.log(err);
      } else {
        console.log('Email sent: ' + res.response);
      }
    });
}
    

//Update Customer informatiion
exports.updateCustomer = (req, res) => {
    if(!req.body) {
        return res.status(400).send({
            message: "Customer content cannot be empty"
        });
    }


    Customer.findByIdAndUpdate(req.params.Username, {
         Username: req.body.Username,
        Password: req.body.Password,
        FirstNames: req.body.FirstNames,
        Surname: req.body.Surname,
        MobilePhone: req.body.MobilePhone,
        HomePhone: req.body.HomePhone,
        Email: req.body.Email,
        DOB: req.body.DOB,
        "AddressHome.AddressLine1": req.body.AddressLine1,
        "AddressHome.AddressLine2": req.body.AddressLine2,
        "AddressHome.Town": req.body.Town,
        "AddressHome.countyORcity": req.body.countyORcity,
        "AddressHome.EIRCODE": req.body.EIRCODE,
        "AddressBilling.AddressLine1":req.body.AddressLine1,
        "AddressBilling.AddressLine2":req.body.AddressLine2,
        "AddressBilling.Town":req.body.Town,
        "AddressBilling.countyORcity":req.body.countyORcity,
        "AddressBilling.EIRCODE":req.body.EIRCODE,
        "cachedPaymentInfo.CardNumber":req.body.CardNumber,
        "cachedPaymentInfo.CardHolder":req.body.CardHolder,
        "cachedPaymentInfo.PaymentType":req.body.PaymentType,
        "cachedPaymentInfo.SecurityCode":req.body.SecurityCode,
        "cachedPaymentInfo.ExpiryDate":req.body.ExpiryDate
    }, 
       { new: true })  
    .then(customer => {
        if(!customer) {
            return res.status(404).send({
                message: "Customeromer not found with Username " + req.params.Username
            });
        }
        res.send(customer);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Customer not found with Username" + req.params.Username
            });               
        }
        return res.status(500).send({
            message: "Error updating Customer with Username " + req.params.Username
        });
    });
};

//Delete customer by Username
exports.deleteCustomer = (req, res) => {
    Customer.findByIdAndRemove(req.params.Username)
    .then(customer => {
        if(!customer) 
        {
            return res.status(404).send({
                message: "Customer not found with Username " + req.params.Username
            });
        }
        res.send({message: "Customer deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Customer not found with Username " + req.params.Username
            });                
        }
        return res.status(500).send({
            message: "Could not delete Customer with Username " + req.params.Username
        });
    });
};

//This function creates a new product
exports.createProduct = (req, res) => {
    const product = new Product({     
        ProductName: req.body.ProductName,
        ProductCategory: req.body.ProductCategory,
        ProductPrice:req.body.ProductPrice,
        ProductSize:req.body.ProductSize,
        ProductDescription:req.body.ProductDescription,
        Stock:req.body.Stock
    });

    product.ProductImage.data = fs.readFileSync(imgPath);
    product.ProductImage.contentType = 'jpg';

    //save it to the database
    product.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "An error occurred while creating the Product."
        });
    });
};

//This function finds all Products in the database 
exports.findAllProducts = (req, res) => {
    Product.find()
    .then(Products => {
        res.render('therapist_view',{
            results: Products
          });
    }).catch(err => {
        res.status(500).send({
            message: err.message || "An error occurred while retrieving all Products."
        });
    });
};

//This function updates a specific product based on the product name
exports.updateProduct = (req, res) => {
    if(!req.body) {
        return res.status(400).send({
            message: "Product content cannot be empty"
        });
    }

    //Take information from the request body
    Product.findByIdAndUpdate(req.params.ProductName, {
        ProductName: req.body.ProductName,
        ProductCategory: req.body.ProductCategory,
        ProductPrice:req.body.ProductPrice,
        ProductSize:req.body.ProductSize,
        ProductDescription:req.body.ProductDescription,
        ProductImage:req.body.ProductImage,
        Stock:req.body.Stock
    }, 
       { new: true })  
    .then(product => {
        if(!product) {
            return res.status(404).send({
                message: "Therapist not found with ProductName " + req.params._ProductName
            });
        }
        res.send(product);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Product not found with ProductName " + req.params.ProductName
            });               
        }
        return res.status(500).send({
            message: "Error updating Therapist with ProductName" + req.params.ProductName
        });
    });
};


//This function Deletes a Specific Product per the delete request id
exports.deleteProduct = (req, res) => {
    Product.findByIdAndRemove(req.params.ProductName)
    .then(product => {
        if(!product) 
        {
            return res.status(404).send({
                message: "Product not found with ProductName" + req.params.ProductName
            });
        }
        res.send({message: "Product deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Product not found with ProductName" + req.params.ProductName
            });                
        }
        return res.status(500).send({
            message: "Could not delete Product with ProductName " + req.params.ProductName
        });
    });
};