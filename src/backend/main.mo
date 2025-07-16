import Result "mo:base/Result";
import Time "mo:base/Time";
import Types "./types";
import UserManager "./user";
import MessageManager "./message";
import GroupManager "./group";

actor ChatApp {
    private let userManager = UserManager.UserManager();
    private let messageManager = MessageManager.MessageManager();
    private let groupManager = GroupManager.GroupManager();

    private stable var usersData : [(Types.UserId, Types.User)] = [];
    private stable var messagesData : [Types.Message] = [];
    private stable var groupsData : [(Types.GroupId, Types.Group)] = [];

    system func preupgrade() {
        usersData := userManager.exportUsers();
        messagesData := messageManager.exportMessages();
        groupsData := groupManager.exportGroups();
    };

    system func postupgrade() {
        userManager.importUsers(usersData);
        messageManager.importMessages(messagesData);
        groupManager.importGroups(groupsData);

        usersData := [];
        messagesData := [];
        groupsData := [];
    };

    // Authentication
    public func generateOTP(email : Types.Email) : async Types.OTPResult {
        userManager.generateOTP(email);
    };

    public func registerUser(email : Types.Email, name : Text, otpCode : Types.OTPCode) : async Types.AuthResult {
        switch (userManager.verifyOTP(email, otpCode)) {
            case (#err(msg)) #err(msg);
            case (#ok(_)) {
                userManager.createUser(email, name);
            };
        };
    };

    public func loginUser(email : Types.Email) : async Types.AuthResult {
        switch (userManager.getUserByEmail(email)) {
            case (null) #err("User not found");
            case (?user) {
                ignore userManager.updateUserStatus(user.id, true);
                #ok(user);
            };
        };
    };

    public func logoutUser(userId : Types.UserId) : async Result.Result<(), Text> {
        userManager.updateUserStatus(userId, false);
    };

    // Messages
    public func sendDirectMessage(
        senderId : Types.UserId,
        receiverId : Types.UserId,
        content : Text,
        messageType : Types.MessageType,
    ) : async Types.MessageResult {
        messageManager.sendDirectMessage(senderId, receiverId, content, messageType);
    };

    public func sendGroupMessage(
        senderId : Types.UserId,
        groupId : Types.GroupId,
        content : Text,
        messageType : Types.MessageType,
    ) : async Types.MessageResult {
        if (not groupManager.isUserInGroup(senderId, groupId)) {
            return #err("User is not a member of this group");
        };

        messageManager.sendGroupMessage(senderId, groupId, content, messageType);
    };

    // Groups
    public func createGroup(
        name : Text,
        description : ?Text,
        createdBy : Types.UserId,
        members : [Types.UserId],
    ) : async Types.GroupResult {
        groupManager.createGroup(name, description, createdBy, members);
    };

    // Queries
    public query func getUser(userId : Types.UserId) : async ?Types.User {
        userManager.getUserById(userId);
    };

    public query func getAllUsers() : async [Types.User] {
        userManager.getAllUsers();
    };

    public query func getDirectMessages(userId1 : Types.UserId, userId2 : Types.UserId) : async [Types.Message] {
        messageManager.getDirectMessages(userId1, userId2);
    };

    public query func getGroupMessages(groupId : Types.GroupId) : async [Types.Message] {
        messageManager.getGroupMessages(groupId);
    };

    public query func getUserGroups(userId : Types.UserId) : async [Types.Group] {
        groupManager.getUserGroups(userId);
    };

    public query func health() : async { status : Text; timestamp : Int } {
        { status = "healthy"; timestamp = Time.now() };
    };
};
