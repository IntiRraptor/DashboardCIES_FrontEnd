const API_URL = process.env.NEXT_PUBLIC_API_URL;
import { EquipmentDetail } from "@/app/dashboard/equipos-medicos/data/schema";

// Mantenimientos
export const getMantenimientos = async (filters = {}) => {
  try {
    const response = await fetch(`${API_URL}/mantenimientos`, {
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
  const response = await fetch(`${API_URL}/mantenimientos`, {
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
  const response = await fetch(`${API_URL}/mantenimientos/${id}`, {
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
  const response = await fetch(`${API_URL}/mantenimientos/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Error deleting mantenimiento");
  }
  return response.json();
};

// Solicitudes Externas
export const getSolicitudesExternas = async (filters = {}) => {
  const queryParams = new URLSearchParams(filters).toString();
  const response = await fetch(
    `${API_URL}/solicitudes-externas?${queryParams}`
  );
  if (!response.ok) {
    throw new Error("Error fetching solicitudes externas");
  }
  return response.json();
};

export const createSolicitudExterna = async (solicitudData: any) => {
  const response = await fetch(`${API_URL}/solicitudes-externas`, {
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
  const response = await fetch(`${API_URL}/solicitudes-externas/${id}`, {
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
  const response = await fetch(`${API_URL}/solicitudes-externas/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Error deleting solicitud externa");
  }
  return response.json();
};

export const getEquipment = async (): Promise<EquipmentDetail[]> => {
  const equipmentApiUrl =
    "https://medibit.cies.org.bo/legacy/afciesrednacional/equiposmedicos";
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzI5MDAyMTc5LCJpYXQiOjE3Mjg3ODYxNzksImp0aSI6ImFkN2I0ZTZhYzRlMTQzZjk4MzZlYTZjNTIwNzBmY2M2IiwidXNlcl9pZCI6MzcyfQ.Ih_nvzSDUBIP-QMULlYP_Q4vURheAtwqb6UACsPj6fo";

  let allEquipment: EquipmentDetail[] = [];
  let nextUrl: string | null = `${equipmentApiUrl}?page=1`;

  while (nextUrl) {
    try {
      const response = await fetch(nextUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          regional: "17",
        },
      });

      console.log("Fetch response status:", response.status);

      if (!response.ok) {
        throw new Error(
          `Error al obtener los equipos médicos: ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("Fetched data:", data);

      if (!data.results || !Array.isArray(data.results)) {
        throw new Error(
          "La respuesta de la API no contiene un array de resultados válido."
        );
      }

      allEquipment = [...allEquipment, ...data.results];
      nextUrl = data.next;

      console.log(
        `Obtenidos ${data.results.length} equipos. Siguiente página: ${nextUrl}`
      );
    } catch (error) {
      console.error("Error fetching equipment data:", error);
      break; // Salir del bucle en caso de error
    }
  }

  console.log(`Total de equipos obtenidos: ${allEquipment.length}`);
  return allEquipment;
};
