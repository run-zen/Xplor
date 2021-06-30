import { app } from "./app.js";

const port = 8000;
app.listen(port, () => {
  console.log(`running at http://localhost:8000`);
});
