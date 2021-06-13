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

        axios.post('http://localhost:8081/menuItems', {
                name: req.body.name,
                price: req.body.price,
                michelinStart: req.body.michelinStart,
                description: req.body.description,
                course: req.body.course,
                type: req.body.type,
                currency: req.body.currency,
                category: req.body.category
            }, {
            headers: {
                'Authorization': `Bearer ${req.session.token.token}`
            }
        }).then(response =>  {
            const createdMenuItemId = response.data.id;
            const amounts = req.body.amounts.split(", ");
            let index = 0;

            req.body.ingredients.forEach(itemId => {
                axios.get(`http://localhost:8081/ingredients/${itemId}`, {
                    headers: {
                        'Authorization': `Bearer ${req.session.token.token}`
                    }
                })
                    .then(ingredientResponse =>  {
                        axios.post(`http://localhost:8081/menuItems/${createdMenuItemId}`, {

                            amount: amounts[index],
                            ingredient: ingredientResponse.data

                        }, {
                            headers: {
                                'Authorization': `Bearer ${req.session.token.token}`
                            }
                        }).then(response =>  {
                            index++;
                        }).catch(error => {
                            console.log(error);
                        })
                    }).catch(error => {
                    console.log(error);
                })
            })
            req.flash("success", `Menu item with name ${req.body.name} successfully created!`);
            res.redirect("/menu-item");
        }).catch(error => {
            console.log(error);
            res.send(error);
            // req.flash('error', `Menu item with name ${req.body.name} already exists!`);
            // res.redirect("/menu-item");
        })
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