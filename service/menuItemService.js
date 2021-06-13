const axios = require("axios");

module.exports = {

    getMenuItemsPage: (req, res) => {

        const menuItems = axios.post('http://localhost:8081/menuItems/all', {}, {
            headers: {
                'Authorization': `Bearer ${req.session.token.token}`
            }
        });
        const ingredients = axios.post('http://localhost:8081/ingredients/all', {}, {
            headers: {
                'Authorization': `Bearer ${req.session.token.token}`
            }
        });

        axios.all([menuItems, ingredients])
            .then(axios.spread((...responses) => {
                res.render("menuItem",
                    {
                        menuItems: responses[0].data,
                        ingredients: responses[1].data
                    }
                );
            }))
            .catch(error => {
                console.log(error)
                return error;
            })

    },

    saveMenuItem: (req, res) => {

        axios.post()
        res.send(req.body);

    },

    findMenuItemWithId: (req, res) => {

        axios.get(`http://localhost:8081/menuItems/${req.params.id}`)
            .then(response =>  {
                res.render("singleMenuItem", {menuItem: response.data, cartItems: req.session.cart || []})
            }).catch(error => {
                console.log(error);
            })

    },

    addToCart: (req, res) => {

        if(typeof req.session.token === "undefined") {
            req.session.source = "cart";
            req.session.itemId = req.params.id;
            res.redirect(`/`)
        } else {
            req.session.cart = req.session.cart || [];
            axios.get(`http://localhost:8081/menuItems/${req.params.id}`)
                .then(response =>  {

                    let duplicate = false;

                    req.session.cart.forEach(element => {
                        if(element.item.id === response.data.id) {
                            element.amount = Number(element.amount) + Number(req.body.amount);
                            duplicate = true;
                        }
                    })

                    if(!duplicate) {
                        req.session.cart.push( {
                            item: response.data,
                            amount: req.body.amount
                        });
                    }
                    res.redirect("/main");
                }).catch(error => {
                console.log(error);
                })
        }

    }

}