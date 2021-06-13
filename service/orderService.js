const axios = require("axios");

module.exports = {

    allOrders: (req, res) => {
        axios.post(`http://localhost:8081/orders/all`, {}, {
            headers: {
                'Authorization': `Bearer ${req.session.token.token}`
            }
        }).then(response =>  {
            console.log(response.data);
            res.render("orders", {orders: response.data})
        }).catch(error => {
            res.send(error);
        })
    },

    getSingleOrder: (req, res) => {

        axios.get(`http://localhost:8081/orders/${req.params.id}` ,{
            headers: {
                'Authorization': `Bearer ${req.session.token.token}`
            }
        }).then(response =>  {
            res.render("singleOrder", {order: response.data});
        }).catch(error => {
            console.log(error);
        })


    },

    shipOrder: (req, res) => {

        axios.put(`http://localhost:8081/orders/${req.params.id}/status`, {status: "DELIVERING"}, {
            headers: {
                'Authorization': `Bearer ${req.session.token.token}`
            }
        }).then(response =>  {
            req.flash("toast", `Order with number #${req.params.id} has been successfully been shipped!`);
            res.redirect("/dashboard");
        }).catch(error => {
            console.log(error);
            req.flash('error', `Order could not be shipped! Please try again!`);
            res.redirect(`/order/${req.params.id}`);
        })

    },

    updateAmount: (req, res) => {
        const elements = [];
        req.session.cart.forEach(element => {
            let toBeRemoved = false;
            if(element.item.id == req.params.id) {
                element.amount = Number(element.amount) + Number(req.query.value);
                if(element.amount == 0) {
                    toBeRemoved = true;
                }
            }
            if(!toBeRemoved){
                elements.push(element);
            }
        })
        req.session.cart = elements;
        res.redirect("/main/checkout");
    },

    getFullOrder:(req, res) => {
        axios.get(`http://localhost:8081/orders/${req.params.id}` ,{
            headers: {
                'Authorization': `Bearer ${req.session.token.token}`
            }
        }).then(response =>  {
            res.render("fullSingleOrder", {order: response.data});
        }).catch(error => {
            console.log(error);
        })

    }

}