const User = require("../models/User");

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(
            req.params.id
        )
            .select("-password")
            .populate(
                "followers",
                "username profileImage"
            )
            .populate(
                "following",
                "username profileImage"
            );

        if (!user) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        res.json(user);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const updateProfile = async (req, res) => {
    try {
        const {
            username,
            bio,
            profileImage
        } = req.body;

        const user = await User.findById(
            req.user._id
        );

        if (username) user.username = username;
        if (bio !== undefined) user.bio = bio;
        if (profileImage !== undefined) {
            user.profileImage = profileImage;
        }

        await user.save();

        res.json({
            message: "Profile updated.",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                bio: user.bio,
                profileImage: user.profileImage
            }
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const toggleFollow = async (req, res) => {
    try {
        const targetUser = await User.findById(
            req.params.id
        );

        if (!targetUser) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        if (
            targetUser._id.toString() ===
            req.user._id.toString()
        ) {
            return res.status(400).json({
                message: "You cannot follow yourself."
            });
        }

        const currentUser = await User.findById(
            req.user._id
        );

        const isFollowing =
            currentUser.following.some(
                id =>
                    id.toString() ===
                    targetUser._id.toString()
            );

        if (isFollowing) {
            currentUser.following =
                currentUser.following.filter(
                    id =>
                        id.toString() !==
                        targetUser._id.toString()
                );

            targetUser.followers =
                targetUser.followers.filter(
                    id =>
                        id.toString() !==
                        currentUser._id.toString()
                );
        } else {
            currentUser.following.push(
                targetUser._id
            );

            targetUser.followers.push(
                currentUser._id
            );
        }

        await currentUser.save();
        await targetUser.save();

        res.json({
            following: !isFollowing,
            followers: targetUser.followers.length
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    getProfile,
    updateProfile,
    toggleFollow
};