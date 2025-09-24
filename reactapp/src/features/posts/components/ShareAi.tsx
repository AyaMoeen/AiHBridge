import RequireLoginDialog from "@/components/common/RequireLoginDialog";
import { AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import { Avatar } from "@radix-ui/react-avatar";
import { User } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

interface props {
  author: string;
  profile_picture?: string;
}
export default function ShareAi({ profile_picture }: props) {
  const { isAuthenticated } = useAuth();
  const [showRequireLogin, setShowRequireLogin] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isAuthenticated) {
      e.preventDefault();
      setShowRequireLogin(true);
    }
  };
  return (
    <>
      <Link to="/create-post" className="w-full" onClick={handleClick}>
        <div className="w-full flex items-center justify-start gap-4 text-card-foreground shadow-lg p-5 rounded-md mb-6 hover:cursor-pointer">
          <Avatar className="h-10 w-10">
            {isAuthenticated && profile_picture ? (
              <img
                src={`http://127.0.0.1:8000/${profile_picture}`} 
                className="w-9 h-9 rounded-full object-cover"
                alt="User Avatar"
              />
            ) : (
              <AvatarFallback><User className="text-primary"/></AvatarFallback>
            )}
          </Avatar>
          <span className="w-[90%] border-1 rounded-xl border-gray-300 p-2 bg-secondary-foreground">
            Share An Ai tools ...
          </span>
        </div>
      </Link>
      <RequireLoginDialog
        open={showRequireLogin}
        onOpenChange={setShowRequireLogin}
      />
    </>
  );
}
