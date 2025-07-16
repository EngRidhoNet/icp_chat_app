export const idlFactory = ({ IDL }) => {
  const UserId = IDL.Text;
  const GroupId = IDL.Text;
  const Group = IDL.Record({
    'id' : GroupId,
    'members' : IDL.Vec(UserId),
    'name' : IDL.Text,
    'createdAt' : IDL.Int,
    'createdBy' : UserId,
    'description' : IDL.Opt(IDL.Text),
  });
  const GroupResult = IDL.Variant({ 'ok' : Group, 'err' : IDL.Text });
  const Email = IDL.Text;
  const OTPCode = IDL.Text;
  const OTPResult = IDL.Variant({ 'ok' : OTPCode, 'err' : IDL.Text });
  const User = IDL.Record({
    'id' : UserId,
    'name' : IDL.Text,
    'createdAt' : IDL.Int,
    'isOnline' : IDL.Bool,
    'email' : Email,
    'lastSeen' : IDL.Int,
    'avatar' : IDL.Opt(IDL.Text),
  });
  const MessageId = IDL.Nat;
  const MessageType = IDL.Variant({
    'file' : IDL.Null,
    'text' : IDL.Null,
    'document' : IDL.Null,
    'image' : IDL.Null,
  });
  const Message = IDL.Record({
    'id' : MessageId,
    'content' : IDL.Text,
    'isRead' : IDL.Bool,
    'messageType' : MessageType,
    'groupId' : IDL.Opt(GroupId),
    'receiverId' : IDL.Opt(UserId),
    'timestamp' : IDL.Int,
    'senderId' : UserId,
  });
  const AuthResult = IDL.Variant({ 'ok' : User, 'err' : IDL.Text });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  const MessageResult = IDL.Variant({ 'ok' : MessageId, 'err' : IDL.Text });
  return IDL.Service({
    'createGroup' : IDL.Func(
        [IDL.Text, IDL.Opt(IDL.Text), UserId, IDL.Vec(UserId)],
        [GroupResult],
        [],
      ),
    'generateOTP' : IDL.Func([Email], [OTPResult], []),
    'getAllUsers' : IDL.Func([], [IDL.Vec(User)], ['query']),
    'getDirectMessages' : IDL.Func(
        [UserId, UserId],
        [IDL.Vec(Message)],
        ['query'],
      ),
    'getGroupMessages' : IDL.Func([GroupId], [IDL.Vec(Message)], ['query']),
    'getUser' : IDL.Func([UserId], [IDL.Opt(User)], ['query']),
    'getUserGroups' : IDL.Func([UserId], [IDL.Vec(Group)], ['query']),
    'health' : IDL.Func(
        [],
        [IDL.Record({ 'status' : IDL.Text, 'timestamp' : IDL.Int })],
        ['query'],
      ),
    'loginUser' : IDL.Func([Email], [AuthResult], []),
    'logoutUser' : IDL.Func([UserId], [Result], []),
    'registerUser' : IDL.Func([Email, IDL.Text, OTPCode], [AuthResult], []),
    'sendDirectMessage' : IDL.Func(
        [UserId, UserId, IDL.Text, MessageType],
        [MessageResult],
        [],
      ),
    'sendGroupMessage' : IDL.Func(
        [UserId, GroupId, IDL.Text, MessageType],
        [MessageResult],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
