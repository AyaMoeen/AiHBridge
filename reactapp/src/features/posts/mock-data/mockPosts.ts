export interface PostData {
  id: number;
  author: {
    name: string;
    username: string;
  };
  badges: string[];
  rating: number;
  title: string;
  description: string;
  review: string;
  shareUrl: string;
}

export const posts: PostData[] = [
  {
    id: 1,
    author: { name: "Ahmad Adel", username: "@ahmadadel03" },
    badges: ["AI", "ChatGPT", "Productivity"],
    rating: 4.8,
    title: "Boost Productivity with AI and ChatGPT",
    description:
      "This is a sample post about AI and productivity using ChatGPT.This is a sample post about AI and productivity using ChatGPT.This is a sample post about AI and productivity using ChatGPT.This is a sample post about AI and productivity using ChatGPT.This is a sample post about AI and productivity using ChatGPT.",
    review:
      "I really enjoyed writing this post! AI can significantly improve productivity if used correctly.",
    shareUrl: "https://example.com/post/1",
  },
  {
    id: 2,
    author: { name: "Sara Ali", username: "@sarali01" },
    badges: ["JavaScript", "React"],
    rating: 4.5,
    title: "Getting Started with React",
    description: "React makes front-end development much easier and fun!",
    review: "React hooks are amazing. I love building reusable components.",
    shareUrl: "https://google.com",
  },
  {
    id: 3,
    author: { name: "Omar H", username: "@omarh_dev" },
    badges: ["Tailwind", "UI"],
    rating: 4.7,
    title: "Rapid UI Development with Tailwind CSS",
    description: "Tailwind CSS is super efficient for rapid UI development.",
    review: "Tailwind utilities save so much time! Designing UI is easier now.",
    shareUrl: "https://example.com/post/3",
  },
];
