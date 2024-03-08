export const logout = () => {
    localStorage.removeItem('token'); // Adjust according to your token storage method
    window.location.href = '/login'; // Redirect user to the login page
};
