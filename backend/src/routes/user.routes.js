import { Router } from "express";
import { registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    
 } from "../controllers/user.controller.js";
import requireAuth from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/register").post(registerUser)
router.route("/").get(test);
router.route("/login").post(loginUser)    

router.route("/logout").post(requireAuth, logoutUser)

router.route("/refresh-token").post(refreshAccessToken)
export default router;