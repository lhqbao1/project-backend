import express from "express";
import bodyParser from "body-parser";

let configViewEngine = (app) => {
    app.use(express.static("./src/public"));
    app.set("view engine", "ejs");
    app.set("views", "./src/views")
}

module.exports = configViewEngine;