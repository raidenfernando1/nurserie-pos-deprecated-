export const createClient = async (data: {
  name: string;
  code_name?: string;
}) => {
  try {
    const response = await fetch("/api/admin/consignment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: data.name,
        code_name: data.code_name || null,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to create client");
    }

    return { success: true, data: result.data };
  } catch (error) {
    console.error("Failed to create client:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export const deleteClient = async (data: {
  name: string;
  imageUrl?: string;
}) => {
  try {
    const response = await fetch("/api/admin/consignment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: data.name,
        img_url: data.imageUrl || null,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to create client");
    }

    return { success: true, data: result.data };
  } catch (error) {
    console.error("Failed to create client:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};
