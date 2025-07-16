import Time "mo:base/Time";
import Text "mo:base/Text";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Int "mo:base/Int";

module Utils {
    public func generateOTPCode() : Text {
        let chars = "0123456789";
        var code = "";
        var i = 0;
        let seed = Int.abs(Time.now()) % 1000000;
        let charsArray = Iter.toArray(chars.chars());
        
        while (i < 6) {
            let index = (seed + i * 7) % 10;
            code := code # Text.fromChar(charsArray[index]);
            i += 1;
        };
        code
    };

    public func generateUserId() : Text {
        "user_" # Int.toText(Int.abs(Time.now()))
    };

    public func generateGroupId() : Text {
        "group_" # Int.toText(Int.abs(Time.now()))
    };

    public func isOTPExpired(expiresAt: Int) : Bool {
        Time.now() > expiresAt
    };

    public func getOTPExpirationTime() : Int {
        Time.now() + 300_000_000_000 // 5 minutes
    };

    public func isValidEmail(email: Text) : Bool {
        Text.contains(email, #char '@') and Text.size(email) > 5
    };

    public func validateMessageContent(content: Text) : Bool {
        let trimmed = Text.trim(content, #char ' ');
        Text.size(trimmed) > 0 and Text.size(trimmed) <= 1000
    };

    public func validateGroupName(name: Text) : Bool {
        let trimmed = Text.trim(name, #char ' ');
        Text.size(trimmed) > 0 and Text.size(trimmed) <= 50
    };

    public func validateUserName(name: Text) : Bool {
        let trimmed = Text.trim(name, #char ' ');
        Text.size(trimmed) > 0 and Text.size(trimmed) <= 100
    };
}