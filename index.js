// app.post("/books", async (request, response) => {
//   const bookDetails = request.body;
//   const {
//     title,
//     authorId,
//     rating,
//     ratingCount,
//     reviewCount,
//     description,
//     pages,
//     dateOfPublication,
//     editionLanguage,
//     price,
//     onlineStores,
//   } = bookDetails;
//   const addBookQuery = `
//         INSERT INTO book
//             (title, author_id, rating, rating_count, review_count, description, pages, date_of_publication, edition_languages, price, online_stores)
//         VALUES (
//             '${title}',
//             ${authorId},
//             ${rating},
//             ${ratingCount},
//             ${reviewCount},
//             '${description}',
//             ${pages},
//             '${dateOfPublication}',
//             '${editionLanguage}',
//             ${price},
//             '${onlineStores}'
//         )`;
//   const dbResponse = await db.run(addBookQuery);
//   const bookId = dbResponse.lastID;
//   response.send({ bookId: bookId });
// });

// app.put("/books/:bookId", async (request, response) => {
//   const { bookId } = request.params;
//   const bookDetails = request.body;
//   const {
//     title,
//     authorId,
//     rating,
//     ratingCount,
//     reviewCount,
//     description,
//     pages,
//     dateOfPublication,
//     editionLanguage,
//     price,
//     onlineStores,
//   } = bookDetails;
//   const updateBookQuery = `
//     UPDATE book
//         SET
//         title='${title}',
//       author_id=${authorId},
//       rating=${rating},
//       rating_count=${ratingCount},
//       review_count=${reviewCount},
//       description='${description}',
//       pages=${pages},
//       date_of_publication='${dateOfPublication}',
//       edition_language='${editionLanguage}',
//       price=${price},
//       online_stores='${onlineStores}'
//     WHERE book_id = ${bookId}
//   `;
//   await db.run(updateBookQuery);
//   response.send("Book updated successfully");
// });

// app.get("/authors/:authorId/books/", async (request, response) => {
//   const { authorId } = request.params;
//   const getAuthorBooksQuery = `
//     SELECT
//      *
//     FROM
//      book
//     WHERE
//       author_id = ${authorId};`;
//   const booksArray = await db.all(getAuthorBooksQuery);
//   response.send(booksArray);
// });

const express = require("express");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const app = express();

app.use(express.json());

const dbPath = path.join(__dirname, "goodreads.db");

let db = null;

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server is running at https://localhost:3000/");
    });
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

initializeDbAndServer();

// GET all books API

app.get("/books", async (request, response) => {
  const getBooksQuery = `
        SELECT * FROM book
            ORDER BY book_id;
    `;
  const dbResponse = await db.all(getBooksQuery);
  response.send(dbResponse);
});

// GET single book API

app.get("/books/:bookId", async (request, response) => {
  const { bookId } = request.params;
  const getBookQuery = `
        SELECT * FROM book
            WHERE book_id = ${bookId}
    `;
  const dbResponse = await db.get(getBookQuery);
  response.send(dbResponse);
});

// POST a new book API

app.post("/books", async (request, response) => {
  const bookDetails = request.body;
  const {
    title,
    authorId,
    ratingCount,
    reviewCount,
    description,
    pages,
    dateOfPublication,
    editionLanguage,
    price,
    onlineStores,
  } = bookDetails;
  const postBookQuery = `
        INSERT INTO book (title, author_id, rating_count, description, pages, date_of_publication, edition_language, price, online_stores)
            VALUES('${title}', ${authorId}, ${ratingCount}, '${description}', ${pages}, '${dateOfPublication}', '${editionLanguage}', ${price}, '${onlineStores}');
    `;
  const dbResponse = await db.run(postBookQuery);
  const postBookId = dbResponse.lastID;
  response.send(postBookId);
});

// UPDATE book API

app.put("/books/:bookId", async (request, response) => {
  const bookId = request.params;
  const bookDetails = request.body;
  const {
    title,
    authorId,
    ratingCount,
    reviewCount,
    description,
    pages,
    dateOfPublication,
    editionLanguage,
    price,
    onlineStores,
  } = bookDetails;
  const updateBookQuery = `
    UPDATE book
        SET 
            title="${title}",
            author_id = ${authorId},
            rating_count=${ratingCount},
            review_count = ${reviewCount},
            description="${description}",
            pages=${pages},
            date_of_publication="${dateOfPublication}",
            edition_language="${editionLanguage}",
            price=${price},
            online_stores = "${onlineStores}"
        WHERE book_id = ${bookId}
  `;
  const dbResponse = await db.run(updateBookQuery);
  response.send("Book updated successfully");
});

/// DELETE a book

app.delete("/books/:bookId", async (request, response) => {
  const bookId = request.params;
  const deleteBookQuery = `
        DELETE FROM book WHERE book_id = ${bookId}
    `;
  await db.run(deleteBookQuery);
  response.send("Book is deleted");
});
