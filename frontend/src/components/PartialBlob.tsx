import { PartialBlob as PartialBlobType } from "@/lib/types";

import { Badge } from "./ui/badge";
import seedRandom from "seed-random";

export const PartialBlob: React.FC<PartialBlobType> = ({
  fromAddress,
  size,
  bidInGwei,
}) => {
  const colors = [
    {
      name: "red",
      border: "border-red-950",
      bg: "bg-red-950/60",
      text: "text-red-100",
      hoverBg: "hover:bg-red-900/40",
    },
    {
      name: "green",
      border: "border-green-950",
      bg: "bg-green-950/60",
      text: "text-green-100",
      hoverBg: "hover:bg-green-900/40",
    },
    {
      name: "blue",
      border: "border-blue-950",
      bg: "bg-blue-950/60",
      text: "text-blue-100",
      hoverBg: "hover:bg-blue-900/40",
    },
    {
      name: "yellow",
      border: "border-yellow-950",
      bg: "bg-yellow-950/60",
      text: "text-yellow-100",
      hoverBg: "hover:bg-yellow-900/40",
    },
    {
      name: "purple",
      border: "border-purple-950",
      bg: "bg-purple-950/60",
      text: "text-purple-100",
      hoverBg: "hover:bg-purple-900/40",
    },
    {
      name: "orange",
      border: "border-orange-950",
      bg: "bg-orange-950/60",
      text: "text-orange-100",
      hoverBg: "hover:bg-orange-900/40",
    },
    {
      name: "amber",
      border: "border-amber-950",
      bg: "bg-amber-950/60",
      text: "text-amber-100",
      hoverBg: "hover:bg-amber-900/40",
    },
    {
      name: "lime",
      border: "border-lime-950",
      bg: "bg-lime-950/60",
      text: "text-lime-100",
      hoverBg: "hover:bg-lime-900/40",
    },
    {
      name: "teal",
      border: "border-teal-950",
      bg: "bg-teal-950/60",
      text: "text-teal-100",
      hoverBg: "hover:bg-teal-900/40",
    },
    {
      name: "cyan",
      border: "border-cyan-950",
      bg: "bg-cyan-950/60",
      text: "text-cyan-100",
      hoverBg: "hover:bg-cyan-900/40",
    },
    {
      name: "rose",
      border: "border-rose-950",
      bg: "bg-rose-950/60",
      text: "text-rose-100",
      hoverBg: "hover:bg-rose-900/40",
    },
  ];

  const seed = `${fromAddress} ${size} ${bidInGwei.toString()}`;
  const randomIndex = Math.floor(seedRandom(seed)() * colors.length);
  const color = colors[randomIndex];

  const { border, bg, text, hoverBg } = color;

  return (
    <div
      className={`mx-2 flex flex-col gap-2 rounded-sm border ${border} ${bg} ${text} ${hoverBg} px-12 py-4 shadow-sm backdrop-blur-md transition-colors`}
    >
      <div className="max-w-48 overflow-hidden overflow-ellipsis text-foreground">
        {fromAddress}
      </div>
      <div className="flex gap-2">
        <Badge variant="outline" className={`${border}`}>
          {size} bytes
        </Badge>
        <Badge variant="outline" className={`${border}`}>
          {bidInGwei.toString()} gwei
        </Badge>
      </div>
    </div>
  );
};
