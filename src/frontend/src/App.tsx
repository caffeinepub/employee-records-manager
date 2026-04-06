import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import {
  AlertCircle,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Settings,
  UserCheck,
  UserPlus,
  Users,
  WifiOff,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useState } from "react";
import type { EmployeeRecord } from "./backend.d";
import { EmployeeCard } from "./components/EmployeeCard";
import { EmployeeForm } from "./components/EmployeeForm";
import { ExportBar } from "./components/ExportBar";
import { useEmployees } from "./hooks/useEmployees";
import { useInternetIdentity } from "./hooks/useInternetIdentity";

type NavPage = "dashboard" | "employees" | "settings";

const NAV_ITEMS: { id: NavPage; label: string; icon: React.ReactNode }[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  { id: "employees", label: "Employees", icon: <Users className="w-5 h-5" /> },
  { id: "settings", label: "Settings", icon: <Settings className="w-5 h-5" /> },
];

function DashboardPage({
  employees,
  onNavigate,
}: { employees: EmployeeRecord[]; onNavigate: (page: NavPage) => void }) {
  const total = employees.length;
  const withPhone = employees.filter((e) => e.mobileNumber).length;
  const withBank = employees.filter((e) => e.bankAccountNumber).length;
  const withAadhaar = employees.filter((e) => e.aadhaarNumber).length;

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-emp-text mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Total Employees",
            value: total,
            textColor: "text-emp-blue",
            border: "border-blue-200",
            bg: "bg-blue-50",
          },
          {
            label: "With Phone",
            value: withPhone,
            textColor: "text-green-700",
            border: "border-green-200",
            bg: "bg-green-50",
          },
          {
            label: "With Bank",
            value: withBank,
            textColor: "text-purple-700",
            border: "border-purple-200",
            bg: "bg-purple-50",
          },
          {
            label: "With Aadhaar",
            value: withAadhaar,
            textColor: "text-amber-700",
            border: "border-amber-200",
            bg: "bg-amber-50",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`emp-card p-5 border ${stat.border}`}
          >
            <div className={`text-3xl font-bold mb-1 ${stat.textColor}`}>
              {stat.value}
            </div>
            <div className="text-sm text-emp-text2 font-medium">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
      <div className="emp-card p-6">
        <h2 className="text-lg font-semibold text-emp-text mb-3">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <Button
            className="bg-emp-blue hover:bg-blue-700 text-white"
            onClick={() => onNavigate("employees")}
            data-ocid="dashboard.employees.button"
          >
            <Users className="w-4 h-4 mr-2" />
            View All Employees
          </Button>
        </div>
      </div>
    </div>
  );
}

function SettingsPage({ onSignOut }: { onSignOut: () => void }) {
  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-emp-text mb-6">Settings</h1>
      <div className="emp-card p-6 space-y-4">
        <div>
          <h2 className="font-semibold text-emp-text mb-1">About</h2>
          <p className="text-emp-text2 text-sm">
            Employee Records Manager v1.0
          </p>
          <p className="text-emp-text2 text-sm mt-1">
            Securely manage employee data with offline support.
          </p>
        </div>
        <div className="border-t border-emp-border pt-4">
          <h2 className="font-semibold text-emp-text mb-1">PWA</h2>
          <p className="text-emp-text2 text-sm">
            This app is installable as a Progressive Web App. Look for the
            install prompt in your browser to add it to your home screen.
          </p>
        </div>
        <div className="border-t border-emp-border pt-4">
          <h2 className="font-semibold text-emp-text mb-1">Data Privacy</h2>
          <p className="text-emp-text2 text-sm">
            All employee data is stored on the Internet Computer blockchain.
            Sensitive fields like Aadhaar and bank account numbers are masked by
            default.
          </p>
        </div>
        <div className="border-t border-emp-border pt-4">
          <h2 className="font-semibold text-emp-text mb-1">Account</h2>
          <p className="text-emp-text2 text-sm mb-3">
            You are currently signed in. Sign out to switch accounts or end your
            session.
          </p>
          <Button
            variant="destructive"
            onClick={onSignOut}
            className="flex items-center gap-2"
            data-ocid="settings.signout.button"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-emp-bg flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-4 border-emp-blue border-t-transparent animate-spin" />
        <p className="text-emp-muted text-sm font-medium">Loading...</p>
      </div>
    </div>
  );
}

