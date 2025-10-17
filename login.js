// // Function to display messages to the user (success/error)
// function showMessage(message, type = 'info') {
//     const messageBox = document.getElementById('message-box');
//     messageBox.textContent = message;
//     messageBox.classList.remove('hidden', 'bg-red-100', 'text-red-700', 'bg-green-100', 'text-green-700', 'bg-blue-100', 'text-blue-700');
//     messageBox.classList.add('block'); // Ensure it's visible

//     if (type === 'error') {
//         messageBox.classList.add('bg-red-100', 'text-red-700');
//     } else if (type === 'success') {
//         messageBox.classList.add('bg-green-100', 'text-green-700');
//     } else { // info or default
//         messageBox.classList.add('bg-blue-100', 'text-blue-700');
//     }

//     // Hide the message after 5 seconds
//     setTimeout(() => {
//         messageBox.classList.add('hidden');
//     }, 5000);
// }

// // Function to handle user login
// async function login() {
//     const email = document.getElementById('txt_username').value;
//     const password = document.getElementById('txt_password').value;
//     const rememberMe = document.getElementById('txt_remember').checked;

//     // Basic validation
//     if (!email || !password) {
//         showMessage('Please enter both email and password.', 'error');
//         return;
//     }

//     try {
//         const response = await fetch('http://localhost:5000/api/users/login', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({ email, password })
//         });

//         const data = await response.json();

//         if (response.ok && data.status === 'Login successfully') {
//             showMessage('Login successful! Redirecting...', 'success');

//             // Store user information in localStorage if login is successful
//             // You might want to store more than just email, like a user ID or a token
//             if (rememberMe) {
//                 localStorage.setItem('loggedInUserEmail', email);
//                 localStorage.setItem('isLoggedIn', 'true'); // Indicate that a user is logged in
//             } else {
//                 sessionStorage.setItem('loggedInUserEmail', email);
//                 sessionStorage.setItem('isLoggedIn', 'true');
//             }

//             // Redirect to index.html after a short delay
//             setTimeout(() => {
//                 window.location.href = 'index.html';
//             }, 1000);

//         } else {
//             // Display error message from the backend
//             showMessage(data.status || 'Login failed. Please try again.', 'error');
//         }
//     } catch (error) {
//         console.error('Error during login:', error);
//         showMessage('An error occurred during login. Please try again later.', 'error');
//     }
// }