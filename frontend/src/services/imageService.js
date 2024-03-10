const uploadImage = async (file, folderName, userId) => {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('folderName', folderName);
  formData.append('userId', userId);
  
  const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/image/upload`, {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    throw new Error('Failed to upload image');
  }
  
  const data = await response.json();
  return data.imageUrl;
};
  
export { uploadImage };