import User from "../models/User.js";
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import fs from "fs";
import cloudinary from "../config/cloudinaryConfig.js";
import streamifier from "streamifier";

export const createPost = async (req, res) => {
  try {
    // Assuming req.user contains the authenticated user's ID
    const userId = req.user;
    const user = await User.findById(userId);
    const image = req.file;

    let upload_stream = cloudinary.uploader.upload_stream(
      async (error, result) => {
        if (error) {
          return res.status(500).send(error);
        }

        const post = await Post.create({
          text: req.body.content,
          imgurl: result.secure_url,
          user: user, // Assuming you want to associate the post with the user
        });

        await User.findByIdAndUpdate(
          userId,
          { $push: { posts: post._id } },
          { new: true, useFindAndModify: false }
        );

        res.status(201).json({ message: "Post created successfully", post });
      }
    );

    streamifier.createReadStream(req.file.buffer).pipe(upload_stream);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Error creating post", error });
  }
};

//--------------------------ADD POSTS---------------------------
// export const addPostController = async (req, res) => {
//   const caption = req.body.caption || null;
//   const location = req.body.location || null;
//   const image = req.files;
//   const userId = req.user._id;

//   if (image || caption) {
//     if (image) {
//       const imagesUrl = [];
//       for (const file of req.files) {
//         if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
//           try {
//             const storage = getStorage();

//             const metadata = {
//               contentType: file.mimetype,
//             };

//             const storageRef = ref(
//               storage,
//               `images/user/posts/${userId}-${Date.now()}`
//             );

//             const uploadTask = await uploadBytes(
//               storageRef,
//               file.buffer,
//               metadata
//             );
//             const imageUrl = await getDownloadURL(uploadTask.ref);

//             imagesUrl.push(imageUrl);
//           } catch (error) {
//             return res
//               .status(400)
//               .json(
//                 getResponseResolver(400, Messages.error_in_adding_post, {
//                   Error: error,
//                 })
//               );
//           }
//         } else {
//           return res
//             .status(400)
//             .json(
//               getResponseResolver(400, Messages.invalid_format_of_image, {
//                 Error: Messages.invalid_format_of_image,
//               })
//             );
//         }
//       }

//       await posts.create({
//         userId: userId,
//         imageUrl: imagesUrl,
//         location: location,
//         captionText: caption,
//       });
//       return res
//         .status(200)
//         .json(getResponseResolver(200, Messages.post_added));
//     } else {
//       try {
//         await posts.create({
//           userId: userId,
//           captionText: caption,
//           location: location,
//         });

//         return res
//           .status(200)
//           .json(getResponseResolver(200, Messages.post_added));
//       } catch (error) {
//         return res
//           .status(400)
//           .json(
//             getResponseResolver(400, Messages.error_in_adding_post, {
//               Error: error,
//             })
//           );
//       }
//     }
//   } else {
//     return res
//       .status(400)
//       .json(
//         getResponseResolver(400, Messages.add_images_or_caption, {
//           Error: Messages.add_images_or_caption,
//         })
//       );
//   }
// };

export const getpost = async (req, res) => {
  try {
    const posts = await Post.find().populate("user");
    res.status(200).json({ message: "got posts", posts: posts });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Error creating post", error });
  }
};

export const editpost = async (req, res) => {
  try {
    const userId = req.user;
    const postId = req.params.postid;
    const updatedText = req.body.text;

    const post = await Post.findById(postId).populate("user");

    if (post.user._id.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to edit this post" });
    }

    post.text = updatedText;
    await post.save();

    res.status(200).json({ message: "Post Edited", post: post });
  } catch (error) {
    console.error("Error editing post:", error);
    res.status(500).json({ message: "Error editing post", error });
  }
};

export const likepost = async (req, res) => {
  try {
    const userId = req.user;
    const postid = req.params.postid;

    const post = await Post.findById(postid).populate("user");
    if (post.likes.some((like) => like._id.toString() === userId)) {
      // User already liked the post, so unlike it
      post.likes = post.likes.filter((like) => like._id.toString() !== userId);
    } else {
      // Like the post
      post.likes.push({ _id: userId });
    }
    await post.save();
    res.status(200).json({ message: "Post Liked", post: post });
  } catch (error) {
    console.error("Error liking post:", error);
    res.status(500).json({ message: "Error editing post", error });
  }
};

