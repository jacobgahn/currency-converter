import { Request, Response, NextFunction } from "express";

var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req: Request, res: Response, next: NextFunction) {
	res.send("Hello Trunk Tools!\nAvailable routes: /convert\n");
});

module.exports = router;
