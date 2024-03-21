import React, { useState, useRef, useEffect} from 'react';
import * as projectService from '../../services/projectService';
import { useNavigate, useLocation } from 'react-router-dom';
import ReactDOM from 'react-dom';
import { v4 as uuidv4 } from 'uuid';
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
    const [contextMenu, setContextMenu] = useState({ isVisible: false, rowId: null, position: { x: 0, y: 0 } });
    const imageInputRef = useRef(); // Ref for the file input
    const navigate = useNavigate();
    const location = useLocation();

    const saveProject = () => {
        const projectData = {
            id: uuidv4(),
            projectName,
            buttons,
            imageFile, //new code
            // Other data to save
        };
        projectService.saveProjectToLocal(projectData);
        alert('Project saved successfully!');
    };

    useEffect(() => {
        if (location.state?.isEditMode && location.state?.project) {
            const { project } = location.state;
            setImageFile(project.imageFile);
            setProjectName(project.projectName);
            setButtons(project.buttons || []);
            setIsSubmitted(true);
        } else {
            // Initialize for a new project
            setProjectName('');
            setButtons([]);
            setImageFile(null);
            setIsSubmitted(false);
        }
    }, [location.state]);


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
            name: `${buttons.length + 1}`, //since button is small, the number will be enough
            isLocked: false,
            rows: [], // Each row can now have its own set of data, including files
            buttonSize: 25,
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

    const increaseButtonSize = (buttonId) => {
        setButtons(buttons.map(button => {
            if (button.id === buttonId) {
                const newSize = isNaN(button.buttonSize) ? 25 : button.buttonSize + 5; // Default size 25 if NaN
                console.log({ ...button, buttonSize: newSize });
                return { ...button, buttonSize: newSize };
            }
            return button;
        }));
    };
    
    const decreaseButtonSize = (buttonId) => {
        setButtons(buttons.map(button => {
            if (button.id === buttonId) {
                const currentSize = isNaN(button.buttonSize) ? 25 : button.buttonSize; // Default size 25 if NaN
                const newSize = Math.max(currentSize - 5, 10); // Prevent size from becoming too small, with a minimum size
                return { ...button, buttonSize: newSize };
            }
            return button;
        }));
    };

    const addRowToButton = (buttonId) => {
        const newRows = buttons.map(button => {
            if (button.id === buttonId) {
                const newRow = {
                    id: button.rows.length,
                    name: '',
                    type: 'text', // Default type
                    description: '', // Used for text and URL types
                    fileName: '', // For rows of type 'photo', store the file name here
                    buttonSize: 25, //css script has it defualt as 25px
                };
                return { ...button, rows: [...button.rows, newRow] };
            }
            return button;
        });
        setButtons(newRows);
    };

    const updateRowData = (buttonId, rowId, newData) => {
        setButtons(buttons.map(button => {
            if (button.id === buttonId) {
                return { 
                    ...button, 
                    rows: button.rows.map(row => {
                        if (row.id === rowId) {
                            return { ...row, ...newData };
                        }
                        return row;
                    })
                };
            }
            return button;
        }));
    };

    const updateRowType = (buttonId, rowId, newType) => {
        setButtons(buttons.map(button => {
            if (button.id === buttonId) {
                return {
                    ...button,
                    rows: button.rows.map(row => {
                        if (row.id === rowId) {
                            return { ...row, type: newType, description: '', file: null }; // Reset description or file
                        }
                        return row;
                    }),
                };
            }
            return button;
        }));
    };

    const handleRowControllerClick = (e, rowId) => {
        e.preventDefault();
        e.stopPropagation();
        setContextMenu({
            isVisible: true,
            rowId: rowId,
            position: { x: e.pageX, y: e.pageY }
        });
    };

    const removeRow = (rowId) => {
        const updatedButtons = buttons.map(button => {
            if (button.id === editingButtonId) {
                return { ...button, rows: button.rows.filter(row => row.id !== rowId) };
            }
            return button;
        });
        setButtons(updatedButtons);
        setContextMenu({ isVisible: false, rowId: null, position: { x: 0, y: 0 } }); // Close the context menu
    };

    const handlePhotoChange = (buttonId, rowId, event) => {
        const file = event.target.files[0];
        if (file) {
            setButtons(buttons.map(button => {
                if (button.id === buttonId) {
                    return {
                        ...button,
                        rows: button.rows.map(row => {
                            if (row.id === rowId && row.type === 'photo') {
                                return { ...row, fileName: file.name };
                            }
                            return row;
                        }),
                    };
                }
                return button;
            }));
        }
    };
    
    const fileInputRef = useRef(null);   

    const deleteButton = (id) => {
        setButtons(buttons.filter(button => button.id !== id));
        setEditingButtonId(null); // Close the modal after deletion
    };
    
    const togglePanel = () => setIsPanelOpen(!isPanelOpen);

    const GoHome = () => {
        navigate('/'); 
    };

    const GoProjectsPage = () => {
        navigate('/projects'); 
    }

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
                                <button type="button" onClick={saveProject} className="saveProjectBtn">Save Project</button>
                                <button onClick={GoProjectsPage}>Projects Page</button>
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
                    {imageFile && <img src={imageFile} alt="Project" className="projectImage" style={imageStyle} />}
                        {buttons.map(button => (
                            <div 
                                key={button.id} 
                                style={{ 
                                    position: 'absolute', 
                                    left: button.x, 
                                    top: button.y
                                }}
                            >
                                {!button.isLocked && (
                                    <>
                                        <button className="removeButton" onClick={() => removeButton(button.id)}>X</button>
                                        <button className="lockButton" onClick={() => lockButton(button.id)}>✓</button>
                                    </>
                                )}
                                <div
                                    className={`buttonStyle ${button.isLocked ? 'locked' : ''}`}
                                    style={{ 
                                        width: `${button.buttonSize}px`, 
                                        height: `${button.buttonSize}px`
                                    }}
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
                                <button onClick={() => addRowToButton(editingButtonId)} className="addRow">Add Row</button>
                                <div className="row">
                                    <label>Name: </label>
                                    <input
                                        type="text"
                                        value={buttons.find((btn) => btn.id === editingButtonId)?.name || ''}
                                        onChange={(e) => updateButtonName(editingButtonId, e.target.value)}
                                    />
                                    <button className="deleteBtn" onClick={() => deleteButton(editingButtonId)}>Delete Button</button>
                                </div>

                                {buttons.find(btn => btn.id === editingButtonId)?.rows.map((row, index) => (
                                    <div className="row" key={index}>
                                        <button className="rowController" onClick={(e) => handleRowControllerClick(e, row.id)}>⋮</button>
                                        {contextMenu.isVisible && ReactDOM.createPortal(
                                            <div className="contextMenu" style={{ position: 'fixed', top: `${contextMenu.position.y}px`, left: `${contextMenu.position.x}px` }}>
                                                <button onClick={() => removeRow(contextMenu.rowId)}>Delete Row</button>
                                                {/* Other options */}
                                            </div>,
                                            document.body
                                        )}
                                        <input
                                            className='NameOfRowInput'
                                            placeholder="Label/Name"
                                            type="text"
                                            value={row.name}
                                            onChange={(e) => updateRowData(editingButtonId, row.id, { name: e.target.value })}
                                        />
                                        {
                                            row.type === 'text' || row.type === 'url' ? (
                                                <input
                                                    className='DescriptionOfRowInput'
                                                    placeholder={row.type === 'text' ? "Description" : "URL"}
                                                    type={row.type === 'url' ? 'url' : 'text'}
                                                    value={row.description}
                                                    onChange={(e) => updateRowData(editingButtonId, row.id, { description: e.target.value })}
                                                />
                                            ) : row.type === 'photo' && (
                                                <>
                                                    <button 
                                                        className="fileSelectButton" 
                                                        onClick={() => fileInputRef.current.click()}>
                                                        {row.fileName || 'Select File'}
                                                    </button>
                                                    <input
                                                        ref={fileInputRef}
                                                        type="file"
                                                        className="fileInputHidden"
                                                        onChange={(e) => handlePhotoChange(editingButtonId, row.id, e)}
                                                        style={{ display: 'none' }}
                                                    />
                                                </>
                                            )
                                        }
                                        <select
                                            value={row.type}
                                            onChange={(e) => updateRowType(editingButtonId, row.id, e.target.value)}
                                        >
                                            <option value="text">Text</option>
                                            <option value="url">URL</option>
                                            <option value="photo">Photo</option>
                                        </select>
                                    </div>
                                ))}
                                <button className="closeBtn" onClick={() => setEditingButtonId(null)}>Close</button>
                                <div className="row">
                                    <button onClick={() => increaseButtonSize(editingButtonId)}>Bigger</button>
                                    <button onClick={() => decreaseButtonSize(editingButtonId)}>Smaller</button>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="zoomControlContainer">
                        <button onClick={handleZoomIn} className="zoomInButton" disabled>Zoom +</button>
                        <button onClick={handleZoomOut} className="zoomOutButton" disabled>Zoom -</button>
                    </div>
                </div>
            )}
        </>
    );
}

export default CreateProject;