export const deletepost = async (req, res) => {
  try {
    const userId = req.user;
    const postid = req.params.postid;
    const post = await Post.findById(postid);
    if (post.user == userId) {
      if (post?.imgurl) {
        fs.unlinkSync(`./src/uploads/${post?.imgurl}`);
      }
      await Post.findByIdAndDelete(postid);
      await Comment.deleteMany({
        post: postid,
      });
      const user = await User.findById(userId);
      user.posts = user.posts.filter((post) => post.toString() !== postid);
      user.save();
      res.status(200).json({ message: "post deleted", post: post });
    } else {
      res.status(400).json({ message: "Not Authorized" });
    }
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Error deleting post", error });
  }
};

export const commentpost = async (req, res) => {
  try {
    const { postid, comment, parentid } = req.body;
    const post = await Post.findById(postid);
    if (post == null) {
      return res.status(200).json({ message: "post not found" });
    }
    const postcomment = await Comment.create({
      content: comment,
      author: req.user,
      post: postid,
      parentCommentId: parentid,
    });
    if (parentid) {
      const parentComment = await Comment.findById(parentid);
      parentComment.replies.push(postcomment._id);
      parentComment.save();
    }
    const addedcomment = await Comment.findById(postcomment._id).populate(
      "author"
    );
    post.comments.push(postcomment._id);
    post.save();
    res.status(200).json({ message: "commented", comment: addedcomment });
  } catch (error) {
    console.error("Error in Commenting post:", error);
    res.status(500).json({ message: "Error in Commenting post", error });
  }
};

export const getpostcomment = async (req, res) => {
  try {
    const postid = req.params.postid;
    const post = await Post.findById(postid);
    if (post == null) {
      return res.status(200).json({ message: "post not found" });
    }
    console.log(post)
    const postcomments = await Comment.find({
      post: postid,
    }).populate("author");
    res
      .status(200)
      .json({ message: "got post comments", postcomments: postcomments });
  } catch (error) {
    console.error("Error in getting post comment:", error);
    res.status(500).json({ message: "Error in getting  post comment", error });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const userid = req.user;
    const commentId = req.params.commentid;
    const postid = req.params.postid;
    const comment = await Comment.findByIdAndDelete(commentId);
    if (comment?.parentCommentId) {
      const parent = await Comment.findById(comment.parentCommentId);
      if (parent) {
        const parentComment = await Comment.findById(comment.parentCommentId);
        parentComment.replies = parentComment.replies.filter(
          (id) => id.toString() !== comment._id.toString()
        );
        parentComment.save();
      }
    }
    const post = await Post.findById(postid).populate("user");
    post.comments = post.comments.filter(
      (comment) => comment.toString() !== commentId
    );
    post.save();
    res.status(200).json({ message: "comment deleted", updatedpost: post });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Error deleting post", error });
  }
};

export const likeComment = async (req, res) => {
  try {
    const userId = req.user;
    const commentid = req.params.commentid;

    const comment = await Comment.findById(commentid);
    if (comment.likes.some((like) => like._id.toString() === userId)) {
      // User already liked the post, so unlike it
      comment.likes = comment.likes.filter(
        (like) => like._id.toString() !== userId
      );
    } else {
      // Like the post
      comment.likes.push({ _id: userId });
    }
    await comment.save();
    res.status(200).json({ message: "Comment Liked", comment: comment });
  } catch (error) {
    console.error("Error liking Comment:", error);
    res.status(500).json({ message: "Error editing Comment", error });
  }
};

export const getpostcommentreplies = async (req, res) => {
  try {
    const postid = req.params.postid;
    const commentid = req.params.commentid;
    const post = await Post.findById(postid);
    if (post == null) {
      return res.status(200).json({ message: "post not found" });
    }
    const comment = await Comment.findById(commentid);
    if (comment == null) {
      return res.status(200).json({ message: "comment not found" });
    }
    const replies = await Comment.find({
      parentCommentId: commentid,
    }).populate("author");
    res.status(200).json({ message: "got comment replies", replies: replies });
  } catch (error) {
    console.error("Error in getting comment replies:", error);
    res
      .status(500)
      .json({ message: "Error in getting  comment replies", error });
  }
};
