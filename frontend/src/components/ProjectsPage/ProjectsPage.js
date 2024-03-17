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
    
    // Transform loadedProjects to match the expected structure
    const transformedProjects = loadedProjects.map(project => ({
      name: project.projectName, // Assuming every project has a projectName property
      // Include other project properties here as needed
    }));

    setProjects(transformedProjects);
  }, []);

  const filteredProjects = projects.filter(project =>
    (project.name?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  const handleEditProject = (projectId) => {
    // Navigates to the CreateProject component with project ID for editing
    navigate('/create-project', { state: { projectId } });
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
              <span className="projectName">{project.name}</span>
              <button className="projectButton">View</button>
              <button 
                onClick={() => handleEditProject(project.id)} 
                className="projectButton"
              >
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