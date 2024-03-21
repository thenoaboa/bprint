import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loadProjectsFromLocal } from '../../services/projectService';
import './ProjectsPage.css';

function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Assuming loadProjectsFromLocal correctly loads your projects
    const loadedProjects = loadProjectsFromLocal();
    console.log("Loaded projects:", loadedProjects); // Add this line
    //const transformedProjects = loadedProjects.map(project => ({
      //name: project.projectName,
      // Include other project properties here as needed
    //}));
    setProjects(loadedProjects || []);
  }, []);

  const filteredProjects = projects.filter(project =>
    (project.name?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  const handleEditProject = (projectId) => {
    // Assuming you're correctly assigning and storing `id` for each project
    const projectToEdit = projects.find(project => project.id === projectId);
    console.log("Editing project with ID:", projectId);
    if (projectToEdit) {
      navigate('/create-project', { state: { project: projectToEdit, isEditMode: true } });
    } else {
      console.error("Project not found for ID:", projectId);
    }
  };
  
  const clearLocalStorage = () => {
    localStorage.clear();
    alert('Local storage cleared.');
    // If you're keeping track of projects in state, you might also want to reset that
    setProjects([]);
  };
  const togglePanel = () => setIsPanelOpen(!isPanelOpen);

  return (
    <div className="projectsContainer">
      <button className="hamburgerButton" onClick={togglePanel}>☰</button>
      {isPanelOpen && (
        <div className="navigationPanel">
          <Link to="/">HomePage</Link>
          <Link to="/create-project">Create Project</Link> 
        </div>
      )}
      <button onClick={clearLocalStorage}>Clear Local Storage (Delete this after testing is done)</button>
      <h1>Your Projects</h1>
      <input
        type="text"
        placeholder="Search projects..."
        className="searchBar"
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {filteredProjects.length ? (
        <div className="projectsList">
          {filteredProjects.map((project, index) => (
            <div key={index} className="projectItem">
              <span className="projectName">{project.projectName}</span>
              <button className="projectButton">View</button>
              <button onClick={() => handleEditProject(project.id)} className="projectButton">
                Edit
              </button>
              <button className="projectButton">Upload to Cloud</button>
            </div>
          ))}
        </div>
      ) : (
        <div className="noProjects">
          <p>No Projects Yet...</p>
          <Link to="/create-project">
            <button>Create Project</button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default ProjectsPage;