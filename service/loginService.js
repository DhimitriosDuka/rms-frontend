const axios = require('axios');

module.exports = {

    login: (req, res) => {
        axios.post('http://localhost:8081/users/login', {
            username: req.body.username,
            password: req.body.password
        })
            .then((response) => {
                req.session.token = response.data;
                req.session.username = req.body.username;

                if(typeof req.session.source !== "undefined") {
                    res.redirect(`/menu-item/${req.session.itemId}`)
                }else {
                    res.redirect("/dashboard");
                }
            })
            .catch(error => {
                res.render("login", {badCredentials: error.response.data.message[0].detail})
            });
    },

    getServerPage: (req, res) => {
        res.render("login");
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