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
  data.forEach(item => {
    const details = JSON.parse(item.details);
    const excelData = [{
      'Tipo Mantenimiento': item.tipo,
      'Regional': item.region,
      'Fecha Inicio': item.fechaInicio,
      'Fecha Fin': item.fechaFin,
      'Código de Activo': item.equipo,
      'Estado': item.estado,
      ...details
    }];

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Historial Mantenimientos");

    const fileName = `${item.tipo}-${details.typeForm}-${item.equipo}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  });
};
