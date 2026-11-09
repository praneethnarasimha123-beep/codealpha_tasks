const API_URL = "http://localhost:8000/api";

const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

async function loadProfile() {

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    try {

        const response = await fetch(
            `${API_URL}/users/${user.id}`,
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            alert(data.message);
            return;
        }

        document.getElementById("profileUsername").textContent =
            data.username;

        document.getElementById("profileEmail").textContent =
            data.email;

        document.getElementById("profileBio").textContent =
            data.bio || "No bio added yet.";

        document.getElementById("followersCount").textContent =
            data.followers.length;

        document.getElementById("followingCount").textContent =
            data.following.length;

    } catch (error) {

        console.error("Profile error:", error);

    }
}

async function updateProfile() {

    const username =
        document.getElementById("editUsername").value.trim();

    const bio =
        document.getElementById("editBio").value.trim();

    if (!username) {
        alert("Username is required.");
        return;
    }

    try {

        const response = await fetch(
            `${API_URL}/users/profile`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },

                body: JSON.stringify({
                    username,
                    bio
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            alert(data.message);
            return;
        }

        localStorage.setItem(
            "user",
            JSON.stringify({
                id: data.user.id,
                username: data.user.username,
                email: data.user.email
            })
        );

        alert("Profile updated successfully!");

        loadProfile();

    } catch (error) {

        console.error(error);

        alert("Unable to update profile.");

    }
}

function logout() {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "login.html";
}

loadProfile();