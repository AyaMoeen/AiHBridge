interface props {
  author: string;
}
export default function ShareAi({ author }: props) {
  return (
    <div className="w-full flex items-center justify-start gap-4 border border-border bg-card text-card-foreground shadow-lg p-5 rounded-md mb-6">
      <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
        {author[0] + author.split(" ")[1][0]}
      </div>
      <span className="w-130 border-1 rounded-lg border-gray-300 p-2 ">Share An Ai tools ... </span>
    </div>
  );
}
