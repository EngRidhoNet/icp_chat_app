import Array "mo:base/Array";
import Result "mo:base/Result";
import Time "mo:base/Time";
import Types "./types";
import Utils "./utils";

module MessageManager {
    public class MessageManager() {
        private var messages : [Types.Message] = [];
        private var nextMessageId : Types.MessageId = 0;

        public func sendDirectMessage(
            senderId: Types.UserId,
            receiverId: Types.UserId,
            content: Text,
            messageType: Types.MessageType
        ) : Result.Result<Types.MessageId, Text> {
            
            if (not Utils.validateMessageContent(content)) {
                return #err("Invalid message content");
            };

            if (senderId == receiverId) {
                return #err("Cannot send message to yourself");
            };

            let message = {
                id = nextMessageId;
                senderId = senderId;
                receiverId = ?receiverId;
                groupId = null;
                content = content;
                messageType = messageType;
                timestamp = Time.now();
                isRead = false;
            };
            
            messages := Array.append(messages, [message]);
            nextMessageId += 1;
            #ok(message.id)
        };

        public func sendGroupMessage(
            senderId: Types.UserId,
            groupId: Types.GroupId,
            content: Text,
            messageType: Types.MessageType
        ) : Result.Result<Types.MessageId, Text> {
            
            if (not Utils.validateMessageContent(content)) {
                return #err("Invalid message content");
            };

            let message = {
                id = nextMessageId;
                senderId = senderId;
                receiverId = null;
                groupId = ?groupId;
                content = content;
                messageType = messageType;
                timestamp = Time.now();
                isRead = false;
            };
            
            messages := Array.append(messages, [message]);
            nextMessageId += 1;
            #ok(message.id)
        };

        public func getDirectMessages(userId1: Types.UserId, userId2: Types.UserId) : [Types.Message] {
            Array.filter<Types.Message>(messages, func(msg) {
                (msg.senderId == userId1 and msg.receiverId == ?userId2) or
                (msg.senderId == userId2 and msg.receiverId == ?userId1)
            })
        };

        public func getGroupMessages(groupId: Types.GroupId) : [Types.Message] {
            Array.filter<Types.Message>(messages, func(msg) {
                msg.groupId == ?groupId
            })
        };

        public func markAsRead(messageId: Types.MessageId, userId: Types.UserId) : Result.Result<(), Text> {
            let updatedMessages = Array.map<Types.Message, Types.Message>(messages, func(msg) {
                if (msg.id == messageId and msg.receiverId == ?userId) {
                    {
                        id = msg.id;
                        senderId = msg.senderId;
                        receiverId = msg.receiverId;
                        groupId = msg.groupId;
                        content = msg.content;
                        messageType = msg.messageType;
                        timestamp = msg.timestamp;
                        isRead = true;
                    }
                } else {
                    msg
                }
            });
            
            messages := updatedMessages;
            #ok()
        };

        public func getUnreadCount(userId: Types.UserId) : Nat {
            let unreadMessages = Array.filter<Types.Message>(messages, func(msg) {
                msg.receiverId == ?userId and not msg.isRead
            });
            unreadMessages.size()
        };

        public func exportMessages() : [Types.Message] {
            messages
        };

        public func importMessages(messageData: [Types.Message]) : () {
            messages := messageData;
            var maxId = 0;
            for (message in messages.vals()) {
                if (message.id >= maxId) {
                    maxId := message.id + 1;
                };
            };
            nextMessageId := maxId;
        };
    }
}