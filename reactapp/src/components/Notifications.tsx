"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar } from "@/components/ui/avatar";
import {
  getNotifications,
  markAsRead,
  Notification,
} from "@/services/notificationsServics";
import { Button } from "./ui/button";
import { formatRelativeTime } from "@/utils/formatRelativeTime";
import { useNavigate } from "react-router-dom";

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  async function fetchNotifications() {
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error("Failed to load notifications", err);
    }
  }

  async function handleMarkAsRead(id: number, actor: number) {
    navigate(`/otherProfile/${actor}`);
    try {
      await markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error("Failed to mark notification", err);
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="relative p-2 cursor-pointer"
          variant="ghost"
          size="icon"
        >
          <Bell className="w-6 h-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-80 max-h-96 overflow-y-auto animate-fade-in">
        <DropdownMenuLabel className="flex justify-between items-center">
          Notifications
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-blue-600 hover:text-blue-800"
              onClick={() =>
                setNotifications((prev) =>
                  prev.map((n) => ({ ...n, read: true }))
                )
              }
            >
              Mark all as read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {notifications.length === 0 && (
          <DropdownMenuItem className="text-sm text-gray-500">
            No notifications yet
          </DropdownMenuItem>
        )}

        {notifications.map((n) => (
          <DropdownMenuItem
            key={n.id}
            onClick={() => handleMarkAsRead(n.id, n.actor)}
            className={`flex gap-4 mb-1 items-center cursor-pointer rounded-lg transition-colors ${
              n.read
                ? "bg-white hover:bg-gray-50"
                : "bg-muted hover:bg-blue-100"
            }`}
          >
            <Avatar className="h-8 w-8">
              <img
                src={n.actor_profile_picture}
                className="w-7 h-7 rounded-full object-cover"
              />
            </Avatar>
            <div className="flex flex-col text-sm gap-1">
              <strong
                className={`${
                  n.read
                    ? "text-gray-800 font-semibold"
                    : "text-gray-900 font-semibold"
                }`}
              >
                {n.actor_name}
              </strong>
              <span className="flex flex-row items-center gap-1">
                <span className="text-[11px] text-gray-700">{n.verb}</span>
                <span className="text-[10px] text-gray-500">
                  • {formatRelativeTime(n.timestamp)}
                </span>
              </span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
