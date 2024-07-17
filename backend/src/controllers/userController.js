import User from "../models/User.js";

export const getuser = async (req, res) => {
  try {
    const userid = req.params.userid;
    const user = await User.findById(userid).populate('posts');
    res.status(200).json({ message: "Got User Profile", user: user });
  } catch (error) {
    console.error("Error in getting user: ", error);
    res.status(500).json({ message: "Error in getting user", error });
  }
};
