import Time "mo:base/Time";

module Types {
    public type UserId = Text;
    public type GroupId = Text;
    public type MessageId = Nat;
    public type Email = Text;
    public type OTPCode = Text;

    public type User = {
        id: UserId;
        email: Email;
        name: Text;
        avatar: ?Text;
        isOnline: Bool;
        lastSeen: Int;
        createdAt: Int;
    };

    public type Message = {
        id: MessageId;
        senderId: UserId;
        receiverId: ?UserId;
        groupId: ?GroupId;
        content: Text;
        messageType: MessageType;
        timestamp: Int;
        isRead: Bool;
    };

    public type Group = {
        id: GroupId;
        name: Text;
        description: ?Text;
        createdBy: UserId;
        members: [UserId];
        createdAt: Int;
    };

    public type OTP = {
        email: Email;
        code: OTPCode;
        expiresAt: Int;
    };

    public type MessageType = {
        #text;
        #image;
        #document;
        #file;
    };

    public type AuthResult = {
        #ok: User;
        #err: Text;
    };

    public type MessageResult = {
        #ok: MessageId;
        #err: Text;
    };

    public type GroupResult = {
        #ok: Group;
        #err: Text;
    };

    public type OTPResult = {
        #ok: OTPCode;
        #err: Text;
    };
}