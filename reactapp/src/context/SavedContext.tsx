"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  postService,
  SavedList,
  SavedListWithItems,
} from "@/features/posts/services/postService";
import { useAuth } from "./AuthContext";

interface SavedContextType {
  lists: SavedList[];
  savedPostIds: number[];
  fetchLists: () => Promise<void>;
  createList: (name: string, description: string) => Promise<void>;
  bookmark: (postId: number, listId: number) => Promise<void>;
  unbookmark: (postId: number) => Promise<void>;
  getListWithItems: (listId: number) => Promise<SavedListWithItems>;
  refreshListWithItems: (listId: number) => Promise<SavedListWithItems>;
}

const SavedContext = createContext<SavedContextType | undefined>(undefined);

export const SavedProvider = ({ children }: { children: React.ReactNode }) => {
  const [lists, setLists] = useState<SavedList[]>([]);
  const [savedPostIds, setSavedPostIds] = useState<number[]>([]);
  const { isAuthenticated } = useAuth();
  const fetchLists = async () => {
    try {
      const data = await postService.getSavedLists();
      setLists(data);
      const defaultList = data.find((l) => l.is_default);
      if (defaultList) {
        const listWithItems = await postService.getSavedListWithItems(
          defaultList.id
        );
        setSavedPostIds(listWithItems.items.map((p) => p.id));
      }
    } catch (error) {
      console.error("Error fetching lists", error);
    }
  };

  const createList = async (name: string, description: string) => {
    try {
      const newList = await postService.createSavedList(name, description);
      setLists((prev) => [...prev, newList]);
    } catch (error) {
      console.error("Error creating list", error);
    }
  };

  const bookmark = async (postId: number, listId: number) => {
    try {
      await postService.bookmarkPost(postId, listId);

      setSavedPostIds((prev) => [...new Set([...prev, postId])]);

      setLists((prev) =>
        prev.map((l) =>
          l.id === listId ? { ...l, post_count: l.post_count + 1 } : l
        )
      );
    } catch (error) {
      console.error("Error bookmarking post", error);
    }
  };

  const unbookmark = async (postId: number) => {
    try {
      await postService.unbookmarkPost(postId);

      setSavedPostIds((prev) => prev.filter((id) => id !== postId));

      setLists((prev) =>
        prev.map((l) => ({
          ...l,
          post_count: l.post_count - (l.post_count > 0 ? 1 : 0),
        }))
      );
    } catch (error) {
      console.error("Error unbookmarking post", error);
    }
  };

  const getListWithItems = async (listId: number) => {
    try {
      return await postService.getSavedListWithItems(listId);
    } catch (error) {
      console.error("Error fetching list with items", error);
      throw error;
    }
  };

  const refreshListWithItems = async (listId: number) => {
    try {
      const list = await postService.getSavedListWithItems(listId);
      return list;
    } catch (error) {
      console.error("Error refreshing list:", error);
      throw error;
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      setLists([]);
      setSavedPostIds([]);
      return;
    }

    fetchLists();
  }, [isAuthenticated]);

  return (
    <SavedContext.Provider
      value={{
        lists,
        savedPostIds,
        fetchLists,
        createList,
        bookmark,
        unbookmark,
        getListWithItems,
        refreshListWithItems,
      }}
    >
      {children}
    </SavedContext.Provider>
  );
};

export const useSaved = () => {
  const context = useContext(SavedContext);
  if (!context) throw new Error("useSaved must be used inside SavedProvider");
  return context;
};