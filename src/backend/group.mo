import HashMap "mo:base/HashMap";
import Array "mo:base/Array";
import Result "mo:base/Result";
import Time "mo:base/Time";
import Iter "mo:base/Iter";
import Text "mo:base/Text";
import Types "./types";
import Utils "./utils";

module GroupManager {
    public class GroupManager() {
        private var groups = HashMap.HashMap<Types.GroupId, Types.Group>(0, Text.equal, Text.hash);

        public func createGroup(
            name: Text,
            description: ?Text,
            createdBy: Types.UserId,
            members: [Types.UserId]
        ) : Result.Result<Types.Group, Text> {
            
            if (not Utils.validateGroupName(name)) {
                return #err("Invalid group name");
            };

            let groupId = Utils.generateGroupId();
            let allMembers = Array.append([createdBy], members);
            
            let group = {
                id = groupId;
                name = name;
                description = description;
                createdBy = createdBy;
                members = allMembers;
                createdAt = Time.now();
            };
            
            groups.put(groupId, group);
            #ok(group)
        };

        public func getGroup(groupId: Types.GroupId) : ?Types.Group {
            groups.get(groupId)
        };

        public func getUserGroups(userId: Types.UserId) : [Types.Group] {
            Array.filter<Types.Group>(Iter.toArray(groups.vals()), func(group) {
                Array.find<Types.UserId>(group.members, func(memberId) { memberId == userId }) != null
            })
        };

        public func addMemberToGroup(
            groupId: Types.GroupId,
            newMemberId: Types.UserId,
            addedBy: Types.UserId
        ) : Result.Result<Types.Group, Text> {
            
            switch (groups.get(groupId)) {
                case (null) #err("Group not found");
                case (?group) {
                    if (group.createdBy != addedBy) {
                        return #err("Only group creator can add members");
                    };

                    switch (Array.find<Types.UserId>(group.members, func(memberId) { memberId == newMemberId })) {
                        case (?_) #err("User is already a member");
                        case null {
                            let updatedGroup = {
                                id = group.id;
                                name = group.name;
                                description = group.description;
                                createdBy = group.createdBy;
                                members = Array.append(group.members, [newMemberId]);
                                createdAt = group.createdAt;
                            };
                            
                            groups.put(groupId, updatedGroup);
                            #ok(updatedGroup)
                        };
                    };
                };
            }
        };

        public func isUserInGroup(userId: Types.UserId, groupId: Types.GroupId) : Bool {
            switch (groups.get(groupId)) {
                case (null) false;
                case (?group) {
                    Array.find<Types.UserId>(group.members, func(memberId) { memberId == userId }) != null
                };
            }
        };

        public func exportGroups() : [(Types.GroupId, Types.Group)] {
            Iter.toArray(groups.entries())
        };

        public func importGroups(groupData: [(Types.GroupId, Types.Group)]) : () {
            groups := HashMap.fromIter<Types.GroupId, Types.Group>(groupData.vals(), groupData.size(), Text.equal, Text.hash);
        };
    }
}