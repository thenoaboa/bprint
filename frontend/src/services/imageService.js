const uploadImage = async (file, folderName) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder_name', folderName);
  
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });
  
      if (response.ok) {
        const data = await response.json();
        return data.imageUrl;
      } else {
        throw new Error('Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error; // Rethrow the error to be handled by the caller
    }
  };
  
  export { uploadImage };