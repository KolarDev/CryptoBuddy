import { AppError } from "../utils/appError";

const errorHandler = (error: any, name: string, from?: string) => {
  console.error(`❌ ERROR in ${name}:`);

  if (from === "axios") {
    if (error.response) {
      console.error("Response Data:", error.response.data);
      console.error("Status Code:", error.response.status);
      console.error("Headers:", error.response.headers);
    } else if (error.request) {
      console.error("No Response:", error.request);
    } else {
      console.error("Axios Error Message:", error.message);
    }
  } else {
    console.error(error);
  }

  throw new AppError(`Error in ${name}`, 500);
};

export { errorHandler };
