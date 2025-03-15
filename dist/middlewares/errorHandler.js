"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const appError_1 = require("../utils/appError");
const errorHandler = (error, name, from) => {
    console.error(`❌ ERROR in ${name}:`);
    if (from === "axios") {
        if (error.response) {
            console.error("Response Data:", error.response.data);
            console.error("Status Code:", error.response.status);
            console.error("Headers:", error.response.headers);
        }
        else if (error.request) {
            console.error("No Response:", error.request);
        }
        else {
            console.error("Axios Error Message:", error.message);
        }
    }
    else {
        console.error(error);
    }
    throw new appError_1.AppError(`Error in ${name}`, 500);
};
exports.errorHandler = errorHandler;
