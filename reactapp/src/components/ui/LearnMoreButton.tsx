import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Props {
  postId: number;
}

export default function LearnMoreButton({ postId }: Props) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/posts/${postId}`);
  };

  return (
    <button
      onClick={handleClick}
      className="relative flex items-center justify-center w-28 h-8 px-2 font-bold text-primary uppercase transition-colors duration-300 bg-transparent border-2 border-accent rounded-full overflow-hidden group hover:bg-accent hover:text-accent-foreground hover:cursor-pointer"
    >
      <span className="bg-secondary absolute left-0 flex items-center justify-center w-7 h-7 rounded-full transition-all duration-300 group-hover:w-full">
        <ArrowRight className="w-4 h-4 text-white transition-transform duration-300 group-hover:translate-x-6 group-hover:text-black" />
      </span>
      <span className="relative z-10 ml-6 transition-all duration-300 group-hover:text-accent-foreground text-[10px] group-hover:ml-2">
        Learn More
      </span>
    </button>
  );
}
