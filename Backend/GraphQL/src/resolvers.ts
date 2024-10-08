import fetch from "node-fetch";
import { Book, BookInput } from "./types.js";
import books from "./data.js";
import { ApolloError } from "apollo-server-express";
import {GraphQLScalarType} from "graphql";

// const date = "1-10-2021";
// const dateObject = new Date(date);
// dateObject.getDay();

const dateScalar = new GraphQLScalarType({
    name: "Date",
    description: "Date custom scalar type",
    serialize(value: Date | unknown) {
        // To the client from the server
        if(!(value instanceof Date)) {
            throw new TypeError("Date cannot represent an invalid Date instance");
        }
        return value.toISOString();
    },
    parseValue(value: string | unknown) {
        // To the server from the client
        if(typeof value !== "string") {
            throw new TypeError("Date cannot represent an invalid Date instance");
        }
        return new Date(value);
    },
});

export const resolvers = {
    Date: dateScalar,
    Query: {
        book: (_, {id}: {id: string}): Book | undefined => {
            const book: Book = books.find((book) => book.id === id)
            const day = book.publishedDate && book.publishedDate.getDay(); // we can use this as we are saving data as "new Date" object in parseValue
            return book;
        }
            
            ,
        books: (): Book[] => {
            console.log(books)
            return books;
        },
        getTODOAPIData: async () => {
            try {
                const response = await fetch("https://dummyjson.com/todos");
                const data = await response.json();
                return data.todos;
            } catch (error) {
                console.error(error);
                return [];
            }
        },
    },
    Mutation: {
        addBook:(_, props: {input: BookInput} ): Book => {
            const {input} = props;
            const {title, author, genre, publishedDate} = input;
            console.log("date:", publishedDate)
            const newBook = {
                id: String(books.length + 1),
                title, //title: title
                author,
                genre,
                publishedDate,
            }
            books.push(newBook);
            return newBook;
        },
        deleteBook: (_, {id}: {id: string}): Book => {
            const index = books.findIndex((book) => book.id === id);
            if (index !== -1) {
                const [deletedBook] = books.splice(index, 1);
                return deletedBook;
            } else {
                throw new ApolloError("Book not found");
            }
        },
        updateBook: (_, {id, title, author}: {id: string, title: string, author: string}): Book => {
            const index = books.findIndex((book) => book.id === id);
            if (index === -1) {
                throw new ApolloError("Book not found");
            }
            books[index].title = title;
            books[index].author = author;
            return books[index];
        },
    }
};
