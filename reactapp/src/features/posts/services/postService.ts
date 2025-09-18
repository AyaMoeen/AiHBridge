import axios, { AxiosResponse } from "axios";
import { tokenManager } from "@/features/auth/services/authService";

const API_BASE_URL = "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = tokenManager.getAccessToken();
  if (token) config.headers.Authorization = `Token ${token}`;
  return config;
});

export interface Post {
  id: number;
  title: string;
  description: string;
  personal_review: string;
  link: string;
  categories: { id: number; name: string }[];
  user: string;
  username: string;
  name: string;
  profile_picture: string | null;
  like_count: number;
  comment_count: number;
  avg_rating: number;
  created_at: string;
  updated_at: string;
}
export interface LikeResponse {
  id: number;
  user: number;
  post: number;
  created_at: string;
}
export interface RatingResponse {
  id: number;
  user: number;
  post: number;
  value: number;
  created_at: string;
  updated_at: string;
}
class PostService {
  async createPost(data: {
    title: string;
    description: string;
    personal_review: string;
    link?: string;
    categories: number[];
  }): Promise<Post> {
    try {
      const response: AxiosResponse<Post> = await api.post("/posts/", data);
      return response.data;
    } catch (error) {
      console.error("Failed to create post:", error);
      throw error;
    }
  }

  async getPosts(): Promise<Post[]> {
    try {
      const response: AxiosResponse<Post[]> = await api.get("/posts/");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      throw error;
    }
  }
  async getPostById(postId: number): Promise<Post> {
    try {
      const response: AxiosResponse<Post> = await api.get(`/posts/${postId}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch posts", error);
      throw error;
    }
  }

  async getMyPosts(): Promise<Post[]> {
    try {
      const response: AxiosResponse<Post[]> = await api.get(`/posts/my_posts/`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch post:`, error);
      throw error;
    }
  }
  async searchPosts(query: string): Promise<{ id: number }[]> {
    try {
      const response: AxiosResponse<{ id: number }[]> = await api.get(
        `/search/posts/?q=${query}`
      );
      return response.data;
    } catch (error) {
      console.error("Failed to search posts:", error);
      throw error;
    }
  }

  async updatePost(
    id: number,
    data: Partial<{
      title: string;
      description: string;
      link: string;
      personal_review: string;
      category_ids: number[];
    }>
  ): Promise<Post> {
    try {
      const response: AxiosResponse<Post> = await api.put(
        `/posts/${id}/`,
        data
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to update post with id ${id}:`, error);
      throw error;
    }
  }

  async deletePost(id: number): Promise<void> {
    try {
      await api.delete(`/posts/${id}/`);
    } catch (error) {
      console.error(`Failed to delete post with id ${id}:`, error);
      throw error;
    }
  }

  async likePost(id: number): Promise<LikeResponse> {
    try {
      const response: AxiosResponse<LikeResponse> = await api.post(
        `/interactions/posts/${id}/like/`
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to like post with id ${id}:`, error);
      throw error;
    }
  }

  async unlikePost(id: number): Promise<void> {
    try {
      await api.post(`/interactions/posts/${id}/unlike/`);
    } catch (error) {
      console.error(`Failed to unlike post with id ${id}:`, error);
      throw error;
    }
  }
  async ratePost(postId: number, value: number): Promise<RatingResponse> {
    try {
      const response: AxiosResponse<RatingResponse> = await api.post(
        `/interactions/posts/${postId}/rate/`,
        { value }
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to rate post with id ${postId}:`, error);
      throw error;
    }
  }
  async getPostsByUserId(id: number) {
    const res = await api.get(`/posts/?user_id=${id}`);
    return res.data;
  }

}

export const postService = new PostService();
