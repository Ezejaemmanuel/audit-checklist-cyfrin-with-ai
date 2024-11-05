// components/project/ProjectDialogs.tsx
import { useState, useEffect } from 'react';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Plus, History, ArrowRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Project, useProjectStore } from '@/zustand-store';

interface ProjectDialogsProps {
    children: React.ReactNode;
}

export function ProjectDialogs({ children }: ProjectDialogsProps) {
    const [showInitial, setShowInitial] = useState(true);
    const [showProjects, setShowProjects] = useState(false);
    const [showNewProject, setShowNewProject] = useState(false);
    const [newProjectName, setNewProjectName] = useState('');
    const [error, setError] = useState<string | null>(null);

    const {
        projects,
        currentProject,
        addProject,
        setCurrentProject,
        getLatestProject
    } = useProjectStore();

    const latestProject = getLatestProject();

    // Check if we should show the initial dialog
    useEffect(() => {
        const shouldShowInitial = !currentProject && !showProjects && !showNewProject;
        setShowInitial(shouldShowInitial);
    }, [currentProject, showProjects, showNewProject]);

    const handleCreateProject = () => {
        const trimmedName = newProjectName.trim();

        if (!trimmedName) {
            const errorMessage = "Project name cannot be empty";
            setError(errorMessage);
            toast.error('Project Creation Failed', {
                description: errorMessage,
            });
            return;
        }

        const success = addProject(trimmedName);

        if (success) {
            toast.success('Project Created', {
                description: `Project "${trimmedName}" has been created successfully.`,
            });
            setShowNewProject(false);
            setShowInitial(false);
            setError(null);
            setNewProjectName('');
        } else {
            const errorMessage = "A project with this name already exists";
            setError(errorMessage);
            toast.error('Project Creation Failed', {
                description: errorMessage,
            });
        }
    };

    const handleSelectProject = (project: Project) => {
        setCurrentProject(project);
        setShowProjects(false);
        setShowInitial(false);
        toast.success('Project Selected', {
            description: `Switched to project "${project.name}"`,
        });
    };

    const handleContinueLatest = () => {
        if (latestProject) {
            setCurrentProject(latestProject);
            setShowInitial(false);
            toast.success('Project Loaded', {
                description: `Continued with latest project "${latestProject.name}"`,
            });
        }
    };

    if (!showInitial && currentProject) {
        return <>{children}</>;
    }

    return (
        <>
            {/* Initial Dialog */}
            <AlertDialog open={showInitial} onOpenChange={setShowInitial}>
                <AlertDialogContent className="sm:max-w-[425px]">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl font-bold">
                            Welcome to Audit Project
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-base text-muted-foreground">
                            {latestProject ? (
                                "Would you like to continue with your latest project or start a new one?"
                            ) : (
                                "Please create a new project to get started."
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <div className="flex flex-col gap-3 my-6">
                        {latestProject && (
                            <Button
                                variant="outline"
                                className="w-full flex items-center justify-between"
                                onClick={handleContinueLatest}
                            >
                                <div className="flex items-center gap-2">
                                    <History className="w-4 h-4" />
                                    <span>Continue Latest Project</span>
                                </div>
                                <span className="text-xs text-muted-foreground">
                                    {format(new Date(latestProject.lastUpdatedAt), 'PP')}
                                </span>
                            </Button>
                        )}

                        <Button
                            className="w-full flex items-center justify-between"
                            onClick={() => {
                                setShowNewProject(true);
                                setShowInitial(false);
                            }}
                        >
                            <div className="flex items-center gap-2">
                                <Plus className="w-4 h-4" />
                                <span>Create New Project</span>
                            </div>
                            <ArrowRight className="w-4 h-4" />
                        </Button>

                        {projects.length > 0 && (
                            <Button
                                variant="secondary"
                                className="w-full flex items-center justify-between"
                                onClick={() => {
                                    setShowProjects(true);
                                    setShowInitial(false);
                                }}
                            >
                                <div className="flex items-center gap-2">
                                    <History className="w-4 h-4" />
                                    <span>View Existing Projects</span>
                                </div>
                                <span className="text-xs text-muted-foreground">
                                    {projects.length} projects
                                </span>
                            </Button>
                        )}
                    </div>
                </AlertDialogContent>
            </AlertDialog>

            {/* Project List Dialog */}
            <AlertDialog
                open={showProjects}
                onOpenChange={(open) => {
                    setShowProjects(open);
                    if (!open && !currentProject) setShowInitial(true);
                }}
            >
                <AlertDialogContent className="sm:max-w-[425px]">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl font-bold">
                            Select Project
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Choose from your existing projects
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <ScrollArea className="max-h-[300px] pr-4">
                        <div className="space-y-2">
                            {projects.map((project) => (
                                <button
                                    key={project.id}
                                    className={cn(
                                        "w-full p-3 rounded-lg text-left transition-colors",
                                        "bg-secondary/10 hover:bg-secondary/20",
                                        "focus:outline-none focus:ring-2 focus:ring-primary"
                                    )}
                                    onClick={() => handleSelectProject(project)}
                                >
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-medium">{project.name}</h3>
                                        <span className="text-xs text-muted-foreground">
                                            {format(new Date(project.lastUpdatedAt), 'PPp')}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </ScrollArea>

                    <AlertDialogFooter className="mt-4">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowProjects(false);
                                setShowInitial(true);
                            }}
                        >
                            Back
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* New Project Dialog */}
            <AlertDialog
                open={showNewProject}
                onOpenChange={(open) => {
                    setShowNewProject(open);
                    if (!open) {
                        setNewProjectName('');
                        setError(null);
                        if (!currentProject) setShowInitial(true);
                    }
                }}
            >
                <AlertDialogContent className="sm:max-w-[425px]">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl font-bold">
                            Create New Project
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Enter a unique name for your new project
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <div className="space-y-4 my-4">
                        <div className="space-y-2">
                            <Input
                                placeholder="Project name"
                                value={newProjectName}
                                onChange={(e) => {
                                    setNewProjectName(e.target.value);
                                    setError(null);
                                }}
                                className={cn(error && "border-destructive")}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleCreateProject();
                                }}
                            />
                            {error && (
                                <p className="text-sm text-destructive flex items-center gap-1">
                                    <X className="w-4 h-4" />
                                    {error}
                                </p>
                            )}
                        </div>
                    </div>

                    <AlertDialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowNewProject(false);
                                setShowInitial(true);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleCreateProject}>
                            Create Project
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}