import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";
import AccessControl "authorization/access-control";

module {
  type OldEntry = {
    id : Nat;
    section : { #research; #storytelling; #poetry };
    title : Text;
    body : Text;
    tags : [Text];
    createdAt : Int;
    updatedAt : Int;
    published : Bool;
    excerpt : ?Text;
  };

  type OldWork = {
    id : Nat;
    title : Text;
    description : Text;
    file : Storage.ExternalBlob;
    createdAt : Int;
    updatedAt : Int;
    published : Bool;
  };

  type OldActor = {
    entries : Map.Map<Nat, OldEntry>;
    nextEntryId : Nat;
    works : Map.Map<Nat, OldWork>;
    nextWorkId : Nat;
    userProfiles : Map.Map<Principal, { name : Text }>;
    accessControlState : AccessControl.AccessControlState;
  };

  type NewActor = {
    entries : Map.Map<Nat, OldEntry>;
    nextEntryId : Nat;
    works : Map.Map<Nat, OldWork>;
    nextWorkId : Nat;
    userProfiles : Map.Map<Principal, { name : Text }>;
    accessControlState : AccessControl.AccessControlState;
  };

  public func run(old : OldActor) : NewActor {
    old;
  };
};
