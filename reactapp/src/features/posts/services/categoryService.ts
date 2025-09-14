import axios from "axios";
// import { API_BASE_URL } from "@/config";
const API_BASE_URL = "http://127.0.0.1:8000"; 

export interface Category {
  id: number;
  name: string;
}

export const categoryService = {
  async getCategories(): Promise<Category[]> {
    const response = await axios.get(`${API_BASE_URL}/posts/categories`);
    return response.data;
  },
};
