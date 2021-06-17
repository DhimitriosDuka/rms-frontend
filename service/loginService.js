const axios = require('axios');

module.exports = {

    login: (req, res) => {

        console.log("asdsa");
        if(req.session.token !== undefined) {
            res.redirect("/main");
        }else {
            axios.post('http://localhost:8081/users/login', {
                username: req.body.username,
                password: req.body.password
            })
                .then((response) => {
                    console.log(response.data);
                    req.session.token = response.data.token;
                    req.session.username = req.body.username;
                    req.session.role = response.data.role;

                    if(typeof req.session.token !== "undefined") {
                        if(req.session.role === 'ADMIN') {
                            res.redirect("/dashboard");
                        } else if(req.session.role === 'OPERATOR') {
                            res.redirect("/main")
                        }
                    }else {
                        res.redirect("/");
                    }
                })
                .catch(error => {
                    res.render("login", {badCredentials: error.response.data.message[0].detail})
                });
        }


    },

    getServerPage: (req, res) => {
        if(req.session.token !== undefined) {
            res.redirect("/main");
        } else {
            res.render("login");
        }
    },

    signupPage: (req, res) => {
        res.render("signUp");
    },

    signup: (req, res) => {

        req.body.role = "OPERATOR";
        axios.post('http://localhost:8081/users', req.body, {})
            .then(response =>  {
                req.flash("toast", `User with username ${req.body.userName} successfully created!`)
                res.redirect("/");
            }).catch(error => {
                res.render("signup", {error: error.response.data.message[0].detail});
            })
    },

    logOut: (req, res) => {
        req.session.destroy();
        res.redirect("/");
    }

}