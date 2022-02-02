const express = require('express');
const router = express.Router();
const Database = require('../../database');

var postgres = new Database();
             

router.post('/register', (req, res, next) => {
    return new Promise((resolve, reject) => {
        let user = "'"+req.body.email_address+"'";
        let name = "'"+req.body.full_names+"'";
        let user_pass = "'"+req.body.password+"'";

        const checkEmail = `moviespot_schema.fn_email_address_exists(${user})`;
        postgres.callFnWithResultsAdd(checkEmail)
        .then((data) => {
            
            let emailExists = data.data[0].fn_email_address_exists;
            
            if(emailExists){
                res.status(401).json({
                    message: 'email exists',
                    emailExists: data
                });
            }else{
                const oldEmail = `moviespot_schema.fn_register_with_old_email(${user},${user_pass})`;
                postgres.callFnWithResultsAdd(oldEmail)
                .then((data) => {
                    let oldUser = data.data[0].fn_register_with_old_email;
                    if(oldUser){
                        res.status(201).json({
                            message: 'Welcome back',
                            emailExists: data
                        });
                    }else{
                        const functionName = `moviespot_schema.fn_user_registration(${user}, ${name}, ${user_pass})`;

                        postgres.callFnWithResultsAdd(functionName)
                        .then((data) => {
                        console.log(data);

                        res.status(201).json({
                                message: 'Newly Added user',
                                addedUser: data
                            });
                            resolve(data);

                        })
                        .catch((error) => {
                            console.log(error);
                            res.status(500).json({
                                message: error,
                                error: error,
                                status: false
                            });
                            reject(error);
                        })
                    }
                })

            }


            resolve(data)
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({
                message: error,
                error: error,
                status: false
            });
            reject(error);
        })
    })
});

//login
router.post('/login', (req, res, next) => {
    return new Promise((resolve, reject) => {
        let user = "'"+req.body.email_address+"'";
        let user_pass = "'"+req.body.password+"'";

        const loginFn = `moviespot_schema.fn_user_logintest(${user},${user_pass})`;

        postgres.callFnWithResultsAdd(loginFn)
        .then((data) => {
            console.log(data);
            let loggedIn = data.data[0].fn_user_logintest;

            if(loggeIn){
                res.status(201).json({
                    message: 'User logged in',
                    addedUser: data
                });
            }else{
                res.status(401).json({
                    message: 'Incorrect login details',
                    addedUser: data
                });
            }
            
            resolve(data);

        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({
                message: error,
                error: error,
                status: false
            });
            reject(error);
        })
    })
});     


//Delete user
router.patch('/deleteAccount/:email', (req, res, next) => {
    debugger;
    return new Promise((resolve, reject) => {
        let placeholder = '';
        let count = 1;
        const params = Object.keys(req.params).map(key => [(key), req.params[key]]);

        const paramsvalues = Object.keys(req.params).map(key => req.params[key]);

        if (Array.isArray(params)) {
            params.forEach(() => {
                placeholder += `$${count},`;
                count += 1;
            });
        } 

        placeholder = placeholder.replace(/,\s*$/, ''); 

        const functionName = `moviespot_schema.fn_delete_account`;

        const sql = `${functionName}(${placeholder})`;

        postgres.callFnWithResultsAdd(sql, paramsvalues)
        .then((data) => {
            debugger;
            console.log(data);
   
            res.status(201).json({
                message: 'Delete API ran successfully',
                cancelled: data
            });
            resolve(data);

        })
        .catch((error) => {
            debugger;
            console.log(error);
            res.status(500).json({
                message: 'bad Request',
                error: error,
                status: false
            });
            reject(error);
        })
    })
});


module.exports = router;