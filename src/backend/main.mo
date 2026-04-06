import Map "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";



actor {
  // Include authorization system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  module EmployeeRecord {
    public func compare(record1 : EmployeeRecord, record2 : EmployeeRecord) : Order.Order {
      Nat.compare(record2.timestamp, record1.timestamp); // Newest first
    };
  };

  // Employee record type
  public type EmployeeRecord = {
    id : Nat;
    name : Text;
    timestamp : Nat;
    employeeId : ?Text;
    aadhaarNumber : ?Text;
    uanNumber : ?Text;
    bankAccountNumber : ?Text;
    ifscCode : ?Text;
    mobileNumber : ?Text;
  };

  let records = Map.empty<Nat, EmployeeRecord>();
  var nextRecordId = 1;

  // Add Employee
  public shared ({ caller }) func addEmployee(record : EmployeeRecord) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can add employees");
    };

    let id = nextRecordId;
    nextRecordId += 1;

    let recordWithId = {
      id;
      name = record.name;
      timestamp = Time.now().toNat();
      employeeId = record.employeeId;
      aadhaarNumber = record.aadhaarNumber;
      uanNumber = record.uanNumber;
      bankAccountNumber = record.bankAccountNumber;
      ifscCode = record.ifscCode;
      mobileNumber = record.mobileNumber;
    };

    records.add(id, recordWithId);
    id;
  };

  // Update Employee
  public shared ({ caller }) func updateEmployee(id : Nat, record : EmployeeRecord) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can update employees");
    };

    if (not records.containsKey(id)) {
      Runtime.trap("Record not found");
    };

    let updatedRecord = {
      id;
      timestamp = Time.now().toNat();
      name = record.name;
      employeeId = record.employeeId;
      aadhaarNumber = record.aadhaarNumber;
      uanNumber = record.uanNumber;
      bankAccountNumber = record.bankAccountNumber;
      ifscCode = record.ifscCode;
      mobileNumber = record.mobileNumber;
    };

    records.add(id, updatedRecord);
  };

  // Delete Employee
  public shared ({ caller }) func deleteEmployee(id : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete records");
    };

    if (not records.containsKey(id)) {
      Runtime.trap("Record not found");
    };

    records.remove(id);
  };

  // Get Employee
  public query ({ caller }) func getEmployee(id : Nat) : async EmployeeRecord {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view employee records");
    };

    switch (records.get(id)) {
      case (null) { Runtime.trap("Record not found") };
      case (?record) { record };
    };
  };

  // Get All Employees
  public query ({ caller }) func getAllEmployees() : async [EmployeeRecord] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view employee records");
    };

    records.values().toArray().sort(); // Sorted by timestamp (newest first)
  };
};
