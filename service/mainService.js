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
                        }),
                    cartItems: req.session.cart || []
                })
            }).catch(error => {
            console.log(error);
        })

    },

    getCheckOutPage: (req, res) => {
        res.render("checkout", {menuItems: req.session.cart, cartItems: req.session.cart});
    },

    checkout: (req, res) => {

        const orderMenuItems = [];

        req.session.cart.forEach(item => {
            const obj = {
                menuItem: {
                    id: item.item.id,
                    name: item.item.name,
                    price: item.item.price,
                    michelinStars: item.item.michelinStars,
                    course: item.item.course,
                    description: item.item.description,
                    type: item.item.type,
                    category: item.item.category,
                    available: item.item.available,
                    currency:item.item.currency,
                    calories: item.item.calories
                },
                amount: item.amount
            }
            orderMenuItems.push(obj);
        })

        axios.post(`http://localhost:8081/orders` , {

            phoneNumber: req.body.phoneNumber,
            address: req.body.address,
            orderMenuItems: orderMenuItems

        }, {
            headers: {
                'Authorization': `Bearer ${req.session.token}`
            }
        })
            .then(response =>  {
              req.session.cart = []
              req.flash("succes", "Order placed successfully!");
              res.redirect("/main");
            }).catch(error => {
            console.log(error);
        })

    },

    getMyOrders: (req, res) => {

        if(req.session.token === undefined) {
            res.redirect("/");
        } else {
            axios.get(`http://localhost:8081/orders/report/all` ,{
                headers: {
                    'Authorization': `Bearer ${req.session.token}`
                }
            }).then(response =>  {
                console.log(response)
                res.render("myOrders", {
                    orders: response.data,
                    cartItems: req.session.cart || []
                })
            }).catch(error => {
                console.log(error);
            })
        }

    }



}