export async function registerUser(userData: {
  username: string;
  name: string;
  email: string;
  password: string;
}) {
  try {
    const API_URL = import.meta.env.VITE_API_BASE_URL;
    const response = await fetch(`${API_URL}/accounts/register/`,{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Something went wrong");
    }

    return data;
  } catch (error) {
    console.error("Register API error:", error);
    throw error;
  }
}

  