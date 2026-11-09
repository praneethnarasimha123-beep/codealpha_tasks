const API_URL = "http://localhost:8000/api";

const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}


async function createPost() {

    const content =
        document
            .getElementById("postContent")
            .value
            .trim();

    if (!content) {
        alert("Write something first.");
        return;
    }

    try {

        const response = await fetch(
            `${API_URL}/posts`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },

                body: JSON.stringify({
                    content
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            alert(data.message);
            return;
        }

        document.getElementById(
            "postContent"
        ).value = "";

        loadPosts();

    } catch (error) {

        console.error(error);
        alert("Unable to create post.");

    }
}


async function loadPosts() {

    try {

        const response = await fetch(
            `${API_URL}/posts`,
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        const posts = await response.json();

        const container =
            document.getElementById(
                "postsContainer"
            );

        container.innerHTML = "";

        posts.forEach(post => {

            const user =
                JSON.parse(
                    localStorage.getItem("user")
                );

            const isOwner =
                user &&
                user.id === post.user._id;

            const liked =
                post.likes.includes(user.id);

            const postElement =
                document.createElement("div");

            postElement.className =
                "post-card";

            postElement.innerHTML = `

                <div class="post-header">

                    <div>

                        <h3>
                            ${escapeHTML(
                                post.user.username
                            )}
                        </h3>

                        <small>
                            ${new Date(
                                post.createdAt
                            ).toLocaleString()}
                        </small>

                    </div>

                </div>

                <p class="post-content">
                    ${escapeHTML(post.content)}
                </p>

                <div class="post-actions">

                    <button
                        onclick="likePost('${post._id}')"
                    >
                        ${liked ? "❤️" : "♡"}
                        ${post.likes.length}
                    </button>

                    ${
                        isOwner
                            ? `
                            <button
                                onclick="deletePost('${post._id}')"
                            >
                                🗑 Delete
                            </button>
                            `
                            : ""
                    }

                </div>

                <div class="comment-section">

                    <div
                        id="comments-${post._id}"
                    ></div>

                    <div class="comment-input">

                        <input
                            id="comment-${post._id}"
                            type="text"
                            placeholder="Write a comment..."
                        >

                        <button
                            onclick="addComment('${post._id}')"
                        >
                            Comment
                        </button>

                    </div>

                </div>
            `;

            container.appendChild(postElement);

            loadComments(post._id);

        });

    } catch (error) {

        console.error(error);

    }
}


async function likePost(postId) {

    try {

        const response = await fetch(
            `${API_URL}/posts/${postId}/like`,
            {
                method: "POST",

                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        if (response.ok) {
            loadPosts();
        }

    } catch (error) {

        console.error(error);

    }
}


async function deletePost(postId) {

    if (!confirm("Delete this post?")) {
        return;
    }

    try {

        const response = await fetch(
            `${API_URL}/posts/${postId}`,
            {
                method: "DELETE",

                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        if (response.ok) {
            loadPosts();
        }

    } catch (error) {

        console.error(error);

    }
}


async function addComment(postId) {

    const input =
        document.getElementById(
            `comment-${postId}`
        );

    const text = input.value.trim();

    if (!text) {
        return;
    }

    try {

        const response = await fetch(
            `${API_URL}/comments/${postId}`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },

                body: JSON.stringify({
                    text
                })
            }
        );

        if (response.ok) {

            input.value = "";

            loadComments(postId);

        }

    } catch (error) {

        console.error(error);

    }
}


async function loadComments(postId) {

    try {

        const response = await fetch(
            `${API_URL}/comments/${postId}`,
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        const comments =
            await response.json();

        const container =
            document.getElementById(
                `comments-${postId}`
            );

        container.innerHTML = "";

        comments.forEach(comment => {

            const commentElement =
                document.createElement("div");

            commentElement.className =
                "comment";

            commentElement.innerHTML = `

                <strong>
                    ${escapeHTML(
                        comment.user.username
                    )}
                </strong>

                <span>
                    ${escapeHTML(comment.text)}
                </span>

            `;

            container.appendChild(
                commentElement
            );

        });

    } catch (error) {

        console.error(error);

    }
}


function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


loadPosts();