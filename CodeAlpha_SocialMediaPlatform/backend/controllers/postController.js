const Post = require("../models/Post");
const Comment = require("../models/Comment");

const createPost = async (req, res) => {
    try {
        const { content } = req.body;

        if (!content || !content.trim()) {
            return res.status(400).json({
                message: "Post content is required."
            });
        }

        const post = await Post.create({
            user: req.user._id,
            content
        });

        const populatedPost = await Post.findById(post._id)
            .populate("user", "username profileImage");

        res.status(201).json(populatedPost);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate("user", "username profileImage")
            .sort({ createdAt: -1 });

        res.json(posts);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                message: "Post not found."
            });
        }

        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "You can only delete your own posts."
            });
        }

        await Comment.deleteMany({
            post: post._id
        });

        await post.deleteOne();

        res.json({
            message: "Post deleted successfully."
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const toggleLike = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                message: "Post not found."
            });
        }

        const userId = req.user._id;

        const alreadyLiked = post.likes.some(
            id => id.toString() === userId.toString()
        );

        if (alreadyLiked) {
            post.likes = post.likes.filter(
                id => id.toString() !== userId.toString()
            );
        } else {
            post.likes.push(userId);
        }

        await post.save();

        res.json({
            liked: !alreadyLiked,
            likes: post.likes.length
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    createPost,
    getPosts,
    deletePost,
    toggleLike
};