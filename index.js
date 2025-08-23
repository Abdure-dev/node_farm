const fs = require("fs");
const http = require("http");
const url = require("url");

////////////////////////file
// //blocking, synchronous way
// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");

// //console.log(textIn);

// const textOut = `This is what we know about avocado: ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync("./txt/output.tx", textOut);

// //console.log("File written");
// //non_blocking, asyncronous way

// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   if (err) return console.log("Error");
//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);
//     fs.readFile("./txt/append.txt", "utf-8", (err, data3) => {
//       console.log(data3);

//       fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, "utf-8", (err) => {
//         console.log("your final has been written");
//       });
//     });
//   });
// });
// console.log("will read file");
///////////////////////////////////server
//create a server
const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);

  if (!product.organic)
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
  return output;
};
const tempOverview = fs.readFileSync(
  `${__dirname}/final/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/final/templates/template-card.html`,
  "utf-8"
);
const temProduct = fs.readFileSync(
  `${__dirname}/final/templates/template-product.html`,
  "utf-8"
);

const data = fs.readFileSync(
  `${__dirname}/starter/dev-data/data.json`,
  "utf-8"
);
const dataobj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  //OVERVIEW PAGE
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });
    const cardHtml = dataobj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardHtml);
    res.end(output);
    //PRODUCT PAGE
  } else if (pathname === "/product") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });
    const product = dataobj[query.id];
    const output = replaceTemplate(temProduct, product);
    res.end(output);
    //API PAGE
  } else if (pathname === "/api") {
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);
    //NOT FOUND
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello-word",
    });
    res.end("<h1>page not found</h1>");
  }
});
//listen to incoming request
server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to request on port 8000");
});
