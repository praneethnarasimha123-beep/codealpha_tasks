// // const API_URL = "http://localhost:8000/api";

// // async function signup() {

// //     const username =
// //         document.getElementById("username").value.trim();

// //     const email =
// //         document.getElementById("email").value.trim();

// //     const password =
// //         document.getElementById("password").value;

// //     if (!username || !email || !password) {
// //         alert("Please fill all fields.");
// //         return;
// //     }

// //     try {

// //         const response = await fetch(
// //             `${API_URL}/auth/register`,
// //             {
// //                 method: "POST",

// //                 headers: {
// //                     "Content-Type": "application/json"
// //                 },

// //                 body: JSON.stringify({
// //                     username,
// //                     email,
// //                     password
// //                 })
// //             }
// //         );

// //         const data = await response.json();

// //         if (!response.ok) {
// //             alert(data.message);
// //             return;
// //         }

// //         localStorage.setItem(
// //             "token",
// //             data.token
// //         );

// //         localStorage.setItem(
// //             "user",
// //             JSON.stringify(data.user)
// //         );

// //         alert("Account created successfully!");

// //         window.location.href = "index.html";

// //     } catch (error) {

// //         alert("Server error.");

// //         console.error(error);
// //     }
// // }


// // async function login() {

// //     const email =
// //         document.getElementById("email").value.trim();

// //     const password =
// //         document.getElementById("password").value;

// //     if (!email || !password) {
// //         alert("Please enter email and password.");
// //         return;
// //     }

// //     try {

// //         const response = await fetch(
// //             `${API_URL}/auth/login`,
// //             {
// //                 method: "POST",

// //                 headers: {
// //                     "Content-Type": "application/json"
// //                 },

// //                 body: JSON.stringify({
// //                     email,
// //                     password
// //                 })
// //             }
// //         );

// //         const data = await response.json();

// //         if (!response.ok) {
// //             alert(data.message);
// //             return;
// //         }

// //         localStorage.setItem(
// //             "token",
// //             data.token
// //         );

// //         localStorage.setItem(
// //             "user",
// //             JSON.stringify(data.user)
// //         );

// //         window.location.href = "index.html";

// //     } catch (error) {

// //         alert("Server error.");

// //         console.error(error);
// //     }
// // }


// // function logout() {

// //     localStorage.removeItem("token");
// //     localStorage.removeItem("user");

// //     window.location.href = "login.html";
// // }
// async function signup() {

//     const username =
//         document.getElementById("username").value.trim();

//     const email =
//         document.getElementById("email").value.trim();

//     const password =
//         document.getElementById("password").value;

//     if (!username || !email || !password) {
//         alert("Please fill all fields.");
//         return;
//     }

//     try {

//         const response = await fetch(
//             `${API_URL}/auth/register`,
//             {
//                 method: "POST",

//                 headers: {
//                     "Content-Type": "application/json"
//                 },

//                 body: JSON.stringify({
//                     username,
//                     email,
//                     password
//                 })
//             }
//         );

//         const data = await response.json();

//         if (!response.ok) {
//             alert(data.message);
//             return;
//         }

//         // Signup ke baad token save nahi karna
//         localStorage.removeItem("token");
//         localStorage.removeItem("user");

//         alert("Account created successfully! Please login.");

//         // Signup → Login
//         window.location.href = "login.html";

//     } catch (error) {

//         console.error(error);

//         alert("Server error. Please try again.");

//     }
// }
const API_URL = "http://localhost:8000/api";

async function signup() {
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!username || !email || !password) {
        alert("Please fill all fields.");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                email,
                password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "Registration failed.");
            return;
        }

        // Signup ke baad direct login par jana hai
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        alert("Account created successfully! Please login.");

        window.location.href = "login.html";

    } catch (error) {
        console.error("Signup Error:", error);
        alert("Cannot connect to server. Make sure backend is running.");
    }
}


async function login() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {
        alert("Please enter email and password.");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "Login failed.");
            return;
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        window.location.href = "index.html";

    } catch (error) {
        console.error("Login Error:", error);
        alert("Cannot connect to server. Make sure backend is running.");
    }
}


function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "login.html";
}