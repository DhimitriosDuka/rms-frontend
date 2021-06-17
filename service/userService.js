const axios = require("axios");

module.exports = {

    getUsersPage: (req, res) => {

        axios.get(`http://localhost:8081/users`, {
            headers: {
                'Authorization': `Bearer ${req.session.token}`
            }
        })
            .then(response => {
                res.render("users", {users: response.data})
            }).catch(error => {
            console.log(error);
        })

    },

    addSchedule: (req, res) => {

        axios.post(`http://localhost:8081/users/${req.params.id}/schedule`, {

            workDate: req.body.workDate,
            startWorkHour: new Date(req.body.startWorkHour),
            endWorkHour: new Date(req.body.endWorkHour)

        }, {
            headers: {
                'Authorization': `Bearer ${req.session.token}`
            }
        }).then(response => {
            req.flash("success", `Successfully added schedule to user!`);
            res.redirect("/user");
        }).catch(error => {
            console.log(error.response.data.message[0].detail);
            if(error.response.data.message[0].detail.includes("could not execute statement; SQL")) {
                req.flash('error', "Delivery already has a schedule at that date!");
            }else {
                req.flash('error',error.response.data.message[0].detail);
            }
            res.redirect("/user");
        })

    },
}