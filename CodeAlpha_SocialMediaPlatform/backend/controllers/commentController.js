const Comment = require("../models/Comment");

const addComment = async (req, res) => {
    try {
        const { text } = req.body;

        if (!text || !text.trim()) {
            return res.status(400).json({
                message: "Comment cannot be empty."
            });
        }

        const comment = await Comment.create({
            post: req.params.postId,
            user: req.user._id,
            text
        });

        const populatedComment = await Comment.findById(
            comment._id
        ).populate(
            "user",
            "username profileImage"
        );

        res.status(201).json(populatedComment);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getComments = async (req, res) => {
    try {
        const comments = await Comment.find({
            post: req.params.postId
        })
            .populate("user", "username profileImage")
            .sort({ createdAt: 1 });

        res.json(comments);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(
            req.params.id
        );

        if (!comment) {
            return res.status(404).json({
                message: "Comment not found."
            });
        }

        if (
            comment.user.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                message: "You can only delete your own comment."
            });
        }

        await comment.deleteOne();

        res.json({
            message: "Comment deleted."
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    addComment,
    getComments,
    deleteComment
};