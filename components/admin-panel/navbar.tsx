import { ModeToggle } from "@/components/mode-toggle";
import { UserNav } from "@/components/admin-panel/user-nav";
import { SheetMenu } from "@/components/admin-panel/sheet-menu";
import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import { Button } from "../ui/button";
import { Github, Plus } from "lucide-react";
import { useProjectStore } from "@/zustand-store";

interface NavbarProps {
  title: string;
}

export function Navbar({ title }: NavbarProps) {
  const initiateNewProject = useProjectStore(state => state.initiateNewProject);

  return (
    <header className="sticky top-0 z-10 w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:shadow-secondary">
      <div className="mx-4 sm:mx-8 flex h-14 items-center">
        <div className="flex items-center space-x-4 lg:space-x-0">
          <SheetMenu />
          <h1 className="font-bold">{title}</h1>
        </div>
        <div className="flex flex-1 gap-4 items-center justify-end">
          <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <Button
            variant="outline"
            className="w-9 h-9 p-0 border-muted-foreground/30 hover:border-muted-foreground/50 hover:bg-muted/50"
            onClick={() => window.open('https://github.com/yourusername/yourrepo', '_blank')}
          >
            <Github className="h-4 w-4 text-muted-foreground" />
          </Button>
          <Button
            onClick={initiateNewProject}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </Button>


        </div>
      </div>
    </header>
  );
}
