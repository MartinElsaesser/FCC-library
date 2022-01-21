/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function () {

	let id;
	let book = {
		title: "Git handbook"
	}

	/*
	* ----[EXAMPLE TEST]----
	* Each test should completely test the response of the API end-point including response status code!
	*/
	test('#example Test GET /api/books', function (done) {
		chai.request(server)
			.get('/api/books')
			.end(function (err, res) {
				assert.equal(res.status, 200);
				assert.isArray(res.body, 'response should be an array');
				assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
				assert.property(res.body[0], 'title', 'Books in array should contain title');
				assert.property(res.body[0], '_id', 'Books in array should contain _id');
				done();
			});
	});
	/*
	* ----[END of EXAMPLE TEST]----
	*/

	suite('Routing tests', function () {


		suite('POST /api/books with title => create book object/expect book object', function () {

			test('Test POST /api/books with title', function (done) {
				chai.request(server)
					.post("/api/books")
					.type("form")
					.send(book)
					.end(function (err, res) {
						assert.equal(res.status, 200, "valid status");
						assert.isObject(res.body, "object returned");
						assert.equal(res.body.title, book.title, "book title");
						assert.isString(res.body._id, "includes id");
						id = res.body._id;
						done();
					})
			});

			test('Test POST /api/books with no title given', function (done) {
				chai.request(server)
					.post("/api/books")
					.type("form")
					.send({})
					.end(function (err, res) {
						assert.equal(res.status, 200, "valid status");
						assert.equal(res.text, "missing required field title");
						done();
					})
			});

		});


		suite('GET /api/books => array of books', function () {

			test('Test GET /api/books', function (done) {
				chai.request(server)
					.get("/api/books")
					.end(function (err, res) {
						assert.equal(res.status, 200, "valid status");
						assert.isArray(res.body, "books array");
						res.body.forEach(book => {
							assert.isString(book._id, "id string");
							assert.isString(book.title, "title string");
							assert.isArray(book.comments, "comments array");
							assert.isNumber(book.commentcount, "comment count number");
						});
						done();
					});
			});

		});


		suite('GET /api/books/[id] => book object with [id]', function () {

			test('Test GET /api/books/[id] with id not in db', function (done) {
				chai.request(server)
					.get("/api/books/aaaaaaaaaaaa")
					.end(function (err, res) {
						assert.equal(res.status, 200, "valid status");
						assert.equal(res.text, "no book exists", "book does not exist");
						done();
					});
			});

			test('Test GET /api/books/[id] with valid id in db', function (done) {
				chai.request(server)
					.get("/api/books/" + id)
					.end(function (err, res) {
						assert.equal(res.status, 200, "valid status");
						assert.isObject(res.body, "book object");
						assert.equal(res.body.title, book.title, "book title");
						assert.equal(res.body._id, id, "book id");
						assert.deepEqual(res.body.comments, [], "empty comments");
						assert.deepEqual(res.body.commentcount, 0, "empty comments");
						done();
					});
			});

		});


		suite('POST /api/books/[id] => add comment/expect book object with id', function () {

			test('Test POST /api/books/[id] with comment', function (done) {
				chai.request(server)
					.post("/api/books/" + id)
					.type("form")
					.send({ comment: "New Comment" })
					.end(function (err, res) {
						assert.equal(res.status, 200, "valid status");
						assert.isObject(res.body, "book object");
						assert.equal(res.body.title, book.title, "book title");
						assert.equal(res.body._id, id, "book id");
						assert.deepEqual(res.body.comments, ["New Comment"], "empty comments");
						assert.deepEqual(res.body.commentcount, 1, "empty comments");
						done();
					})
			});

			test('Test POST /api/books/[id] without comment field', function (done) {
				chai.request(server)
					.post("/api/books/" + id)
					.type("form")
					.send({})
					.end(function (err, res) {
						assert.equal(res.status, 200, "valid status");
						assert.equal(res.text, "missing required field comment", "comment field missing")
						done();
					})
			});

			test('Test POST /api/books/[id] with comment, id not in db', function (done) {
				chai.request(server)
					.post("/api/books/aaaaaaaaaaaa")
					.type("form")
					.send({ comment: "this will fail" })
					.end(function (err, res) {
						assert.equal(res.status, 200, "valid status");
						assert.equal(res.text, "no book exists", "book id not in db")
						done();
					})
			});

		});

		suite('DELETE /api/books/[id] => delete book object id', function () {

			test('Test DELETE /api/books/[id] with valid id in db', function (done) {
				chai.request(server)
					.delete("/api/books/" + id)
					.type("form")
					.end(function (err, res) {
						assert.equal(res.status, 200, "valid status");
						assert.equal(res.text, "delete successful", "book deleted")
						done();
					})
			});

			test('Test DELETE /api/books/[id] with  id not in db', function (done) {
				chai.request(server)
					.delete("/api/books/aaaaaaaaaaaa")
					.type("form")
					.end(function (err, res) {
						assert.equal(res.status, 200, "valid status");
						assert.equal(res.text, "no book exists", "book id not in db")
						done();
					})
			});

		});

	});

});
