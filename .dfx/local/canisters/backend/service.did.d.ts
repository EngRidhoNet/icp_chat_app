import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type AuthResult = { 'ok' : User } |
  { 'err' : string };
export type Email = string;
export interface Group {
  'id' : GroupId,
  'members' : Array<UserId>,
  'name' : string,
  'createdAt' : bigint,
  'createdBy' : UserId,
  'description' : [] | [string],
}
export type GroupId = string;
export type GroupResult = { 'ok' : Group } |
  { 'err' : string };
export interface Message {
  'id' : MessageId,
  'content' : string,
  'isRead' : boolean,
  'messageType' : MessageType,
  'groupId' : [] | [GroupId],
  'receiverId' : [] | [UserId],
  'timestamp' : bigint,
  'senderId' : UserId,
}
export type MessageId = bigint;
export type MessageResult = { 'ok' : MessageId } |
  { 'err' : string };
export type MessageType = { 'file' : null } |
  { 'text' : null } |
  { 'document' : null } |
  { 'image' : null };
export type OTPCode = string;
export type OTPResult = { 'ok' : OTPCode } |
  { 'err' : string };
export type Result = { 'ok' : null } |
  { 'err' : string };
export interface User {
  'id' : UserId,
  'name' : string,
  'createdAt' : bigint,
  'isOnline' : boolean,
  'email' : Email,
  'lastSeen' : bigint,
  'avatar' : [] | [string],
}
export type UserId = string;
export interface _SERVICE {
  'createGroup' : ActorMethod<
    [string, [] | [string], UserId, Array<UserId>],
    GroupResult
  >,
  'generateOTP' : ActorMethod<[Email], OTPResult>,
  'getAllUsers' : ActorMethod<[], Array<User>>,
  'getDirectMessages' : ActorMethod<[UserId, UserId], Array<Message>>,
  'getGroupMessages' : ActorMethod<[GroupId], Array<Message>>,
  'getUser' : ActorMethod<[UserId], [] | [User]>,
  'getUserGroups' : ActorMethod<[UserId], Array<Group>>,
  'health' : ActorMethod<[], { 'status' : string, 'timestamp' : bigint }>,
  'loginUser' : ActorMethod<[Email], AuthResult>,
  'logoutUser' : ActorMethod<[UserId], Result>,
  'registerUser' : ActorMethod<[Email, string, OTPCode], AuthResult>,
  'sendDirectMessage' : ActorMethod<
    [UserId, UserId, string, MessageType],
    MessageResult
  >,
  'sendGroupMessage' : ActorMethod<
    [UserId, GroupId, string, MessageType],
    MessageResult
  >,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
