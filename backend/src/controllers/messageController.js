import { getRecipientSocketId } from "../config/socket.js";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import { io } from "../server.js";

export const getMessages = async (req, res) => {
  try {
    const conversationId = req.params.conversationId;
    const conversation = await Conversation.findById(conversationId).populate(
      "messages"
    );
    res
      .status(200)
      .json({ message: "Message fetched", messages: conversation.messages });
  } catch (error) {
    console.log(`Error in fetching Messages: `, error);
    return res
      .status(404)
      .json({ message: "Error in fetching Messages:", error });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const senderid = req.user;
    const content = req.body.content;
    const conversationId = req.params.conversationId;
    const conversation = await Conversation.findById(conversationId);
    const recipient = conversation.participants.filter(
      (participant) => participant != senderid
    );
    const message = await Message.create({
      sender: senderid,
      recipient: recipient,
      content: content,
    });
    const updatedConversation = await Conversation.findByIdAndUpdate(
      conversationId,
      {
        $push: { messages: message._id },
        $set: { lastMessageId: message._id },
      },
      { new: true }
    ).populate("participants", "name");
    res.status(200).json({ message, updatedConversation });
    const recipientSocketId = getRecipientSocketId(recipient[0].toString());
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("message", {
        message,
        conversationId,
      });
    }

  } catch (error) {
    console.log(`Error in creating Messages: `, error);
    return res
      .status(404)
      .json({ message: "Error in creating Messages:", error });
  }
};

export const fetchSingleMessage = async (req, res) => {
  try {
    const messageid = req.params.messageId;
    const message = await Message.findById(messageid);
    res.status(200).json({ message: "Message fetched", message });
  } catch (error) {
    console.log(`Error in fetching single Messages: `, error);
    return res
      .status(404)
      .json({ message: "Error in fetching single Messages:", error });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { messageId,conversationId,otherParticipantid} = req.params;
    const message = await Message.findByIdAndDelete(messageId);
    const conversation = await Conversation.findById(conversationId);
    conversation.messages = await conversation.messages.filter((messageid)=>messageId.toString() !== messageid.toString())
    conversation.lastMessageId = await conversation.messages[conversation.messages.length - 1];
    await conversation.save();
    const recipientSocketId = getRecipientSocketId(otherParticipantid.toString());
    console.log(recipientSocketId)
    res.status(200).json({
      message: "Message deleted",
      updatedConversation: conversation,
      message: message
    })
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("deletemessage", {
        message,
        conversation,
      });
    }

  } catch (error) {
    console.log("Error in deleting message :", error);
    res.status(404).json({ message: "Error in deleting message :", error });
  }
};

export const markMessageSeen = async (req,res) => {
  try {
    const {messageId,otherParticipantid,conversationId} = req.params;
    const message = await Message.findByIdAndUpdate(messageId,{
      seen: true,
    },{
      new: true,
    });
    const recipientSocketId = getRecipientSocketId(otherParticipantid.toString());
    res.status(200).json({
      message: "Message Seen",
      updatedMessage: message
    })
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("seenmessage", {
        message,
        conversationId
      });
    }

  } catch (error) {
    console.log("Error in message seen controller: ", error)
    res.status(400).json({message: "Error in message seen controller",error})
  }
}