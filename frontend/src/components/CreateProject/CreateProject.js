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
    const [buttons, setButtons] = useState([]);
    const [editingButtonId, setEditingButtonId] = useState(null); // Tracks which button is being edited
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
        const newButton = {
            id: buttons.length,
            x: 100,
            y: 100,
            name: `${buttons.length + 1}`,
            isLocked: false, // New property to track if the button is locked
        };
        setButtons([...buttons, newButton]);
    };

    const onDragStart = (e, id) => {
        const rect = e.target.getBoundingClientRect();
        const offsetX = e.clientX - rect.left; // X position within the element
        const offsetY = e.clientY - rect.top;  // Y position within the element
        e.dataTransfer.setData("offsetX", offsetX);
        e.dataTransfer.setData("offsetY", offsetY);
        e.dataTransfer.setData("buttonId", id);
    };

    const onDrop = (e) => {
        const offsetX = e.dataTransfer.getData("offsetX");
        const offsetY = e.dataTransfer.getData("offsetY");
        const buttonId = e.dataTransfer.getData("buttonId");
      
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left - offsetX;
        const y = e.clientY - rect.top - offsetY;
      
        setButtons(buttons.map(button => {
            if (button.id.toString() === buttonId) {
                return { ...button, x, y };
            }
            return button;
        }));
    };

    const onDragOver = (e) => {
        e.preventDefault(); // Necessary for onDrop to trigger
    };

    const lockButton = (id) => {
        setButtons(buttons.map(button => {
            if (button.id === id) {
                return { ...button, isLocked: true };
            }
            return button;
        }));
    };
    
    const removeButton = (id) => {
        setButtons(buttons.filter(button => button.id !== id));
    };

    const handleButtonClick = (id) => {
        const button = buttons.find(button => button.id === id);
        if (button && button.isLocked) {
            // If the button is locked, set it to be edited
            setEditingButtonId(id);
            // Here, you can show a modal or an editable input for the button's content
        }
    };

    const updateButtonName = (id, newName) => {
        setButtons(
            buttons.map((btn) => {
                if (btn.id === id) {
                    return { ...btn, name: newName };
                }
                return btn;
            })
        );
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
                    <div className="imageContainer" onDrop={onDrop} onDragOver={onDragOver}>
                        <img src={imageFile} alt="Project" className="projectImage" style={imageStyle} />
                        {buttons.map(button => (
                            <div key={button.id} style={{ position: 'absolute', left: button.x, top: button.y }}>
                                {!button.isLocked && (
                                    <>
                                        <button className="removeButton" onClick={() => removeButton(button.id)}>X</button>
                                        <button className="lockButton" onClick={() => lockButton(button.id)}>✓</button>
                                    </>
                                )}
                                <div
                                    className={`buttonStyle ${button.isLocked ? 'locked' : ''}`}
                                    draggable={!button.isLocked}
                                    onDragStart={(e) => onDragStart(e, button.id)}
                                    onClick={() => handleButtonClick(button.id)} // Handle click event
                                >
                                    {button.name}
                                </div>
                            </div>
                        ))}
                        {editingButtonId !== null && (
                            <div className="modal">
                                <button  className="addRow">Add Row</button>
                                <div className="row">
                                    <label>Name: </label>
                                    <input
                                        type="text"
                                        value={buttons.find((btn) => btn.id === editingButtonId)?.name || ''}
                                        onChange={(e) => updateButtonName(editingButtonId, e.target.value)}
                                    />
                                </div>
                                <div className="row">
                                    <button className="rowController">⋮</button>
                                    <input className="rowName"/>   
                                    <select name="rowType" id="rowType">
                                        <option value="text">Text</option>
                                        <option value="url">URL</option>
                                        <option value="photo">Photo</option>
                                    </select>
                                </div>
                                <button  className="closeBtn" onClick={() => setEditingButtonId(null)}>Close</button>
                                <button  className="DeleteBtn" >Delete</button>
                            </div>
                        )}
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