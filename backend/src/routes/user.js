import express from 'express';
import { getuser} from '../controllers/userController.js';

const router = express.Router();

router.get('/getuserprofile/:userid', getuser);

export default router;
