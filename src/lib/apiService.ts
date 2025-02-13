// const API_URL = "http://localhost:4000";
const API_URL = "https://dashboardciesbackend-production-fee2.up.railway.app";
const EQUIPMENT_API_URL =
  "https://medibit.cies.org.bo/legacy/afciesrednacional/equiposmedicos";
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM5NjQ0ODgxLCJpYXQiOjE3Mzk0Mjg4ODEsImp0aSI6IjljZWRlODA5ZTAwNDQ5ZDBiMjA1YWY1NzhiNTgwNGQ4IiwidXNlcl9pZCI6MzcyfQ.qV-KLgU3BFPCbgrU_O9aA1htrrNqBXRqstleE_OwQF4";
import { EquipmentDetail } from "@/app/dashboard/equipos-medicos/data/schema";
import { ExternalRequest } from "@/app/dashboard/mantenimientos/solicitudes-externas/data/schema";

// Mantenimientos
export const getMantenimientos = async (filters = {}) => {
  try {
    const response = await fetch(`${API_URL}/api/mantenimientos`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });

    const resJson = await response.json();

    // console.log("response: ", resJson);

    if (!response.ok) {
      throw new Error("Error fetching mantenimientos");
    }

    const data = await resJson;
    // console.log("Data: ", data);
    return data;
  } catch (error) {
    console.error("Error during fetch:", error);
    throw error; // Propaga el error para manejarlo en la llamada de la función
  }
};

export const createMantenimiento = async (mantenimientoData: any) => {
  const response = await fetch(`${API_URL}/api/mantenimientos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
    },
    body: JSON.stringify(mantenimientoData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error creating mantenimiento");
  }
  return response.json();
};

export const updateMantenimiento = async (
  id: string,
  mantenimientoData: any
) => {
  const response = await fetch(`${API_URL}/api/mantenimientos/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(mantenimientoData),
  });
  if (!response.ok) {
    throw new Error("Error updating mantenimiento");
  }
  return response.json();
};

export const deleteMantenimiento = async (id: string) => {
  const response = await fetch(`${API_URL}/api/mantenimientos/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Error deleting mantenimiento");
  }

  console.log("Response: ", response);

  return "Deleted";
};

// Solicitudes Externas
export const getSolicitudesExternas = async () => {
  const response = await fetch(`${API_URL}/api/solicitudes-externas`);
  if (!response.ok) {
    throw new Error("Error fetching solicitudes externas");
  }
  return response.json();
};

export const createSolicitudExterna = async (solicitudData: any) => {
  const response = await fetch(`${API_URL}/api/solicitudes-externas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(solicitudData),
  });
  if (!response.ok) {
    throw new Error("Error creating solicitud externa");
  }
  return response.json();
};

export const updateSolicitudExterna = async (
  id: string,
  solicitudData: any
) => {
  const response = await fetch(`${API_URL}/api/solicitudes-externas/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(solicitudData),
  });
  if (!response.ok) {
    throw new Error("Error updating solicitud externa");
  }
  return response.json();
};

export const deleteSolicitudExterna = async (id: string) => {
  const response = await fetch(`${API_URL}/api/solicitudes-externas/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Error deleting solicitud externa");
  }
  return response.json();
};

export const getEquipment = async (): Promise<EquipmentDetail[]> => {
  let allEquipment: EquipmentDetail[] = [];
  let nextUrl: string | null = `${EQUIPMENT_API_URL}?page=1`;

  console.log("nextUrl: ", nextUrl);

  while (nextUrl) {
    try {
      const response = await fetch(nextUrl, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Authorization: `Bearer ${token}`,
          regional: "17",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Error al obtener los equipos médicos: ${response.statusText}`
        );
      }

      const data = await response.json();

      if (!data.results || !Array.isArray(data.results)) {
        throw new Error(
          "La respuesta de la API no contiene un array de resultados válido."
        );
      }

      allEquipment = [...allEquipment, ...data.results];
      nextUrl = data.next;

      // console.log(
      //   `Obtenidos ${data.results.length} equipos. Siguiente página: ${nextUrl}`
      // );
    } catch (error) {
      console.error("Error fetching equipment data:", error);
      break; // Salir del bucle en caso de error
    }
  }

  console.log(`Total de equipos obtenidos: ${allEquipment.length}`);
  return allEquipment;
};

export const getExternalRequests = async (): Promise<ExternalRequest[]> => {
  const response = await fetch(`${API_URL}/api/solicitudes-externas`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });

  if (!response.ok) {
    throw new Error("Error fetching solicitudes");
  }

  const data = await response.json();

  // Log the data to see what exactly you're receiving
  console.log("Data received from backend:", data);
  return data.solicitudes;
};
