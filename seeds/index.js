require('dotenv').config();
const mongoose = require("mongoose");
mongoose.connect(process.env.DB);
const Book = require("../models/Book");

let books = [
	{
		title: "Clean Code",
		comments: ["My code got so much better", "Great read"],
	},
	{
		title: "Learn Node JS",
		comments: ["Wonderful book", "I can write server apps now"],
	},
	{
		title: "Learn Svelte",
		comments: ["This really supercharged my dev speed"],
	}
]

!async function main() {
	await Book.deleteMany();
	await Book.insertMany(books);
	mongoose.disconnect();
}()