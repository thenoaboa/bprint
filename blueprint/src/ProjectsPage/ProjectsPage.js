import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ProjectsPage.css';

function ProjectsPage() {
  const [projects, setProjects] = useState([
    { name: "Project 1" },
    { name: "Project 2" },
    { name: "Project 3" },
    { name: "Project 4" },
    { name: "Project 5" },
    { name: "Project 6" },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isPanelOpen, setIsPanelOpen] = useState(false); // State for toggling the navigation panel
  

  useEffect(() => {
    // Function to fetch projects from your backend
    const fetchYourProjects = async () => {
      try {
        const response = await fetch('your-api-endpoint/projects');
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
        // Handle error appropriately
      }
    };
  
    fetchYourProjects();
  }, []);

  // Filter projects based on search term
  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              <button className="downloadButton">Download</button>
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