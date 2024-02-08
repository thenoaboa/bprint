import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateProject.css';

function CreateProject() {
    const [projectName, setProjectName] = useState('');
    const [imageFile, setImageFile] = useState(null); // New state for the image file
    const [isSubmitted, setIsSubmitted] = useState(false); // State to track if the form has been submitted
    const imageInputRef = useRef(); // Ref for the file input
    const navigate = useNavigate();
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [editMode, setEditMode] = useState(false); // New state for toggling edit mode
    const [tempProjectName, setTempProjectName] = useState('');

    useEffect(() => {
        setTempProjectName(projectName); // Initialize temporary project name with the current project name
    }, [projectName]);

    const handleEditClick = () => {
        setEditMode(true); // Enable edit mode
    };

    const handleNameChange = (e) => {
        setTempProjectName(e.target.value); // Update temporary project name as user types
    };

    const handleNameSave = () => {
        setProjectName(tempProjectName); // Save the temporary name as the new project name
        setEditMode(false); // Exit edit mode
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        const file = imageInputRef.current.files[0];
        if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            setImageFile(e.target.result); 
        };
        reader.readAsDataURL(file);
        }
        setIsSubmitted(true);
    };

    const GoHome = () => {
        navigate('/'); 
    };

    const handleSaveProject = () => {
        // do something
    }

    const togglePanel = () => setIsPanelOpen(!isPanelOpen);

    return (
        <>
        {!isSubmitted ? (
            <div className="createProjectContainer">
            <h1>Create New Project</h1>
            <form onSubmit={handleSubmit} className="projectForm">
                <div className="formGroup">
                <label htmlFor="projectName">Project Name:</label>
                <input
                    type="text"
                    id="projectName"
                    name="projectName"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    required
                />
                </div>
                <div className="formGroup imageUploadContainer">
                <label htmlFor="projectImage">Project Image:</label>
                <input
                    type="file"
                    id="projectImage"
                    name="projectImage"
                    ref={imageInputRef}
                    required
                    accept="image/*"
                />
                </div>
                <button type="submit" className="submitBtn">Start</button>
                <button type="button" className="cancelBtn" onClick={GoHome}>Cancel</button>
            </form>
            </div>
        ) : (
            <div className="projectDisplay">
                <button onClick={togglePanel} className="hamburgerButton">☰</button>
                {isPanelOpen && (
                    <div className="navigationPanel">
                        <button onClick={GoHome}>Home Page</button>
                        <button onClick={handleSaveProject}>Save Project</button>
                    </div>
                )}
                {editMode ? (
                    <>
                        <input
                            type="text"
                            value={tempProjectName}
                            onChange={handleNameChange}
                            className="editProjectNameInput"
                        /> {/*this is not centered, its to the left */}
                        <button onClick={handleNameSave} className="saveButton">✓</button> {/*horizontally its centered but not vertically, its lower than i would like*/}
                    </>
                ) : (
                    <>
                        <h2>{projectName}</h2> {/*This is not in the middle, its at the very left*/}
                        <button onClick={handleEditClick} className="editButton"></button>{/*image isnt showing*/}
                    </>
                )}
                {imageFile && <img src={imageFile} alt="Project" className="projectImage"/>}
            </div>
        )}
        </>
    );
}

export default CreateProject;