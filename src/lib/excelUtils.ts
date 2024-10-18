import * as XLSX from 'xlsx';

export const downloadEquipmentAsExcel = (data: any[]) => {
  // Mapear los datos para incluir solo los campos necesarios
  const excelData = data.map(item => ({
    'Nombre Equipo': item.name,
    'Código de Activo': item.assetCode,
    'Modelo': item.model,
    'Marca': item.brand
  }));

  // Crear una nueva hoja de cálculo
  const ws = XLSX.utils.json_to_sheet(excelData);

  // Crear un nuevo libro
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Equipos Médicos");

  // Generar el archivo Excel
  XLSX.writeFile(wb, "Equipos_Medicos.xlsx");
};

export const downloadMaintenanceHistoryAsExcel = (data: any[]) => {
  const worksheet = XLSX.utils.json_to_sheet(data.map(item => ({
    'Tipo Mantenimiento': item.tipo,
    'Regional': item.region,
    'Fecha Inicio': item.fechaInicio,
    'Fecha Fin': item.fechaFin,
    'Código de Activo': item.equipo,
    'Estado': item.estado
  })));

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Historial Mantenimientos");

  XLSX.writeFile(workbook, "historial_mantenimientos.xlsx");
};
