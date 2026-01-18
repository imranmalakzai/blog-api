import { PORT } from "./config/env.config.js";
import app from "./app.js";

app.listen(PORT, () => {
  console.log(`server is listening on port : ${PORT}`);
});
