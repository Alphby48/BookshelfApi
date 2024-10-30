const { nanoid } = require("nanoid");
let books = require("./books");
const { request } = require("https");

// penambahan data buku dengan method POST
const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;

  if (name !== undefined && readPage <= pageCount) {
    const addBook = {
      id,
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      insertedAt,
      updatedAt,
    };

    books.push(addBook);
  } else if (readPage > pageCount) {
    const response = h.response({
      status: "fail",
      message:
        "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
    });
    response.type("application/json");
    response.code(400);
    return response;
  } else {
    const response = h.response({
      status: "fail",
      message: "Gagal menambahkan buku. Mohon isi nama buku",
    });
    response.type("application/json");
    response.code(400);
    return response;
  }

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: "success",
      message: "Buku berhasil ditambahkan",
      data: {
        bookId: id,
      },
    });
    response.type("application/json");
    response.code(201);
    console.log(books);
    return response;
  } else {
    const response = h.response({
      status: "fail",
      message: "Buku gagal ditambahkan",
    });
    response.type("application/json");
    response.code(500);
    return response;
  }
};

// read data buku dengan method GET
const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  if (name !== undefined) {
    const filterBooks = books.filter((book) =>
      book.name.toLowerCase().includes(name.toLowerCase())
    );
    const response = h.response({
      status: "success",
      data: {
        books: filterBooks.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });
    response.type("application/json");
    return response;
  } else if (reading !== undefined) {
    const filterBooks = books.filter(
      (book) => book.reading === Boolean(reading)
    );
    const response = h.response({
      status: "success",
      data: {
        books: filterBooks.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });
    response.type("application/json");
    return response;
  } else if (finished !== undefined) {
    const filterBooks = books.filter(
      (book) => book.finished === (finished === "1")
    );
    console.log(filterBooks);
    const response = h.response({
      status: "success",
      data: {
        books: filterBooks.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });
    response.type("application/json");
    return response;
  } else {
    const response = h.response({
      status: "success",
      data: {
        books: books.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });
    response.type("application/json");
    return response;
  }
};

// read data buku berdasarkan id dengan method GET
const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const book = books.filter((b) => b.id === bookId)[0];

  if (book !== undefined) {
    const response = h.response({
      status: "success",
      data: {
        book,
      },
    });
    response.type("application/json");
    return response;
  } else {
    const response = h.response({
      status: "fail",
      message: "Buku tidak ditemukan",
    });
    response.type("application/json");
    response.code(404);
    return response;
  }
};

// update data buku berdasarkan id dengan method PUT
const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();
  const index = books.find((b) => b.id === bookId);
  const insertedAt = index !== undefined ? index.insertedAt : updatedAt;
  const finished = pageCount === readPage;

  const updateBooks = books.filter((b) => b.id !== bookId);

  if (books.filter((b) => b.id === bookId).length > 0) {
    if (name !== undefined && readPage <= pageCount) {
      const newBooks = {
        id: bookId,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        insertedAt,
        updatedAt,
      };
      updateBooks.push(newBooks);
      books = updateBooks;
      const response = h.response({
        status: "success",
        message: "Buku berhasil diperbarui",
      });
      response.type("application/json");
      console.log(books);
      return response;
    } else if (readPage > pageCount) {
      const response = h.response({
        status: "fail",
        message:
          "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
      });
      response.type("application/json");
      response.code(400);
      return response;
    } else {
      const response = h.response({
        status: "fail",
        message: "Gagal memperbarui buku. Mohon isi nama buku",
      });
      response.type("application/json");
      response.code(400);
      return response;
    }
  } else {
    const response = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. Id tidak ditemukan",
    });
    response.type("application/json");
    response.code(404);
    return response;
  }
};

// delete data buku berdasarkan id dengan method DELETE
const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const newBooks = books.filter((b) => b.id !== bookId);

  if (books.filter((b) => b.id === bookId).length > 0) {
    books = newBooks;
    const response = h.response({
      status: "success",
      message: "Buku berhasil dihapus",
    });
    response.type("application/json");
    return response;
  } else {
    const response = h.response({
      status: "fail",
      message: "Buku gagal dihapus. Id tidak ditemukan",
    });
    response.type("application/json");
    response.code(404);
    return response;
  }
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
