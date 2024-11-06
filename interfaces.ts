export interface InformeProduccion {
  pathLogoProyecto: string;
  fechaSeleccionada: string;
  trabajos: Trabajo[];
  trabajo_costos: TrabajoCosto[];
}

interface Trabajo {
  id_trabajo: string;
  nombre: string;
  actividad: string;
  unidad_produccion: string;
}

interface TrabajoCosto {
  id_trabajo: string;
  nombre: string;
  costo_produccion: number;
  unidad_produccion: string;
}
