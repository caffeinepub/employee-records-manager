import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { EmployeeRecord } from "../backend.d";
import { useActor } from "./useActor";

const CACHE_KEY = "empmanager_employees_cache";
const QUERY_KEY = "employees";

function saveToLocalStorage(employees: EmployeeRecord[]) {
  try {
    const serializable = employees.map((e) => ({
      ...e,
      id: e.id.toString(),
      timestamp: e.timestamp.toString(),
    }));
    localStorage.setItem(CACHE_KEY, JSON.stringify(serializable));
  } catch {
    // ignore storage errors
  }
}

function loadFromLocalStorage(): EmployeeRecord[] {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return parsed.map((e: any) => ({
      ...e,
      id: BigInt(e.id),
      timestamp: BigInt(e.timestamp),
    }));
  } catch {
    return [];
  }
}

export function useEmployees() {
  const { actor, isFetching } = useActor();
  const queryClient = useQueryClient();

  const query = useQuery<EmployeeRecord[]>({
    queryKey: [QUERY_KEY],
    queryFn: async () => {
      if (!actor) return loadFromLocalStorage();
      try {
        const employees = await actor.getAllEmployees();
        saveToLocalStorage(employees);
        return employees;
      } catch {
        return loadFromLocalStorage();
      }
    },
    enabled: !isFetching,
    placeholderData: loadFromLocalStorage,
    staleTime: 30_000,
  });

  const addMutation = useMutation({
    mutationFn: async (record: Omit<EmployeeRecord, "id" | "timestamp">) => {
      if (!actor) throw new Error("Not connected");
      const newRecord: EmployeeRecord = {
        ...record,
        id: 0n,
        timestamp: 0n,
      };
      return actor.addEmployee(newRecord);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast.success("Employee added successfully");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to add employee");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      record,
    }: {
      id: bigint;
      record: Omit<EmployeeRecord, "id" | "timestamp">;
    }) => {
      if (!actor) throw new Error("Not connected");
      const updatedRecord: EmployeeRecord = {
        ...record,
        id,
        timestamp: 0n,
      };
      return actor.updateEmployee(id, updatedRecord);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast.success("Employee updated successfully");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to update employee");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteEmployee(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast.success("Employee deleted successfully");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to delete employee");
    },
  });

  const searchQuery = (searchTerm: string) => {
    const all = query.data || [];
    if (!searchTerm.trim()) return all;
    const lower = searchTerm.toLowerCase();
    return all.filter(
      (e) =>
        e.name.toLowerCase().includes(lower) ||
        e.employeeId?.toLowerCase().includes(lower) ||
        e.mobileNumber?.includes(lower),
    );
  };

  return {
    employees: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    searchQuery,
    addEmployee: addMutation.mutateAsync,
    updateEmployee: updateMutation.mutateAsync,
    deleteEmployee: deleteMutation.mutateAsync,
    isAdding: addMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
