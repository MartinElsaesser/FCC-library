const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let virtualOpts = {
	toJSON: { virtuals: true }, toObject: { virtuals: true }
}

const bookSchema = new Schema({
	title: {
		type: String,
		required: true,
	},
	comments: [{ type: String }],
	__v: { type: Number, select: false },
	id: false
}, virtualOpts);

bookSchema.virtual("commentcount").get(function () {
	return this.comments.length;
})

module.exports = mongoose.model("Book", bookSchema);