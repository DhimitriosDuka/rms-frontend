const axios = require('axios');

module.exports = {
    loadDashboard: (req, res) => {
        const ordersPath = axios.post('http://localhost:8081/orders/all', {status: "ONGOING"}, {
            headers: {
                'Authorization': `Bearer ${req.session.token}`
            }
        });
        const lineChartDataPath = axios.get('http://localhost:8081/orders/report', {
            headers: {
                'Authorization': `Bearer ${req.session.token}`
            }
        });
        const pieChartDataPath = axios.get('http://localhost:8081/orders/report/food-group', {
            headers: {
                'Authorization': `Bearer ${req.session.token}`
            }
        });

        axios.all([ordersPath, lineChartDataPath, pieChartDataPath])
            .then(axios.spread((...responses) => {
                res.render("dashboard", {
                    orders: responses[0].data.map(order => {
                        return {
                            id: order.id,
                            address: order.address,
                            phoneNumber: order.phoneNumber,
                            price: order.price,
                            menuItems: order.orderMenuItems.map(omi => {
                                return {
                                    id: omi.menuItem.id,
                                    name: omi.menuItem.name,
                                    amount: omi.amount
                                }
                            })
                        }
                    }),
                    orderReport: responses[1].data,
                    foodGroupReport: responses[2].data,
                });
            }))
            .catch(error => {
                console.log(error)
                return error;
            })
    }
}