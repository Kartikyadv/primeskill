import express from 'express';
import { createconversation, deleteConversation, getconversation, getconversations} from '../controllers/chatController.js';
import { protectedRoute } from '../utils/controllers.js';

const router = express.Router();

router.get('/conversations', protectedRoute, getconversations);
router.post('/conversation', protectedRoute, createconversation);
router.delete('/:conversationId', protectedRoute, deleteConversation);
router.get('/:conversationId', protectedRoute, getconversation);

export default router;
