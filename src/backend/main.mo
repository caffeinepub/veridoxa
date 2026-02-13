import Array "mo:core/Array";
import List "mo:core/List";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import AccessControl "authorization/access-control";
import Migration "migration";

(with migration = Migration.run)
actor {
  // Now persistent actor variable instead of local variable.
  let accessControlState = AccessControl.initState();

  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // User Profile System
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  type Section = { #research; #storytelling; #poetry };

  type Entry = {
    id : Nat;
    section : Section;
    title : Text;
    body : Text;
    tags : [Text];
    createdAt : Int;
    updatedAt : Int;
    published : Bool;
    excerpt : ?Text;
  };

  let entries = Map.empty<Nat, Entry>();
  var nextEntryId = 0;

  public shared ({ caller }) func createEntry(
    section : Section,
    title : Text,
    body : Text,
    tags : [Text],
    excerpt : ?Text,
  ) : async Entry {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create entries");
    };

    let id = nextEntryId;
    nextEntryId += 1;

    let entry : Entry = {
      id;
      section;
      title;
      body;
      tags;
      createdAt = Time.now();
      updatedAt = Time.now();
      published = false;
      excerpt;
    };

    entries.add(id, entry);
    entry;
  };

  public shared ({ caller }) func updateEntry(
    id : Nat,
    section : Section,
    title : Text,
    body : Text,
    tags : [Text],
    excerpt : ?Text,
  ) : async Entry {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update entries");
    };

    switch (entries.get(id)) {
      case (null) {
        Runtime.trap("Entry not found");
      };
      case (?existingEntry) {
        let updatedEntry : Entry = {
          id;
          section;
          title;
          body;
          tags;
          createdAt = existingEntry.createdAt;
          updatedAt = Time.now();
          published = existingEntry.published;
          excerpt;
        };

        entries.add(id, updatedEntry);
        updatedEntry;
      };
    };
  };

  public shared ({ caller }) func deleteEntry(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete entries");
    };

    if (not entries.containsKey(id)) {
      Runtime.trap("Entry not found");
    };

    entries.remove(id);
  };

  public shared ({ caller }) func publishEntry(id : Nat, published : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can publish entries");
    };

    switch (entries.get(id)) {
      case (null) {
        Runtime.trap("Entry not found");
      };
      case (?existingEntry) {
        let updatedEntry = {
          existingEntry with
          published;
          updatedAt = Time.now();
        };
        entries.add(id, updatedEntry);
      };
    };
  };

  public query ({ caller }) func getEntry(id : Nat) : async Entry {
    switch (entries.get(id)) {
      case (null) {
        Runtime.trap("Entry not found");
      };
      case (?entry) {
        if (not entry.published and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Not published yet");
        };
        entry;
      };
    };
  };

  public query ({ caller }) func listAllEntries() : async [Entry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all entries");
    };
    entries.values().toArray();
  };

  public query ({ caller }) func listPublishedBySection(section : Section) : async [Entry] {
    let filtered = entries.values().toArray().filter(
      func(entry) {
        entry.published and entry.section == section
      }
    );
    filtered;
  };

  public query ({ caller }) func searchEntries(searchTerm : Text) : async [Entry] {
    let results = List.empty<Entry>();

    for (entry in entries.values()) {
      if (entry.published and (entry.title.contains(#text searchTerm) or entry.body.contains(#text searchTerm))) {
        results.add(entry);
      };
    };

    results.toArray();
  };

  public query ({ caller }) func searchEntriesByTag(tag : Text) : async [Entry] {
    let results = List.empty<Entry>();

    for (entry in entries.values()) {
      if (entry.published) {
        for (entryTag in entry.tags.values()) {
          if (tag == entryTag) {
            results.add(entry);
          };
        };
      };
    };

    results.toArray();
  };

  public query ({ caller }) func listRecentEntries(limit : Nat) : async [Entry] {
    let publishedEntries = entries.values().toArray().filter(
      func(entry) {
        entry.published;
      }
    );

    publishedEntries.sliceToArray(0, Nat.min(limit, publishedEntries.size()));
  };

  ///////////////////
  // Works Support //
  ///////////////////

  let works = Map.empty<Nat, Work>();
  var nextWorkId = 0;

  public type Work = {
    id : Nat;
    title : Text;
    description : Text;
    file : Storage.ExternalBlob;
    createdAt : Int;
    updatedAt : Int;
    published : Bool;
  };

  public shared ({ caller }) func createWork(title : Text, description : Text, file : Storage.ExternalBlob) : async Work {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create works");
    };

    let id = nextWorkId;
    nextWorkId += 1;

    let work : Work = {
      id;
      title;
      description;
      file;
      createdAt = Time.now();
      updatedAt = Time.now();
      published = false;
    };

    works.add(id, work);
    work;
  };

  public shared ({ caller }) func updateWork(id : Nat, title : Text, description : Text) : async Work {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update works");
    };

    switch (works.get(id)) {
      case (null) {
        Runtime.trap("Work not found");
      };
      case (?existingWork) {
        let updatedWork : Work = {
          id;
          title;
          description;
          file = existingWork.file;
          createdAt = existingWork.createdAt;
          updatedAt = Time.now();
          published = existingWork.published;
        };

        works.add(id, updatedWork);
        updatedWork;
      };
    };
  };

  public shared ({ caller }) func deleteWork(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete works");
    };

    if (not works.containsKey(id)) {
      Runtime.trap("Work not found");
    };

    works.remove(id);
  };

  public shared ({ caller }) func publishWork(id : Nat, published : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can publish works");
    };

    switch (works.get(id)) {
      case (null) {
        Runtime.trap("Work not found");
      };
      case (?existingWork) {
        let updatedWork = {
          existingWork with
          published;
          updatedAt = Time.now();
        };
        works.add(id, updatedWork);
      };
    };
  };

  public query ({ caller }) func getWork(id : Nat) : async Work {
    switch (works.get(id)) {
      case (null) {
        Runtime.trap("Work not found");
      };
      case (?work) {
        if (not work.published and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Not published yet");
        };
        work;
      };
    };
  };

  public query ({ caller }) func listAllWorks() : async [Work] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all works");
    };
    works.values().toArray();
  };

  public query ({ caller }) func listPublishedWorks() : async [Work] {
    let iter = works.values().filter(
      func(work) {
        work.published
      }
    );
    iter.toArray();
  };

  public query ({ caller }) func searchWorks(searchTerm : Text) : async [Work] {
    let results = List.empty<Work>();

    for (work in works.values()) {
      if (work.published and (work.title.contains(#text searchTerm) or work.description.contains(#text searchTerm))) {
        results.add(work);
      };
    };

    results.toArray();
  };

  public query ({ caller }) func listRecentWorks(limit : Nat) : async [Work] {
    let publishedWorks = works.values().toArray().filter(
      func(work) {
        work.published;
      }
    );

    publishedWorks.sliceToArray(0, Nat.min(limit, publishedWorks.size()));
  };
};
