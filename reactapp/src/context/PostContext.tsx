"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { postService } from "@/features/posts/services/postService";
import { useAuth } from "./AuthContext";

interface PostContextType {
  likedPosts: number[];
  likeCounts: Record<number, number>;
  ratings: Record<number, number>;
  setInitialLikeCount: (postId: number, count: number) => void;
  setInitialRating: (postId: number, avg: number) => void;
  toggleLike: (postId: number) => Promise<void>;
  ratePost: (postId: number, value: number) => Promise<void>;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export function PostProvider({ children }: { children: ReactNode }) {

  const [likedPosts, setLikedPosts] = useState<number[]>([]);
  const [likeCounts, setLikeCounts] = useState<Record<number, number>>({});
  const [ratings, setRatings] = useState<Record<number, number>>({});
  const { isAuthenticated } = useAuth();
  
  const setInitialLikeCount = (postId: number, count: number) => {
    setLikeCounts((prev) => ({ ...prev, [postId]: count }));
  };

  const setInitialRating = (postId: number, avg: number) => {
    setRatings((prev) => ({ ...prev, [postId]: avg }));
  };

 
  useEffect(() => {
    const fetchUserLikes = async () => {
      if (!isAuthenticated) return;
      try {
        const liked = await postService.getLikedPosts();
        setLikedPosts(liked); 
      } catch (err) {
        console.error("Failed to fetch user liked posts:", err);
      }
    };

    fetchUserLikes();
  }, [isAuthenticated]);

  const toggleLike = async (postId: number) => {
    if (!isAuthenticated) return;
    try {
      if (likedPosts.includes(postId)) {
        await postService.unlikePost(postId);
        setLikedPosts((prev) => prev.filter((id) => id !== postId));
        setLikeCounts((prev) => ({
          ...prev,
          [postId]: Math.max((prev[postId] ?? 1) - 1, 0), 
        }));
      } else {
        await postService.likePost(postId);
        setLikedPosts((prev) => [...prev, postId]);
        setLikeCounts((prev) => ({
          ...prev,
          [postId]: (prev[postId] ?? 0) + 1,
        }));
      }
    } catch (err) {
      console.error("Failed to toggle like:", err);
    }
  };

  const ratePost = async (postId: number, value: number) => {
    if (!isAuthenticated) return;
    try {
      await postService.ratePost(postId, value);

      const updatedPost = await postService.getPostById(postId);

      if (updatedPost && updatedPost.avg_rating !== undefined) {
        setRatings((prev) => ({
          ...prev,
          [postId]: updatedPost.avg_rating,
        }));
      }
    } catch (err) {
      console.error("Failed to rate post:", err);
    }
  };

  return (
    <PostContext.Provider
      value={{
        likedPosts,
        likeCounts,
        ratings,
        setInitialLikeCount,
        setInitialRating,
        toggleLike,
        ratePost,
      }}
    >
      {children}
    </PostContext.Provider>
  );
}

export const usePostContext = () => {
  const context = useContext(PostContext);
  if (!context)
    throw new Error("usePostContext must be used within PostProvider");
  return context;
};
