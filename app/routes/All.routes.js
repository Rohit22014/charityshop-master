module.exports = (app) => {
    const Controller = require('../controllers/All.controllers.js');
    //Home view
    app.get('/', Controller.root);
    //app.post('/:s', Controller.createProduct);
    //Home and logged in
    app.get('/:k/login=true', Controller.loggedIn)
    //Make sure they haven't tampered with url
    app.get('/:k/login=true/:s/:m/:n/:j', Controller.check)
    //Get login page
    app.get('/Login', Controller.loginView);
    //verify login
    app.get('/Login/:s', Controller.loginVerification);
    //Get registration page
    app.get('/Registration', Controller.registrationView);
    //Save user to db / create account
    app.post('/Registration', Controller.registration);
    //Get reset page
    app.get('/Reset', Controller.reset);
    //Check email is registered
    app.get('/Reset/emails/:s', Controller.resetEmail);
    //Send code to email
    app.get('/Reset/send/:s/:m', Controller.sendEmails);
    //update password in db
    app.put('/Reset/:s/:m', Controller.updatePassword);
    //logged out version of search engine for products 
    app.get('/Products/ProductName/:s', Controller.searchProducts); 
    //Logged in version
    app.get('/:k/login=true/Products/ProductName/:s', Controller.searchProductsLoggedIn); 
    //Make sure no tampering with url
    app.get('/:k/login=true/Products/ProductName/:s/:p', Controller.check); 
    //Full view product logged out
    app.get('/Products/ProductName/:s/fullView/:_id', Controller.searchProductsByName); 
    //Full view logged in
    app.get('/:k/login=true/Products/ProductName/:s/fullView/:_id', Controller.searchProductsByNameLoggedIn); 
    //Check no tampering url full view
    app.get('/:k/login=true/Products/ProductName/:s/fullView/:_id/:s', Controller.check); 
    app.get('/:k/login=true/Basket', Controller.cart);
    app.get('/:k/login=true/Basket/:_id', Controller.addtocart);
    app.get('/:k/login=true/Basket/:_id/:m', Controller.check);
    app.get('/checkout/:s', Controller.Checkout);
    app.get('/confirmation/:m', Controller.Confirmation);


}
