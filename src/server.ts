import app from "./app";
import configs from "./config/config";

const port = configs.PORT;

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
