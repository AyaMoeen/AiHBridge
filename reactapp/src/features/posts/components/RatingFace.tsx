import { useState } from "react";
import { Frown, Meh, Smile, Laugh, Angry } from "lucide-react";
const customIcons = [
  {
    value: 1,
    icon: (
      <Angry className="text-red-500 h-6 w-6 transition-transform duration-300 hover:scale-130 hover:cursor-pointer " />
    ),
    label: "Very Dissatisfied",
  },
  {
    value: 2,
    icon: (
      <Frown className="text-red-400 h-6 w-6 transition-transform duration-200 hover:scale-130 hover:cursor-pointer " />
    ),
    label: "Dissatisfied",
  },
  {
    value: 3,
    icon: (
      <Meh className="text-yellow-400 h-6 w-6 transition-transform duration-200 hover:scale-130 hover:cursor-pointer" />
    ),
    label: "Neutral",
  },
  {
    value: 4,
    icon: (
      <Smile className="text-green-500 h-6 w-6 transition-transform duration-200 hover:scale-130 hover:cursor-pointer" />
    ),
    label: "Satisfied",
  },
  {
    value: 5,
    icon: (
      <Laugh className="text-green-700 h-6 w-6 transition-transform duration-200 hover:scale-130 hover:cursor-pointer" />
    ),
    label: "Very Satisfied",
  },
];

export default function RatingFaces() {
  const [rating, setRating] = useState(0);

  return (
    <div className="flex gap-2">
      {customIcons.map(({ value, icon, label }) => (
        <button
          key={value}
          onClick={() => setRating(value)}
          title={label}
          className={`transition-transform ${
            rating === value ? "scale-125" : "opacity-70"
          }`}
        >
          {icon}
        </button>
      ))}
    </div>
  );
}
