import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateProject.css';

function CreateProject() {
    const [projectName, setProjectName] = useState('');
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [imageFile, setImageFile] = useState(null); // New state for the image file
    const [isSubmitted, setIsSubmitted] = useState(false); // State to track if the form has been submitted
    const [editMode, setEditMode] = useState(false); 
    const [tempProjectName, setTempProjectName] = useState('');
    const [zoomLevel, setZoomLevel] = useState(1); // Start at 100% zoom
    const imageInputRef = useRef(); // Ref for the file input
    const navigate = useNavigate();

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

    const handleNameChange = (e) => {
        setTempProjectName(e.target.value);
    };

    const handleNameSave = () => {
        setProjectName(tempProjectName); // Save the temporary name as the new project name
        setEditMode(false); // Exit edit mode
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            e.preventDefault(); // Prevent form submission
            handleNameSave(); // Save the name
        }
    };

    const handleZoomIn = () => {
        setZoomLevel(zoomLevel => zoomLevel * 1.1); // Increase zoom level by 10%
    };

    const handleZoomOut = () => {
        setZoomLevel(zoomLevel => zoomLevel * 0.9); // Decrease zoom level by 10%
    };

    const imageStyle = {
        transform: `scale(${zoomLevel})`,
        transformOrigin: 'top left',
    };

    const createButton = () => {
        // do something
    };

    const handleSaveProject = () => {
        // do something
    }
    const togglePanel = () => setIsPanelOpen(!isPanelOpen);

    const GoHome = () => {
        navigate('/'); 
    };

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
                    <div className="projectTitleContainer">
                        <button onClick={togglePanel} className="hamburgerButton">☰</button>
                        {isPanelOpen && (
                            <div className="navigationPanel">
                                <button onClick={GoHome}>Home Page</button>
                                <button onClick={handleSaveProject}>Save Project</button>
                            </div>
                        )}

                        {editMode ? (
                            <input
                                type="text"
                                className="projectNameInput"
                                value={tempProjectName}
                                onChange={handleNameChange}
                                onBlur={handleNameSave}
                                onKeyPress={handleKeyPress} // Prevent form submission on Enter key press
                                autoFocus
                            />
                        ) : (
                            <span className="projectNameText" onClick={() => setEditMode(true)}>
                                {projectName || "Click to Name Project"}
                            </span>
                        )}
                        
                        <button onClick={createButton} className="createInteractiveButtons">+</button>
                    </div>
                    <div className="imageContainer">
                        <img src={imageFile} alt="Project" className="projectImage" style={imageStyle} />
                    </div>
                    <div className="zoomControlContainer">
                        <button onClick={handleZoomIn} className="zoomInButton">Zoom +</button>
                        <button onClick={handleZoomOut} className="zoomOutButton">Zoom -</button>
                    </div>
                </div>
            )}
        </>
    );
}

export default CreateProject;