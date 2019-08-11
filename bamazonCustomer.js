var mysql = require("mysql");
var inquirer = require("inquirer");
var table

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
        table = result;
        start();
    })
});

function start() {
    var newQuantity;
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
                console.log(results[0].stock_quantity)
                if (err) throw (err);
                var quantity = results[0].stock_quantity;
                var amount = parseInt([choice.howMany]);
                console.log("Current Stock Available is", quantity);
                console.log("Minus Your Purchase of", amount)
                newQuantity = quantity - amount;
                console.log("Updated Stock After Purchase is", newQuantity)
                var query = connection.query("UPDATE products SET ? WHERE ?", [{ stock_quantity: newQuantity }, { item_id: choice.chooseId }], function(err, result) {
                    if (err) throw err;
                    console.log(result.affectedRows + " record(s) updated");
                });
                console.log(query.sql);
                connection.query("SELECT * FROM products", function(err, result) {
                    if (err) throw err;
                    console.table(result);
                    start();
                })
            });
        });
}