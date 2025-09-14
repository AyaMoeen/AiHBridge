import { Link } from "react-router-dom";

interface props {
  author: string;
}
export default function ShareAi({ author }: props) {
  const initials = author
    ? author
        .split(" ")
        .filter(Boolean)
        .map((name) => name[0])
        .join("")
        .toUpperCase()
    : "??";
  return (
    <Link to="/create-post" className="w-full">
      <div className="w-full flex items-center justify-start gap-4   text-card-foreground shadow-lg p-5 rounded-md mb-6 hover:cursor-pointer">
        <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
          {initials}
        </div>
        <span className="w-[90%] border-1 rounded-xl border-gray-300 p-2 bg-secondary-foreground">
          Share An Ai tools ...
        </span>
      </div>
    </Link>
  );
}