function LoginPage({
  onLogin,
  isLoggingIn,
}: { onLogin: () => void; isLoggingIn: boolean }) {
  const currentYear = new Date().getFullYear();
  return (
    <div className="min-h-screen bg-emp-bg flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="emp-card w-full max-w-sm p-8 flex flex-col items-center text-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-emp-blue flex items-center justify-center mb-6 shadow-md">
          <UserCheck className="w-9 h-9 text-white" />
        </div>

        <h1 className="text-2xl font-bold text-emp-text mb-1">EmpManager</h1>
        <p className="text-emp-text2 text-sm mb-2">Employee Records Manager</p>
        <p className="text-emp-muted text-xs mb-8">
          Sign in to manage employee records
        </p>

        <Button
          onClick={onLogin}
          disabled={isLoggingIn}
          className="w-full bg-emp-blue hover:bg-blue-700 text-white font-semibold py-2.5 flex items-center justify-center gap-2"
          data-ocid="login.signin.primary_button"
        >
          {isLoggingIn ? (
            <>
              <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              <UserCheck className="w-4 h-4" />
              Sign in with Internet Identity
            </>
          )}
        </Button>
      </motion.div>

      <p className="text-xs text-emp-muted mt-6">
        &copy; {currentYear}.{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-emp-blue transition-colors"
        >
          Built with caffeine.ai
        </a>
      </p>

      <Toaster richColors position="bottom-right" />
    </div>
  );
}

// Extracted outside App to avoid re-mounting on every render
function SidebarNav({
  activePage,
  onNavigate,
  onClose,
  onSignOut,
}: {
  activePage: NavPage;
  onNavigate: (page: NavPage) => void;
  onClose?: () => void;
  onSignOut: () => void;
}) {
  const currentYear = new Date().getFullYear();
  return (
    <>
      <div className="flex items-center gap-3 px-5 py-5 border-b border-emp-border">
        <div className="w-9 h-9 rounded-xl bg-emp-blue flex items-center justify-center flex-shrink-0">
          <UserCheck className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="text-base font-bold text-emp-text">EmpManager</div>
          <div className="text-xs text-emp-muted">Records Manager</div>
        </div>
      </div>

      <nav className="px-3 py-4 flex-1">
        {NAV_ITEMS.map((item) => (
          <button
            type="button"
            key={item.id}
            onClick={() => {
              onNavigate(item.id);
              onClose?.();
            }}
            className={`sidebar-nav-item w-full mb-1 ${activePage === item.id ? "active" : ""}`}
            data-ocid={`nav.${item.id}.link`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="px-5 py-4 border-t border-emp-border space-y-3">
        <button
          type="button"
          onClick={onSignOut}
          className="flex items-center gap-2 text-xs text-emp-muted hover:text-red-500 transition-colors w-full"
          data-ocid="sidebar.signout.button"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign Out
        </button>
        <p className="text-xs text-emp-muted">
          &copy; {currentYear}.{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-emp-blue transition-colors"
          >
            Built with caffeine.ai
          </a>
        </p>
      </div>
    </>
  );
}

function MainApp() {
  const { clear } = useInternetIdentity();

  const [activePage, setActivePage] = useState<NavPage>("employees");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<EmployeeRecord | null>(
    null,
  );
  const [deletingId, setDeletingId] = useState<bigint | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<bigint>>(new Set());

  const {
    employees,
    isLoading,
    isError,
    searchQuery,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    isAdding,
    isUpdating,
    isDeleting,
  } = useEmployees();

  const filteredEmployees = searchQuery(searchTerm);

  const handleSelect = useCallback((id: bigint, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }, []);

  const handleEdit = useCallback((emp: EmployeeRecord) => {
    setEditingEmployee(emp);
    setFormOpen(true);
  }, []);

  const handleDelete = useCallback((id: bigint) => {
    setDeletingId(id);
  }, []);

  const confirmDelete = async () => {
    if (deletingId == null) return;
    await deleteEmployee(deletingId);
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(deletingId);
      return next;
    });
    setDeletingId(null);
  };

  const handleShare = useCallback(async (emp: EmployeeRecord) => {
    const lines = [`Employee Name: ${emp.name}`];
    if (emp.employeeId) lines.push(`Employee ID: ${emp.employeeId}`);
    if (emp.aadhaarNumber) lines.push(`Aadhaar: ${emp.aadhaarNumber}`);
    if (emp.uanNumber) lines.push(`UAN: ${emp.uanNumber}`);
    if (emp.bankAccountNumber)
      lines.push(`Bank Account: ${emp.bankAccountNumber}`);
    if (emp.ifscCode) lines.push(`IFSC: ${emp.ifscCode}`);
    if (emp.mobileNumber) lines.push(`Mobile: ${emp.mobileNumber}`);
    const text = lines.join("\n");
    if (navigator.share) {
      try {
        await navigator.share({ title: emp.name, text });
      } catch {
        /* cancelled */
      }
    } else {
      await navigator.clipboard.writeText(text);
      import("sonner").then(({ toast }) =>
        toast.success("Copied to clipboard!"),
      );
    }
  }, []);

  const handleFormSubmit = async (
    data: Omit<EmployeeRecord, "id" | "timestamp">,
  ) => {
    if (editingEmployee) {
      await updateEmployee({ id: editingEmployee.id, record: data });
    } else {
      await addEmployee(data);
    }
    setFormOpen(false);
    setEditingEmployee(null);
  };

  const handleAddNew = () => {
    setEditingEmployee(null);
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setEditingEmployee(null);
  };

  const selectAll = () => {
    if (selectedIds.size === filteredEmployees.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredEmployees.map((e) => e.id)));
    }
  };

  return (
    <div className="min-h-screen bg-emp-bg flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-white shadow-sidebar border-r border-emp-border fixed left-0 top-0 bottom-0 z-30">
        <SidebarNav
          activePage={activePage}
          onNavigate={setActivePage}
          onSignOut={clear}
        />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-white z-50 flex flex-col shadow-xl lg:hidden"
            >
              <div className="flex justify-end p-3">
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-lg hover:bg-accent"
                  data-ocid="sidebar.close_button"
                >
                  <X className="w-5 h-5 text-emp-text2" />
                </button>
              </div>
              <SidebarNav
                activePage={activePage}
                onNavigate={setActivePage}
                onClose={() => setSidebarOpen(false)}
                onSignOut={clear}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 lg:ml-60 min-h-screen flex flex-col">
        {/* Top Header */}
        <header className="bg-white border-b border-emp-border sticky top-0 z-20 px-4 md:px-6 py-3 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-accent"
            data-ocid="header.menu.button"
          >
            <Menu className="w-5 h-5 text-emp-text2" />
          </button>
          <div className="flex-1 flex items-center gap-2 max-w-sm">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emp-muted" />
              <Input
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-9 border-emp-border text-sm"
                data-ocid="employees.search_input"
              />
            </div>
          </div>
          <Button
            onClick={handleAddNew}
            className="bg-emp-blue hover:bg-blue-700 text-white h-9 px-4 text-sm font-semibold flex items-center gap-2 flex-shrink-0"
            data-ocid="employees.add.primary_button"
          >
            <UserPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Employee</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-4 md:p-6">
          {activePage === "dashboard" && (
            <DashboardPage employees={employees} onNavigate={setActivePage} />
          )}

          {activePage === "settings" && <SettingsPage onSignOut={clear} />}

          {activePage === "employees" && (
            <div className="animate-fade-in">
              {/* Section Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <div>
                  <h1 className="text-[22px] font-bold text-emp-text">
                    Employee Records
                  </h1>
                  <p className="text-sm text-emp-muted mt-0.5">
                    {filteredEmployees.length} of {employees.length} employees
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {filteredEmployees.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={selectAll}
                      className="h-8 text-xs border-emp-border text-emp-text2"
                      data-ocid="employees.select_all.toggle"
                    >
                      {selectedIds.size === filteredEmployees.length
                        ? "Deselect All"
                        : "Select All"}
                    </Button>
                  )}
                  <ExportBar
                    employees={filteredEmployees}
                    selectedIds={selectedIds}
                  />
                </div>
              </div>

              {/* Offline indicator */}
              {isError && (
                <div
                  className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg mb-4 text-sm text-amber-700"
                  data-ocid="employees.offline.error_state"
                >
                  <WifiOff className="w-4 h-4 flex-shrink-0" />
                  Showing cached data — you may be offline.
                </div>
              )}

              {/* Loading state */}
              {isLoading && employees.length === 0 && (
                <div
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
                  data-ocid="employees.loading_state"
                >
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="emp-card p-4 space-y-3">
                      <div className="flex gap-3">
                        <Skeleton className="w-14 h-14 rounded-full" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-3 w-1/2" />
                        </div>
                      </div>
                      <Skeleton className="h-px" />
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-4/5" />
                      <Skeleton className="h-3 w-3/5" />
                    </div>
                  ))}
                </div>
              )}

              {/* Empty state */}
              {!isLoading && employees.length === 0 && (
                <div
                  className="emp-card p-12 text-center"
                  data-ocid="employees.empty_state"
                >
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-emp-blue" />
                  </div>
                  <h3 className="text-lg font-semibold text-emp-text mb-2">
                    No Employees Yet
                  </h3>
                  <p className="text-emp-muted text-sm mb-4">
                    Add your first employee to get started.
                  </p>
                  <Button
                    onClick={handleAddNew}
                    className="bg-emp-blue hover:bg-blue-700 text-white"
                    data-ocid="employees.empty_add.primary_button"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add First Employee
                  </Button>
                </div>
              )}

              {/* Search no results */}
              {!isLoading &&
                employees.length > 0 &&
                filteredEmployees.length === 0 && (
                  <div
                    className="emp-card p-10 text-center"
                    data-ocid="employees.search.empty_state"
                  >
                    <AlertCircle className="w-10 h-10 text-emp-muted mx-auto mb-3" />
                    <p className="text-emp-text2 font-medium">
                      No results for "{searchTerm}"
                    </p>
                    <button
                      type="button"
                      onClick={() => setSearchTerm("")}
                      className="text-sm text-emp-blue hover:underline mt-2"
                    >
                      Clear search
                    </button>
                  </div>
                )}

              {/* Employee Grid */}
              {filteredEmployees.length > 0 && (
                <motion.div
                  id="employee-grid"
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
                  initial={false}
                >
                  <AnimatePresence mode="popLayout">
                    {filteredEmployees.map((emp, idx) => (
                      <motion.div
                        key={emp.id.toString()}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{
                          duration: 0.2,
                          delay: Math.min(idx * 0.04, 0.3),
                        }}
                      >
                        <EmployeeCard
                          employee={emp}
                          index={idx + 1}
                          selected={selectedIds.has(emp.id)}
                          onSelect={handleSelect}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                          onShare={handleShare}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>
          )}
        </div>

        {/* Bottom Mobile Nav */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-emp-border flex z-20">
          {NAV_ITEMS.map((item) => (
            <button
              type="button"
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`flex-1 flex flex-col items-center gap-1 py-2 text-xs font-medium transition-colors ${
                activePage === item.id
                  ? "text-emp-blue"
                  : "text-emp-muted hover:text-emp-text2"
              }`}
              data-ocid={`nav.mobile.${item.id}.link`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </main>

      {/* Add/Edit Form Modal */}
      <EmployeeForm
        open={formOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        initial={editingEmployee}
        isLoading={isAdding || isUpdating}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deletingId !== null}
        onOpenChange={(open) => !open && setDeletingId(null)}
      >
        <AlertDialogContent data-ocid="employees.delete.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Employee?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              employee record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="employees.delete.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-emp-red hover:bg-red-800 text-white"
              data-ocid="employees.delete.confirm_button"
            >
              {isDeleting ? (
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  Deleting...
                </span>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Toaster richColors position="bottom-right" />
    </div>
  );
}

export default function App() {
  const { identity, login, isInitializing, isLoggingIn } =
    useInternetIdentity();

  if (isInitializing) {
    return <LoadingScreen />;
  }

  if (!identity) {
    return <LoginPage onLogin={login} isLoggingIn={isLoggingIn} />;
  }

  return <MainApp />;
}
