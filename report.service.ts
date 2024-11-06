import { PdfService } from "./pdf.service";
import { TemplateHtmlInforme } from "./template-html";
import { v4 as uuid } from "uuid";

const pdfService = new PdfService();

export class ReportService {
  async crearInforme() {
    try {
      // AQUI COLOCARIAS EL ID DEL USUARIO ACTUAL
      const id = uuid();
      const user_id = 1;

      pdfService.deleteImages(user_id, id);

      await pdfService.createImage(user_id, id, {});

      const template = TemplateHtmlInforme(user_id, id);

      await pdfService.createPdf(template, id, user_id);

      return {
        success: true,
        message: "Error",
        payload: {
          id,
          user_id,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: "Error al crear informe",
      };
    }
  }

  async createInformeGraphic() {
    try {
    } catch (error) {
      return {
        success: false,
        message: "Error al crear informe",
      };
    }
  }
}
