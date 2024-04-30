import seedRandom from "seed-random";

import { PartialBlob as PartialBlobType } from "@/lib/types";

import { Badge } from "./ui/badge";

export const PartialBlob: React.FC<PartialBlobType> = ({
  fromAddress,
  size,
  bidInGwei,
}) => {
  const colors = [
    {
      name: "blue",
      border: "border-blue-900",
      bg: "bg-blue-950/40",
      text: "text-blue-100",
      hoverBg: "hover:bg-blue-900/20",
    },
    {
      name: "fuchsia",
      border: "border-fuchsia-900",
      bg: "bg-fuchsia-950/40",
      text: "text-fuchsia-100",
      hoverBg: "hover:bg-fuchsia-900/20",
    },
    {
      name: "purple",
      border: "border-purple-900",
      bg: "bg-purple-950/40",
      text: "text-purple-100",
      hoverBg: "hover:bg-purple-900/20",
    },
    {
      name: "lime",
      border: "border-lime-900",
      bg: "bg-lime-950/60",
      text: "text-lime-100",
      hoverBg: "hover:bg-lime-900/40",
    },
    {
      name: "teal",
      border: "border-teal-900",
      bg: "bg-teal-950/40",
      text: "text-teal-100",
      hoverBg: "hover:bg-teal-900/20",
    },
    {
      name: "cyan",
      border: "border-cyan-900",
      bg: "bg-cyan-950/40",
      text: "text-cyan-100",
      hoverBg: "hover:bg-cyan-900/20",
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
      <div className="max-w-56 overflow-hidden overflow-ellipsis text-foreground">
        {fromAddress}
      </div>
      <div className="flex gap-2">
        <Badge variant="outline" className={`${border} w-fit`}>
          {size} bytes
        </Badge>
        <Badge variant="outline" className={`${border} w-fit`}>
          {bidInGwei.toString()} gwei
        </Badge>
      </div>
    </div>
  );
};
