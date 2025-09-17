import { Avatar } from "@radix-ui/react-avatar";
import { Link } from "react-router-dom";

interface props {
  author: string;
  profile_picture?: string;
}
export default function ShareAi({ profile_picture  }: props) {
  return (
    <Link to="/create-post" className="w-full">
      <div className="w-full flex items-center justify-start gap-4   text-card-foreground shadow-lg p-5 rounded-md mb-6 hover:cursor-pointer">
        <Avatar className="h-10 w-10">
          <img
            src={`http://127.0.0.1:8000/${profile_picture}`}
            className="w-9 h-9 rounded-full object-cover"
          />
        </Avatar>
        <span className="w-[90%] border-1 rounded-xl border-gray-300 p-2 bg-secondary-foreground">
          Share An Ai tools ...
        </span>
      </div>
    </Link>
  );
}