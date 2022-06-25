import { createExpressApp } from "./infra/http/createExpressApp";

(async () => {
  const app = await createExpressApp();

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Running on port ${PORT}`));
})();
