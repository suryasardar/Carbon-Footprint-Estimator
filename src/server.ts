import app from "./app";
import { env } from "./utils/env";

const port = Number(env.PORT || 3000);
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Foodprint API listening on http://localhost:${port}`);
});