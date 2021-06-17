const axios = require("axios");

module.exports = {

    getMenuItemsPage: (req, res) => {

        const menuItems = axios.post('http://localhost:8081/menuItems/all', {}, {
            headers: {
                'Authorization': `Bearer ${req.session.token}`
            }
        });
        const ingredients = axios.post('http://localhost:8081/ingredients/all', {}, {
            headers: {
                'Authorization': `Bearer ${req.session.token}`
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
                'Authorization': `Bearer ${req.session.token}`
            }
        }).then(response =>  {
            const createdMenuItemId = response.data.id;
            const amounts = req.body.amounts.split(", ");
            let index = 0;

            req.body.ingredients.forEach(itemId => {
                axios.get(`http://localhost:8081/ingredients/${itemId}`, {
                    headers: {
                        'Authorization': `Bearer ${req.session.token}`
                    }
                })
                    .then(ingredientResponse =>  {
                        axios.post(`http://localhost:8081/menuItems/${createdMenuItemId}`, {

                            amount: amounts[index],
                            ingredient: ingredientResponse.data

                        }, {
                            headers: {
                                'Authorization': `Bearer ${req.session.token}`
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
            req.flash("error", `Menu item with name ${req.body.name} already exists!`);
            res.redirect("/menu-item");
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

    },

    getUpdatePage: (req, res) => {

        axios.get(`http://localhost:8081/menuItems/${req.params.id}`)
            .then(response =>  {
                console.log(response.data);
                res.render("editMenuItem", {menuItem: response.data});
            }).catch(error => {
            console.log(error);
        })

    },

    updateMenuItem: (req, res) => {

        axios.put(`http://localhost:8081/menuItems/${req.params.id}`, req.body, {
            headers: {
                'Authorization': `Bearer ${req.session.token.token}`
            }
        })
            .then(response =>  {
                req.flash("successMenuItem", `Menu Item with name ${req.body.name} has been successfully updated!`)
                res.redirect("/menu-item");
            }).catch(error => {
            console.log(error);
        })

    },

    updateAmountOfIngredient: (req, res) => {

        axios.put(`http://localhost:8081/menuItems/${req.params.itemId}/ingredients/${req.params.ingredientId}`, {
            amount: req.body.amount
        }, {
            headers: {
                'Authorization': `Bearer ${req.session.token}`
            }
        })
            .then(response =>  {
                req.flash("successMenuItem", `Menu Item has been successfully updated!`);
                res.redirect(`/menu-item/${req.params.itemId}/edit`);
            }).catch(error => {
            console.log(error);
        })

    },

    deleteIngredientOfItem: (req, res) => {

        axios.delete(`http://localhost:8081/menuItems/${req.params.itemId}/ingredients/${req.params.ingredientId}`, {
            headers: {
                'Authorization': `Bearer ${req.session.token}`
            }
        })
            .then(response =>  {
                req.flash("successMenuItem", `Menu Item has been successfully updated!`);
                res.redirect(`/menu-item/${req.params.itemId}/edit`);
            }).catch(error => {
            console.log(error);
        })

    },

    updateAvailability: (req, res) => {
        axios.get(`http://localhost:8081/menuItems/${req.params.itemId}`, {
            headers: {
                'Authorization': `Bearer ${req.session.token}`
            }
        })
            .then(response =>  {
                response.data.available = false;
                console.log(response.data);
                axios.put(`http://localhost:8081/menuItems/${req.params.itemId}`, {
                    name: response.data.name,
                    price: response.data.price,
                    michelinStarts: response.data.michelinStarts,
                    course: response.data.course,
                    description: response.data.description,
                    type: response.data.type,
                    category: response.data.category,
                    currency: response.data.currency,
                    available: req.query.value
                }, {
                    headers: {
                        'Authorization': `Bearer ${req.session.token}`
                    }
                })
                    .then(response =>  {
                        console.log(response.data);
                        req.flash("successMenuItem", `Menu Item with name ${req.body.name} has been successfully deleted!`)
                        res.redirect("/menu-item");
                    }).catch(error => {
                    console.log(error);
                })
            }).catch(error => {
            console.log(error);
        })

    }


}