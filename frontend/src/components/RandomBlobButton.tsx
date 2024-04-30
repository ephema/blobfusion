import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "./ui/tooltip";
import { SparklesIcon } from "lucide-react";
import { Button } from "./ui/button";

export const RandomBlobButton: React.FC<{
  onClick: () => void;
  disabled: boolean;
}> = ({ onClick, disabled }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute bottom-2 right-2 text-slate-700 transition-all disabled:opacity-0 group-hover:opacity-100 group-hover:disabled:opacity-0 md:opacity-0"
            onClick={onClick}
            disabled={disabled}
            type="button"
          >
            <SparklesIcon />
          </Button>
        </TooltipTrigger>

        <TooltipContent side="right" sideOffset={16}>
          <p>Generate Random Blob</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
