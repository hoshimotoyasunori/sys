import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Check, LayoutDashboard, ExternalLink } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string;
}

interface ProjectSwitchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  currentProject: Project | null;
  onProjectSelect: (project: Project) => void;
}

export function ProjectSwitchDialog({
  isOpen,
  onClose,
  projects,
  currentProject,
  onProjectSelect
}: ProjectSwitchDialogProps) {
  const handleProjectSelect = (project: Project) => {
    onProjectSelect(project);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <LayoutDashboard className="h-5 w-5" />
            プロジェクトを切り替え
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {projects.length === 0 ? (
            <div className="text-center py-12">
              <LayoutDashboard className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-sm">プロジェクトがありません</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {projects.map((project) => {
                const isCurrent = currentProject?.id === project.id;
                return (
                  <div
                    key={project.id}
                    className={`
                      relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                      ${isCurrent 
                        ? 'border-blue-500 bg-blue-50 shadow-sm' 
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                      }
                    `}
                    onClick={() => handleProjectSelect(project)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`font-semibold truncate ${
                            isCurrent ? 'text-blue-700' : 'text-gray-900'
                          }`}>
                            {project.name}
                          </h3>
                          {isCurrent && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              現在
                            </span>
                          )}
                        </div>
                        {project.description && (
                          <p className={`text-sm truncate ${
                            isCurrent ? 'text-blue-600' : 'text-gray-500'
                          }`}>
                            {project.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 ml-3">
                        {isCurrent ? (
                          <Check className="h-5 w-5 text-blue-600 flex-shrink-0" />
                        ) : (
                          <ExternalLink className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 