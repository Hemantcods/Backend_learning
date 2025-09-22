import { Router } from "express";
import { changePassword, getCurrentUser, getUserChannelProfile, getUserWatchHisstory, loginUser, logoutUser, refreshAccessToken, registerUser, updateUserAvatar, updateUserCoverImage, updateUserDetails } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router=Router();
router.route("/register").post(
    upload.fields([
        {name:'avatar',maxCount:1},
        {name:'cover',maxCount:1}
    ]),
    registerUser
)
router.route("/login").post(
    loginUser    
)
router.route("/getUserChannelProfile").post(
    getUserChannelProfile
)
// secured routes
router.route("/logout").post(
    verifyJWT,
    logoutUser
)
router.route("/refreshaccesstoken").post(
    refreshAccessToken
)
router.route("/changepassword").post(
    verifyJWT,
    changePassword
)

router.route("/getCurrentUser").post(
    verifyJWT,
    getCurrentUser
)
router.route("/updateUserDetails").post(
    verifyJWT,
    updateUserDetails
)
router.route("/updateUserAvatar").post(
    verifyJWT,
    upload.single("avatar"),
    updateUserAvatar
)
router.route("/updateUserCoverImage").post(
    verifyJWT,
    upload.single("cover"),
    updateUserCoverImage
)

router.route("/watchhistory").post(
    verifyJWT,
    getUserWatchHisstory
)


export default router