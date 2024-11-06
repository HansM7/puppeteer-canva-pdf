import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";

import QuickChart from "quickchart-js";
export class PdfService {
  createOptionSandBox() {
    let options = {};

    const production = false;

    if (production) {
      options = {
        headless: true,
        executablePath: "/usr/bin/chromium-browser",
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      };
    }

    return options;
  }

  async createImage(user_id: number, id: string, data: any) {
    const chart = new QuickChart();
    chart
      .setConfig({
        type: "line",
        data: {
          labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo"],
          datasets: [
            {
              label: "Ventas",
              data: [30, 20, 40, 50, 60],
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        },
      })
      .setWidth(800)
      .setHeight(600);

    const url = chart.getUrl();

    const imageBuffer = await chart.toBinary();
    fs.writeFileSync(`./charts/chart-${user_id}-${id}.png`, imageBuffer);
  }

  async createPdf(template: string, id: string, user_id: number) {
    this.deletePdfs(user_id, id);

    const options = this.createOptionSandBox();

    const browser = await puppeteer.launch(options);
    const page = await browser.newPage();

    await page.setContent(template, { waitUntil: "networkidle0" });

    // Generate the PDF
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
    });

    await browser.close();

    await fs.promises.writeFile(
      "reports/informe-" + user_id + "-" + id + ".pdf",
      pdfBuffer
    );
  }

  deletePdfs(user_id: number, currentId: string) {
    const directory = path.resolve(__dirname, "reports");

    fs.readdir(directory, (err, files) => {
      if (err) {
        console.error("Error leyendo la carpeta:", err);
        return;
      }

      files.forEach((file) => {
        // Verificar si el archivo es un PDF y corresponde al user_id
        const userPrefix = `informe-${user_id}-`;
        if (
          file.endsWith(".pdf") &&
          file.startsWith(userPrefix) &&
          !file.includes(currentId)
        ) {
          const filePath = path.join(directory, file);
          fs.unlink(filePath, (err) => {
            if (err) {
              // console.error(`Error eliminando el archivo ${file}:`, err);
            } else {
              // console.log(`Archivo eliminado: ${file}`);
            }
          });
        }
      });
    });
  }

  deleteImages(user_id: number, currentId: string) {
    const directory = path.resolve(__dirname, "charts");

    fs.readdir(directory, (err, files) => {
      if (err) {
        console.error("Error al leer el directorio charts:", err);
        return;
      }

      files.forEach((file) => {
        // Verificar si el archivo pertenece al user_id y no es la imagen actual
        const userPrefix = `chart-${user_id}-`;
        if (file.startsWith(userPrefix) && !file.includes(currentId)) {
          const filePath = path.join(directory, file);
          fs.unlink(filePath, (err) => {
            if (err) {
              // console.error(`Error eliminando el archivo ${file}:`, err);
            } else {
              // console.log(`Archivo eliminado: ${file}`);
            }
          });
        }
      });
    });
  }
}
