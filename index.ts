import express from "express";
import { ReportController } from "./report.controller";

const reportController = new ReportController();

const app = express();

app.use(express.json());

app.get("/informe", reportController.crearInforme);

app.listen(6600, () => {
  console.log("Example app listening on port 6600!");
});
