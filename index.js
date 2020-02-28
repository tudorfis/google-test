const fs = require("fs");
let rawObj = fs
  .readFileSync("./input.txt", "utf8")
  .split("\r\n")
  .filter(str => str !== "");

const maxBooks = parseInt(rawObj[0].split(" ")[0]);
const deadline = parseInt(rawObj[0].split(" ")[2]);
const scores = rawObj[1].split(" ").map(n => parseInt(n));
const library = [];
let books = [];

rawObj = rawObj.slice(2);
for (const key in rawObj) {
  const libraryId = Math.floor(key / 2);
  library[libraryId] = library[libraryId] || {};

  const row = rawObj[key].trim().split(" ");

  if (key % 2 !== 0) {
    library[libraryId].books = row.map(n => ({
      id: (bookId = parseInt(n)),
      score: scores[bookId]
    }));

    books.push(...library[libraryId].books.map(b => ({ ...b, libraryId })));
    continue;
  }

  library[libraryId].signupDays = parseInt(row[1]);
  library[libraryId].maxNumBooksPerDay = parseInt(row[2]);
}

books = books.sort((a, b) => b.score - a.score);

const newBooksArr = [];
for (const book of books)
  if (!newBooksArr.find(b => b.id === book.id)) newBooksArr.push(book);
books = newBooksArr.slice(0, maxBooks);

const orderLibraries = library
  .map((lib, id) => ({ id, order: lib.signupDays - lib.maxNumBooksPerDay }))
  .sort((a, b) => a.order - b.order);

let output = orderLibraries.length.toString() + "\n";

for (const orderObj of orderLibraries) {
  const libraryId = orderObj.id;
  const booksOut = books.filter(b => b.libraryId === libraryId).map(b => b.id);

  output += `${libraryId} ${booksOut.length}\n\n`;
  output += `${booksOut.join(" ")}`;
  output +=
    orderLibraries.indexOf(orderObj) !== orderLibraries.length - 1 ? "\n" : "";
}

fs.writeFile("./output.txt", output, _ => {});

console.log(output);

// /**
//  * @DEBUG
//  *

console.log("-----------------------");
console.log("maxBooks", maxBooks);
console.log("deadline", deadline);
console.log("books", books);
console.log("-----------------------");

for (const id in library)
  console.log(
    `Library ${id} - signupDays=${library[id].signupDays} maxNumBooksPerDay=${library[id].maxNumBooksPerDay}`
  );

//  */
