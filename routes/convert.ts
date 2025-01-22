import { Request, Response, NextFunction } from "express";

var express = require("express");
var router = express.Router();

router.post("/", function (req: Request, res: Response, next: NextFunction) {
	res.send("respond with a resource");
});

module.exports = router;
