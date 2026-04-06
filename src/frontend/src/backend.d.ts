import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface EmployeeRecord {
    id: bigint;
    bankAccountNumber?: string;
    ifscCode?: string;
    name: string;
    mobileNumber?: string;
    employeeId?: string;
    timestamp: bigint;
    aadhaarNumber?: string;
    uanNumber?: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addEmployee(record: EmployeeRecord): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteEmployee(id: bigint): Promise<void>;
    getAllEmployees(): Promise<Array<EmployeeRecord>>;
    getCallerUserRole(): Promise<UserRole>;
    getEmployee(id: bigint): Promise<EmployeeRecord>;
    isCallerAdmin(): Promise<boolean>;
    updateEmployee(id: bigint, record: EmployeeRecord): Promise<void>;
}
