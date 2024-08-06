import express from "express";
import {
  createPost,
  getpost,
  likepost,
  editpost,
  deletepost,
  commentpost,
  getpostcomment,
  deleteComment,
  likeComment,
  getpostcommentreplies,
} from "../controllers/postController.js";
import { protectedRoute } from "../utils/controllers.js";
import multer from "multer";

const router = express.Router();


const upload = multer({ storage: multer.memoryStorage() });

router.post("/", protectedRoute, upload.single("image"), createPost);
router.get("/", protectedRoute, getpost);
router.put("/:postid", protectedRoute, editpost);
router.put("/:postid/like", protectedRoute, likepost);
router.delete("/:postid", protectedRoute, deletepost);


router.put("/:commentid/likecomment", protectedRoute, likeComment);
router.get("/:postid/comments", protectedRoute, getpostcomment);
router.post("/postcomment", protectedRoute, commentpost);
router.delete("/:postid/comment/:commentid", protectedRoute, deleteComment);


router.get("/:postid/comments/:commentid", protectedRoute, getpostcommentreplies);


export default router;
