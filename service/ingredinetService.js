const axios = require('axios');

module.exports = {

    loadPage: (req, res) => {

        axios.post('http://localhost:8081/ingredients/all', {}, {
            headers: {
                'Authorization': `Bearer ${req.session.token}`
            }
        }).then(response =>  {
            res.render("ingredients", {
                ingredients: response.data,
            })
        }).catch(error => {
            console.log(error)
            return error;
        })
    },

    saveIngredient: (req, res) => {

        axios.post('http://localhost:8081/ingredients/save', req.body, {
            headers: {
                'Authorization': `Bearer ${req.session.token}`
            }
        }).then(response =>  {
            req.flash("success", `Ingredient with name ${req.body.name} successfully created!`);
            res.redirect("/ingredient");
        }).catch(error => {
            req.flash('error', `Ingredient ${req.body.name} already exists!`);
            res.redirect("/ingredient");
        })
    },

    getUpdateIngredientPage: (req, res) => {

        axios.get(`http://localhost:8081/ingredients/${req.params.id}` ,{
            headers: {
                'Authorization': `Bearer ${req.session.token}`
            }
        }).then(response =>  {
            res.render("ingredientsEdit", {ingredient: response.data})
        }).catch(error => {
           console.log(error);
        })

    },

    updateIngredient: (req, res) => {
        axios.put(`http://localhost:8081/ingredients/${req.params.id}`, req.body, {
            headers: {
                'Authorization': `Bearer ${req.session.token}`
            }
        }).then(response =>  {
            req.flash("success", `Ingredient with name ${req.body.name} successfully updated!`);
            res.redirect("/ingredient");
        }).catch(error => {
            req.flash('error', `Ingredient ${req.body.name} already exists!`);
            res.redirect(`/ingredient/edit/${req.params.id}`);
        })
    }



}