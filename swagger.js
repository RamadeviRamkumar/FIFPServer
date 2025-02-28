const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Financial Independence Focus passion",
    description: "Version 1.0"
  },
  host: "148.135.137.252:7000",  
  // host: "localhost:7000",  
  basePath: "/",
  schemes: ["http"],  
};

const outputFile = "./swagger-output.json";
const routes = ["./index.js"];

swaggerAutogen(outputFile, routes, doc);
