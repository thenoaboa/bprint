export const saveProjectToLocal = (projectData) => {
    const existingProjects = loadProjectsFromLocal() || [];
    existingProjects.push(projectData);
    localStorage.setItem('projects', JSON.stringify(existingProjects));
};
  
export const loadProjectsFromLocal = () => {
    const projectsJson = localStorage.getItem('projects');
    return projectsJson ? JSON.parse(projectsJson) : [];
};
