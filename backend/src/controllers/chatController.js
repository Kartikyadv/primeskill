import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";

export const getconversations = async (req, res) => {
  try {
    const userid = req.user;
    const conversations = await Conversation.find({
      participants: userid,
    }).populate("participants", "name");
    res.status(200).json({ message: "got conversations", conversations });
  } catch (error) {
    console.error("Error in getting conversations: ", error);
    res.status(500).json({ message: "Error in getting conversations", error });
  }
};

export const getconversation = async (req, res) => {
  try {
    const conversationId = req.params.conversationId;
    const conversation = await Conversation.findById(conversationId).populate("participants", "name")
    res.status(200).json({ message: "got conversations", conversation });
  } catch (error) {
    console.error("Error in getting conversation: ", error);
    res.status(500).json({ message: "Error in getting conversation", error });
  }
};

export const createconversation = async (req, res) => {
  try {
    const { userId } = req.body;
    const currentUserId = req.user;

    let conversation = await Conversation.findOne({
      participants: { $all: [currentUserId, userId] },
    }).populate("participants", "name");
    if (conversation) {
      return res
        .status(201)
        .json({ message: "got conversation", conversation });
    }

    // If not, create a new conversation
    conversation = new Conversation({
      participants: [currentUserId, userId],
    });

    await conversation.save();

    // Populate participants for the response
    conversation = await conversation.populate("participants", "name");

    res.status(201).json({ message: "created conversation", conversation });
  } catch (error) {
    console.error("Error in creating conversations: ", error);
    res.status(500).json({ message: "Error in creating conversations", error });
  }
};

export const deleteConversation = async (req, res) => {
  try {
    const userid = req.user;
    const conversationId = req.params.conversationId;
    const conversation = await Conversation.findById(conversationId);
    // Delete all messages in the conversation
    await Message.deleteMany({ _id: { $in: conversation?.messages } });

    // Delete the conversation itself
    await Conversation.findByIdAndDelete(conversationId);

    res.status(200).json({ message: "got conversations", conversation });
  } catch (error) {
    console.error("Error in getting conversations: ", error);
    res.status(500).json({ message: "Error in getting conversations", error });
  }
};