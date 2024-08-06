import express from "express"
import { sendMessage, fetchSingleMessage, getMessages, deleteMessage, markMessageSeen } from "../controllers/messageController.js";
import { protectedRoute } from "../utils/controllers.js";

const router = express.Router();

router.get("/:conversationId", protectedRoute, getMessages);
router.post("/:conversationId", protectedRoute, sendMessage);
router.get("/singlemessage/:messageId", protectedRoute, fetchSingleMessage);
router.delete("/:conversationId/:messageId/:otherParticipantid", protectedRoute, deleteMessage);
router.post("/:conversationId/:messageId/seen/:otherParticipantid", protectedRoute, markMessageSeen);

export default router;