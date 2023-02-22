const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

mongoose.set('strictQuery', false);
mongoose.connect("mongodb+srv://admin-arshad:mongo0302@cluster0.khypjtz.mongodb.net/todolistDB",{useNewUrlParser : true});

const itemsSchema = {
    name : String
};

const Item = mongoose.model("Item", itemsSchema);
const item1 = new Item({
    name : "Welcome To Your To-Do List!"
});
const item2 = new Item({
    name : "Hit the + button to add a new item!"
});
const item3 = new Item({
    name : "<--- Hit this to delete an item!"
});

const items = [item1, item2, item3];

app.get("/", function (req, res) {
    let today = new Date();
    let options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };
    let day = today.toLocaleDateString("en-US", options);
    Item.find({},function(err,foundItems){
        if(foundItems.length == 0){
            Item.insertMany(items, function(err){
                if(err){
                    console.log(err);
                }
                else{
                    console.log("Successfully inserted default items to our DB!");
                }
            });
            res.redirect("/");
        }
        else{
            res.render("list", { dayOfWeek: day, newListItems: foundItems });
        }
    });
});

app.post("/", function(req,res){
    const itemName = req.body.newItem;
    const item = new Item({
        name : itemName
    });
    item.save();
    res.redirect("/");
});

app.post("/delete", function(req,res){
    const deleteID = req.body.checkbox;
    Item.findByIdAndRemove(deleteID, function(err){
        if(err){
            console.log(err);
        }
        else{
            console.log("Successfully deleted");
        }
    })
    res.redirect("/");
});

app.listen(3000, function () {
    console.log("Server started on port 3000");
})