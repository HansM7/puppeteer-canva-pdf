import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { ReportService } from "./report.service";

const reportService = new ReportService();

export class ReportController {
  async crearInforme(req: Request, res: Response) {
    const response = await reportService.crearInforme();

    if (response.success && response.payload) {
      const filePath = path.resolve(
        __dirname,
        `reports/informe-${response.payload.user_id}-${response.payload.id}.pdf`
      );

      if (fs.existsSync(filePath)) {
        const stat = fs.statSync(filePath);
        res.setHeader("Content-Length", stat.size);
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="informe-diario.pdf"`
        );

        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
      } else {
        res
          .status(404)
          .json({ success: false, message: "Archivo no encontrado" });
      }
    } else {
      res.json(response);
    }
  }
}
