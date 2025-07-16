import HashMap "mo:base/HashMap";
import Result "mo:base/Result";
import Time "mo:base/Time";
import Iter "mo:base/Iter";
import Text "mo:base/Text";
import Array "mo:base/Array";
import Debug "mo:base/Debug";
import Types "./types";
import Utils "./utils";

module UserManager {
    public class UserManager() {
        private var users = HashMap.HashMap<Types.UserId, Types.User>(0, Text.equal, Text.hash);
        private var usersByEmail = HashMap.HashMap<Types.Email, Types.UserId>(0, Text.equal, Text.hash);
        private var otpCodes = HashMap.HashMap<Types.Email, Types.OTP>(0, Text.equal, Text.hash);

        public func generateOTP(email: Types.Email) : Result.Result<Types.OTPCode, Text> {
            if (not Utils.isValidEmail(email)) {
                return #err("Invalid email address");
            };

            let code = Utils.generateOTPCode();
            let otp = {
                email = email;
                code = code;
                expiresAt = Utils.getOTPExpirationTime();
            };
            
            otpCodes.put(email, otp);
            
            // Debug: Print OTP for development
            Debug.print("=== OTP Generated ===");
            Debug.print("Email: " # email);
            Debug.print("OTP Code: " # code);
            Debug.print("==================");
            
            #ok(code)
        };

        public func verifyOTP(email: Types.Email, code: Types.OTPCode) : Result.Result<Bool, Text> {
            switch (otpCodes.get(email)) {
                case (null) #err("OTP not found or expired");
                case (?otp) {
                    if (otp.code != code) {
                        #err("Invalid OTP code")
                    } else if (Utils.isOTPExpired(otp.expiresAt)) {
                        otpCodes.delete(email);
                        #err("OTP expired")
                    } else {
                        otpCodes.delete(email);
                        #ok(true)
                    }
                };
            }
        };

        public func createUser(email: Types.Email, name: Text) : Result.Result<Types.User, Text> {
            if (not Utils.isValidEmail(email)) {
                return #err("Invalid email address");
            };

            if (not Utils.validateUserName(name)) {
                return #err("Invalid user name");
            };

            switch (usersByEmail.get(email)) {
                case (?_) { return #err("User already exists with this email") };
                case null { };
            };

            let userId = Utils.generateUserId();
            let user = {
                id = userId;
                email = email;
                name = name;
                avatar = null;
                isOnline = true;
                lastSeen = Time.now();
                createdAt = Time.now();
            };
            
            users.put(userId, user);
            usersByEmail.put(email, userId);
            #ok(user)
        };

        public func updateUser(userId: Types.UserId, updatedUser: Types.User) : Result.Result<(), Text> {
            switch (users.get(userId)) {
                case (null) #err("User not found");
                case (?_) {
                    users.put(userId, updatedUser);
                    #ok()
                };
            }
        };

        public func getUserById(userId: Types.UserId) : ?Types.User {
            users.get(userId)
        };

        public func getUserByEmail(email: Types.Email) : ?Types.User {
            switch (usersByEmail.get(email)) {
                case (null) null;
                case (?userId) users.get(userId);
            }
        };

        public func updateUserStatus(userId: Types.UserId, isOnline: Bool) : Result.Result<(), Text> {
            switch (users.get(userId)) {
                case (null) #err("User not found");
                case (?user) {
                    let updatedUser = {
                        id = user.id;
                        email = user.email;
                        name = user.name;
                        avatar = user.avatar;
                        isOnline = isOnline;
                        lastSeen = Time.now();
                        createdAt = user.createdAt;
                    };
                    users.put(userId, updatedUser);
                    #ok()
                };
            }
        };

        public func getAllUsers() : [Types.User] {
            Iter.toArray(users.vals())
        };

        public func getOnlineUsers() : [Types.User] {
            let allUsers = Iter.toArray(users.vals());
            Array.filter<Types.User>(allUsers, func(user) { user.isOnline })
        };

        public func cleanupExpiredOTPs() : () {
            let entries = Iter.toArray(otpCodes.entries());
            
            for ((email, otp) in entries.vals()) {
                if (Utils.isOTPExpired(otp.expiresAt)) {
                    otpCodes.delete(email);
                };
            };
        };

        public func exportUsers() : [(Types.UserId, Types.User)] {
            Iter.toArray(users.entries())
        };

        public func importUsers(userData: [(Types.UserId, Types.User)]) : () {
            users := HashMap.fromIter<Types.UserId, Types.User>(userData.vals(), userData.size(), Text.equal, Text.hash);
            
            for ((userId, user) in userData.vals()) {
                usersByEmail.put(user.email, userId);
            };
        };
    }
}