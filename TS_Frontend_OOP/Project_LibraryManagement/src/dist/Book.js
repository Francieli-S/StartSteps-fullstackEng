import { BookGenre } from "./Types";
export class Book {
    // improve properly default parameters
    constructor(bookDetails = { title: '', author: '', publishedYear: 2000, genre: BookGenre.SCIENCE }) {
        this._title = bookDetails.title;
        this._author = bookDetails.author;
        this._publishedYear = bookDetails.publishedYear;
        this._genre = bookDetails.genre;
    }
    // code some validation to the setters
    get title() {
        return this._title;
    }
    set title(title) {
        this._title = title;
    }
    get author() {
        return this._author;
    }
    set author(author) {
        this._author = author;
    }
    get publishedYear() {
        return this._publishedYear;
    }
    set publishedYear(publishedYear) {
        this._publishedYear = publishedYear;
    }
    get genre() {
        return this._genre;
    }
    set genre(genre) {
        this._genre = genre;
    }
    // it returns Book { but with those _}!!
    getBookDetails() {
        return {
            title: this.title,
            author: this.author,
            publishedYear: this.publishedYear,
            genre: this.genre
        };
    }
}
const bookOne = {
    title: 'Cat Kingdom',
    author: 'Franci',
    publishedYear: 2024,
    genre: BookGenre.SCIENCE
};
const bookOne1 = new Book(bookOne);
console.log(bookOne1);
