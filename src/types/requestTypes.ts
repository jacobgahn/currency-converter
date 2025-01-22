import { Request } from "express";
import { ConvertRequestParams } from "../routes/convert";

export type ConvertRequest = Request<{}, {}, {}, ConvertRequestParams>;
