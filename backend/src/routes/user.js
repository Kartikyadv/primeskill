import express from 'express';
import { getuser, searchuser} from '../controllers/userController.js';
import {protectedRoute} from "../utils/controllers.js"

const router = express.Router();

router.get('/getuserprofile/:userid', protectedRoute, getuser);
router.get('/search', protectedRoute, searchuser);

export default router;
