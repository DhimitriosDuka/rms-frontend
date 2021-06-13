const axios = require("axios");

module.exports = {

    getMainPage: (req, res) => {

        axios.post(`http://localhost:8081/menuItems/all` , {})
            .then(response =>  {
                res.render("mainPage", {menuItems:
                        response.data.map(item => {
                            return {
                                id: item.id,
                                name: item.name,
                                price: item.price,
                                ingredients: item.menuItemIngredient.map(ingredient => ingredient.ingredient.name).join(", ")
                            }
                        }),
                        cartItems: req.session.cart || []
                    })
            }).catch(error => {
                console.log(error);
            })
    },

    filterMenuItems: (req, res) => {

        console.log(req.body);

        const filter = {};
        if(req.body.name.length !== 0) {
            filter.name = req.body.name;
        }

        if(req.body.category !== 'ALL') {
            filter.category = req.body.category;
        }

        if(req.body.type !== 'ALL') {
            filter.type = req.body.type;
        }

        axios.post(`http://localhost:8081/menuItems/all` , filter)
            .then(response =>  {
                res.render("mainPage", {menuItems:
                        response.data.map(item => {
                            return {
                                id: item.id,
                                name: item.name,
                                price: item.price,
                                ingredients: item.menuItemIngredient.map(ingredient => ingredient.ingredient.name).join(", ")
                            }
                        })
                })
            }).catch(error => {
            console.log(error);
        })

    },

    getCheckOutPage: (req, res) => {
        res.render("checkout", {menuItems: req.session.cart, cartItems: req.session.cart});
    }



}