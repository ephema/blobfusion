import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="mt-20 flex h-full flex-col items-center gap-4">
      <div className="text-center">
        <h1 className="mb-2 bg-gradient-to-r from-slate-200/60 via-slate-200 to-slate-200/60 bg-clip-text text-4xl font-bold tracking-tight text-transparent">
          🌀 BlobFusion
        </h1>
        <p className="mb-1 text-muted-foreground">
          Making blob space affordable for everyone ✨
        </p>
      </div>
    </div>
  );
}
