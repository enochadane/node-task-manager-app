import app from "./app";
import configs from "./config/config";

import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger.json";
const port = configs.PORT;

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
