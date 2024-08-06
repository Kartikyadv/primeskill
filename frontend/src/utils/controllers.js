export const getOtherUserName = (currentuserid, participants) => {
  const otherParticipant = participants.find(
    (participant) => participant._id !== currentuserid
  );
  return otherParticipant;
};
