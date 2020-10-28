import {
	GraphQLObjectType,
	GraphQLString,
	GraphQLSchema,
	GraphQLID,
	GraphQLInt,
	GraphQLList,
	GraphQLNonNull,
} from 'graphql';
import _ from 'lodash';
import { authorModel, bookModel } from '../models';

interface Book {
	id: String;
	authorId: String;
	name: String;
	genre: String;
}
interface Author {
	id: String;
	name: String;
	age: number;
}

const books: Array<Book> = [
	{ name: 'Name of the Wind', genre: 'Fantasy', id: '1', authorId: '1' },
	{ name: 'The Final Empire', genre: 'Fantasy', id: '2', authorId: '2' },
	{ name: 'The Hero of Ages', genre: 'Fantasy', id: '4', authorId: '2' },
	{ name: 'The Long Earth', genre: 'Sci-Fi', id: '3', authorId: '3' },
	{ name: 'The Colour of Magic', genre: 'Fantasy', id: '5', authorId: '3' },
	{ name: 'The Light Fantastic', genre: 'Fantasy', id: '6', authorId: '3' },
];

var authors: Array<Author> = [
	{ name: 'Patrick Rothfuss', age: 44, id: '1' },
	{ name: 'Brandon Sanderson', age: 42, id: '2' },
	{ name: 'Terry Pratchett', age: 66, id: '3' },
];

const BookType: GraphQLObjectType = new GraphQLObjectType({
	name: 'Book',
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		genre: { type: GraphQLString },
		author: {
			type: AuthorType,
			resolve(parent, args) {
				return authorModel.findById(parent.authorId);
			},
		},
	}),
});

const AuthorType: GraphQLObjectType = new GraphQLObjectType({
	name: 'Author',
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		age: { type: GraphQLInt },
		books: {
			type: new GraphQLList(BookType),
			resolve(parent, args) {
				return bookModel.find({ authorId: parent.id });
			},
		},
	}),
});

const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: {
		book: {
			type: BookType,
			args: {
				id: {
					type: GraphQLID,
				},
			},
			resolve(parent, args) {
				// get data from db
				return bookModel.findById(args.id);
			},
		},
		author: {
			type: AuthorType,
			args: {
				id: {
					type: GraphQLID,
				},
			},
			resolve(parent, args) {
				// get data from db
				return authorModel.findById(args.id);
			},
		},
		books: {
			type: new GraphQLList(BookType),
			resolve(parent, args) {
				return bookModel.find({});
			},
		},
		authors: {
			type: new GraphQLList(AuthorType),
			resolve(parent, args) {
				return authorModel.find({});
			},
		},
	},
});

const Mutation = new GraphQLObjectType({
	name: 'Mutation',
	fields: {
		addAuthor: {
			type: AuthorType,
			args: {
				name: { type: new GraphQLNonNull(GraphQLString) },
				age: { type: new GraphQLNonNull(GraphQLInt) },
			},
			resolve(parent, args) {
				let author = new authorModel({
					name: args.name,
					age: args.age,
				});
				return author.save();
			},
		},
		addBook: {
			type: BookType,
			args: {
				name: { type: new GraphQLNonNull(GraphQLString) },
				genre: { type: new GraphQLNonNull(GraphQLString) },
				authorId: { type: new GraphQLNonNull(GraphQLID) },
			},
			resolve(parent, args) {
				let book = new bookModel({
					name: args.name,
					genre: args.age,
					authorId: args.authorId,
				});
				return book.save();
			},
		},
	},
});

const Schema = new GraphQLSchema({
	query: RootQuery,
	mutation: Mutation,
});

export default Schema;
