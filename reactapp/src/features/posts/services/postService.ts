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
  profile_picture?: string;
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
export interface Comment {
  id: number;
  user: number;
  username: string;
  name: string;
  profile_picture: string | null;
  post: number;
  text: string;
  created_at: string;
}

export interface SavedList {
  id: number;
  name: string;
  description: string;
  is_default: boolean;
  created_at: string;
  post_count: number;
}

export interface SavedListWithItems {
  id: number;
  name: string;
  description: string;
  is_default: boolean;
  created_at: string;
  items: Post[];
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
      const response: AxiosResponse<Post> = await api.post("/posts/", {
        ...data,
        category_ids: data.categories, // 👈 backend expects this
      });
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
      await api.delete(`/interactions/posts/${id}/unlike/`);
    } catch (error) {
      console.error(`Failed to unlike post with id ${id}:`, error);
      throw error;
    }
  }
  async getLikedPosts(): Promise<number[]> {
    try {
      const response: AxiosResponse<{ liked_posts: number[] }> = await api.get(
        `/interactions/posts/liked/`
      );
      return response.data.liked_posts;
    } catch (error) {
      console.error("Failed to fetch liked posts:", error);
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
  async addComment(postId: number, text: string): Promise<Comment> {
    try {
      const response: AxiosResponse<Comment> = await api.post(
        `/interactions/posts/${postId}/comment/`,
        { text }
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to add comment on post ${postId}:`, error);
      throw error;
    }
  }
  async getComments(postId: number): Promise<Comment[]> {
    try {
      const response: AxiosResponse<Comment[]> = await api.get(
        `/interactions/posts/${postId}/comments/`
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch comments for post ${postId}:`, error);
      throw error;
    }
  }
  async getTrendyTools(): Promise<Post[]> {
    try {
      const response: AxiosResponse<Post[]> = await api.get(`/posts/top_posts`);
      return response.data;
    } catch (error) {
      console.error("Failt To Get Trendy", error);
      throw error;
    }
  }
  async getSavedLists(): Promise<SavedList[]> {
    try {
      const response: AxiosResponse<SavedList[]> = await api.get(
        "/savedlists/"
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch saved lists:", error);
      throw error;
    }
  }

  async createSavedList(name: string, description: string): Promise<SavedList> {
    try {
      const response: AxiosResponse<SavedList> = await api.post(
        "/savedlists/",
        {
          name,
          description,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Faild to create list", error);
      throw error;
    }
  }
  async bookmarkPost(
    postId: number,
    listId: number
  ): Promise<{ detail: string }> {
    try {
      const response = await api.post("/savedlists/bookmark/", {
        post_id: postId,
        saved_list_id: listId,
      });
      console.log("reponse", response);
      return response.data;
    } catch (error) {
      console.error("Failed to bookmark post:", error);
      throw error;
    }
  }
  async getSavedListWithItems(listId: number): Promise<SavedListWithItems> {
    try {
      const response = await api.get(`/savedlists/${listId}/`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch saved list with items:", error);
      throw error;
    }
  }
  async unbookmarkPost(postId: number): Promise<{ detail: string }> {
    try {
      const response = await api.delete("/savedlists/unbookmark/", {
        data: { post_id: postId },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to unbookmark post:", error);
      throw error;
    }
  }
  async getHighlightedTools(): Promise<Post[]> {
    try {
      const response = await api.get("/profiles/highlighted-tools");
      return response.data;
    } catch (error) {
      console.log("Faild to get HighlightedTools : ", error);
      throw error;
    }
  }
  async summarizeText(text: string): Promise<string> {
    try {
      const response: AxiosResponse<{ summary: string }> = await api.post(
        "/summaries/summarize/",
        { text }
      );
      return response.data.summary;
    } catch (error) {
      console.error("Failed to generate summary:", error);
      throw error;
    }
  }
}

export const postService = new PostService();
