/*
*
*
*       Complete the API routing below
*       
*       
*/

const Book = require("../models/Book");
const AppError = require("../utility/Error");
const wrap = require("../utility/wrap");

'use strict';

module.exports = function (app) {

	app.route('/api/books')
		.get(wrap(async function (req, res) {
			const books = await Book.find();
			res.json(books);
		}))

		.post(wrap(async function (req, res) {
			let title = req.body.title;
			if (!title) throw new AppError("missing required field title");
			const book = await Book.create({ title });
			res.json({ _id: book._id, title: book.title });
		}))

		.delete(wrap(async function (req, res) {
			const book = await Book.deleteMany();
			res.send("complete delete successful")
		}));



	app.route('/api/books/:id')
		.get(wrap(async function (req, res) {
			let bookid = req.params.id;
			try {
				const book = await Book.findById(bookid);
				if (!book) throw Error();
				res.json(book);
			} catch (error) {
				throw new AppError("no book exists")
			}
		}))

		.post(wrap(async function (req, res) {
			let bookid = req.params.id;
			let comment = req.body.comment;
			if (!comment) throw new AppError("missing required field comment")
			if (!bookid) throw new AppError("missing required field id") // id/title ?
			try {
				const book = await Book.findById(bookid);
				book.comments.push(comment);
				book.save();
				res.json(book);
			} catch (error) {
				throw new AppError("no book exists")
			}
		}))

		.delete(wrap(async function (req, res) {
			let bookid = req.params.id;
			try {
				const book = await Book.findByIdAndRemove(bookid);
				if (!book) throw new Error();
				res.send("delete successful")
			} catch (e) {
				throw new AppError("no book exists")
			}
		}));

};
