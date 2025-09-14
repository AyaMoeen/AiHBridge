import { Button } from "@/components/ui/button";
import CreateList from "@/components/ui/CreateList";
import CardOfList from "@/features/posts/components/CardOfList";

export default function SavedPage() {
  const mockCardLists = [
    {
      id: 1,
      title: "Saved",
      date: "Jan 2, 2024",
      description: "Your default collection of saved tools",
      count_post: 4,
    },
    {
      id: 2,
      title: "Frontend Tools",
      date: "Feb 10, 2024",
      description: "React, Tailwind, and useful frontend utilities",
      count_post: 12,
    },
    {
      id: 3,
      title: "Backend Services",
      date: "Mar 5, 2024",
      description: "APIs, databases, and authentication services",
      count_post: 8,
    },
    {
      id: 4,
      title: "AI & ML",
      date: "Apr 1, 2024",
      description: "AI-powered tools and ML frameworks",
      count_post: 6,
    },
    {
      id: 5,
      title: "Design Resources",
      date: "Apr 15, 2024",
      description: "Figma templates, icons, and UI kits",
      count_post: 9,
    },
  ];
  return (
    <div className="flex flex-col mt-4 w-full px-4 gap-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">My Saved Tools</h1>
        <p className="text-muted-foreground">
          Organize your favorite AI tools into custom lists
        </p>
      </div>

      <div className="flex justify-center">
        <Button className="flex items-center gap-2 rounded bg-secondary cursor-pointer">
          <CreateList />
        </Button>
      </div>

      <div className="w-full">
        {mockCardLists.length === 0 ? (
          <p className="text-foreground text-center">
            No saved tools for selected category
          </p>
        ) : (
          <div className="flex flex-row items-center justify-center gap-2 flex-wrap">
            {mockCardLists.map((list, index) => (
              <CardOfList
                id={index}
                title={list.title}
                date={list.date}
                description={list.description}
                count_post={list.count_post}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
