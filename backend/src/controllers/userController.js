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

export const searchuser = async (req, res) => {
  const searchQuery = req.query.query;
  const currentUserId = req.user; // Assuming you have the user's ID stored here

  if (!searchQuery) {
    return res.status(400).json({ error: 'Search query is required' });
  }

  try {
    const users = await User.find({
      name: { $regex: searchQuery, $options: 'i' },
      _id: { $ne: currentUserId } // Exclude the current user
    }).select('name _id');

    res.status(200).json(users);
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

