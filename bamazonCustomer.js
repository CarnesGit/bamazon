var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Liam0515!",
    database: "bamazon_db"
});

connection.connect(function(err) {
    connection.query("SELECT * FROM products", function(err, result) {
        if (err) throw err;
        console.table(result);
        start();
    })
});

function start() {
    inquirer
        .prompt([{
            name: "chooseId",
            type: "input",
            message: "What is the ID of the product you would like to buy?",
        }, {
            name: "howMany",
            type: "input",
            message: "How many would you like to buy?",
        }])
        .then(function(choice) {
            connection.query("select stock_quantity FROM products WHERE item_id = ?", [choice.chooseId], function(err, results) {
                if (err) throw (err);
                Object.keys(results).forEach(function(key) {
                    var row = results[key];
                    var quantity = row.stock_quantity;
                    var amount = parseInt([choice.howMany]);
                    console.log("Current Stock Available is", quantity);
                    console.log("Minus Your Purchase of", amount)
                    var newQuantity = quantity - amount;
                    console.log("Updated Stock After Purchase is", newQuantity)
                });
            });
        });
}