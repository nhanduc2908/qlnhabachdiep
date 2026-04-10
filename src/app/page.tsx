"use client";

import { useState } from "react";

type Tab = "employees" | "packages" | "salary" | "attendance" | "finance" | "reports" | "departments" | "contracts" | "performance" | "customers" | "bookings" | "services" | "inventory" | "reviews" | "accounts";
type Role = "admin" | "manager" | "user";

interface UserAccount {
  id: number;
  username: string;
  password: string;
  role: Role;
  createdAt: string;
}

interface RoleConfig {
  canAdd: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canViewReports: boolean;
  canViewFinance: boolean;
  canEditSalary: boolean;
  tabs: Tab[];
}

const rolePermissions: Record<Role, RoleConfig> = {
  admin: {
    canAdd: true,
    canEdit: true,
    canDelete: true,
    canViewReports: true,
    canViewFinance: true,
    canEditSalary: true,
    tabs: ["employees", "departments", "contracts", "packages", "salary", "attendance", "finance", "performance", "reports", "customers", "bookings", "services", "inventory", "reviews", "accounts"],
  },
  manager: {
    canAdd: true,
    canEdit: true,
    canDelete: false,
    canViewReports: true,
    canViewFinance: true,
    canEditSalary: true,
    tabs: ["employees", "contracts", "salary", "attendance", "finance", "performance", "reports", "customers", "bookings", "services", "accounts"],
  },
  user: {
    canAdd: false,
    canEdit: false,
    canDelete: false,
    canViewReports: false,
    canViewFinance: false,
    canEditSalary: false,
    tabs: ["employees", "salary", "attendance", "performance", "reviews"],
  },
};

interface Employee {
  id: number;
  name: string;
  position: string;
  phone: string;
  startDate: string;
  status: string;
  department: string;
  contractType: string;
  skills: string[];
}

interface SalaryPackage {
  id: number;
  name: string;
  percentage: number;
  description: string;
}

interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string;
  note: string;
  createdAt: string;
}

interface Booking {
  id: number;
  customerId: number;
  employeeId: number;
  service: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
}

interface Service {
  id: number;
  name: string;
  price: number;
  duration: number;
  description: string;
}

interface InventoryItem {
  id: number;
  name: string;
  quantity: number;
  unit: string;
}

interface Review {
  id: number;
  customerId: number;
  employeeId: number;
  rating: number;
  comment: string;
  date: string;
}

interface Attendance {
  id: number;
  employeeId: number;
  date: string;
  checkIn: string;
  checkOut: string;
  status: "present" | "absent" | "late";
}

interface FinanceRecord {
  id: number;
  type: "income" | "expense";
  amount: number;
  description: string;
  date: string;
}

const mockEmployees: Employee[] = [
  { id: 1, name: "Nguyễn Văn A", position: "Thầy Tarot", phone: "0912345678", startDate: "2024-01-15", status: "active", department: "Tarot", contractType: "HĐLĐ", skills: ["Tarot", "Lenormand", "Kinh Dịch"] },
  { id: 2, name: "Trần Thị B", position: "Thầy phong thủy", phone: "0912345679", startDate: "2024-03-01", status: "active", department: "Phong Thủy", contractType: "HĐLĐ", skills: ["Tử Vi", "Thần Số Học", "Kinh Dịch"] },
  { id: 3, name: "Lê Văn C", position: "Thầy xem bói", phone: "0912345680", startDate: "2024-02-10", status: "active", department: "Bói Toán", contractType: "HĐLĐ", skills: ["Bài Tây", "Bói Cổ", "Lá trà"] },
  { id: 4, name: "Phạm Thị D", position: "Cô phù thủy", phone: "0912345681", startDate: "2024-04-01", status: "active", department: "Xăm Bùa", contractType: "HĐLĐ", skills: ["Xăm", "Quẻ", "Sâm"] },
  { id: 5, name: "Nguyễn Văn E", position: "Nhân viên lễ tân", phone: "0912345682", startDate: "2024-05-01", status: "active", department: "Lễ Tân", contractType: "Thử việc", skills: ["Lenormand", "Bài Tây"] },
  { id: 6, name: "Hoàng Thị F", position: "Hướng dẫn viên", phone: "0912345683", startDate: "2024-06-01", status: "active", department: "Hướng Dẫn", contractType: "HĐLĐ", skills: ["Tarot", "Tử Vi", "Thần Số Học Tên"] },
];

const mockPackages: SalaryPackage[] = [
  { id: 1, name: "Gói Tân binh", percentage: 5, description: "Nhân viên mới" },
  { id: 2, name: "Gói Chính thức", percentage: 10, description: "Nhân viên chính thức" },
  { id: 3, name: "Gói Cao cấp", percentage: 15, description: "Thầy cô kinh nghiệm" },
  { id: 4, name: "Gói VIP", percentage: 20, description: "Trưởng phòng" },
];

const mockDepartmentsInit = ["Tarot", "Phong Thủy", "Bói Toán", "Xăm Bùa", "Lễ Tân", "Hướng Dẫn", "Kế Toán"];
const mockContracts = ["HĐLĐ", "Thử việc", "Hợp đồng thời vụ"];

const mockCustomers: Customer[] = [
  { id: 1, name: "Khách hàng A", phone: "0987654321", email: "khachhangA@email.com", note: "Thường xuyên ghé", createdAt: "2024-01-10" },
  { id: 2, name: "Khách hàng B", phone: "0987654322", email: "khachhangB@email.com", note: "Hỏi về Tarot", createdAt: "2024-02-15" },
  { id: 3, name: "Khách hàng C", phone: "0987654323", email: "khachhangC@email.com", note: "Xem phong thủy", createdAt: "2024-03-20" },
];

const mockBookings: Booking[] = [
  { id: 1, customerId: 1, employeeId: 1, service: "Xem Tarot", date: "2024-10-05", time: "10:00", status: "confirmed" },
  { id: 2, customerId: 2, employeeId: 2, service: "Xem phong thủy", date: "2024-10-05", time: "14:00", status: "pending" },
  { id: 3, customerId: 3, employeeId: 1, service: "Bói bài Tarot", date: "2024-10-06", time: "09:00", status: "completed" },
];

const mockServices: Service[] = [
  { id: 1, name: "Xem Tarot 1 lá", price: 150000, duration: 15, description: "Xem 1 lá bài Tarot" },
  { id: 2, name: "Xem Tarot 3 lá", price: 300000, duration: 30, description: "Xem 3 lá bài Tarot" },
  { id: 3, name: "Xem phong thủy", price: 500000, duration: 45, description: "Xem hướng nhà" },
  { id: 4, name: "Bói bài Tarot", price: 200000, duration: 20, description: "Bói bài Tình Yêu" },
  { id: 5, name: "Xăm Bùa", price: 800000, duration: 60, description: "Xăm bùa may mắn" },
];

const mockInventory: InventoryItem[] = [
  { id: 1, name: "Bài Tarot Rider-Waite", quantity: 10, unit: "bộ" },
  { id: 2, name: "Nến thơm", quantity: 50, unit: "cây" },
  { id: 3, name: "Trà mạn", quantity: 20, unit: "gói" },
  { id: 4, name: "Vòng cầu may", quantity: 30, unit: "chiếc" },
];

const mockReviews: Review[] = [
  { id: 1, customerId: 1, employeeId: 1, rating: 5, comment: "Rất chính xác!", date: "2024-10-01" },
  { id: 2, customerId: 2, employeeId: 2, rating: 4, comment: "Tốt", date: "2024-10-02" },
  { id: 3, customerId: 3, employeeId: 1, rating: 5, comment: "Cảm ơn Thầy!", date: "2024-10-03" },
];

const mockAccounts: UserAccount[] = [
  { id: 1, username: "admin", password: "admin123", role: "admin", createdAt: "2024-01-01" },
  { id: 2, username: "manager", password: "manager123", role: "manager", createdAt: "2024-02-01" },
  { id: 3, username: "user", password: "user123", role: "user", createdAt: "2024-03-01" },
];

const mockAttendanceInit: Attendance[] = [
  { id: 1, employeeId: 1, date: "2024-10-01", checkIn: "08:00", checkOut: "17:00", status: "present" },
  { id: 2, employeeId: 2, date: "2024-10-01", checkIn: "08:00", checkOut: "17:00", status: "present" },
  { id: 3, employeeId: 3, date: "2024-10-01", checkIn: "08:30", checkOut: "17:00", status: "late" },
];

const mockFinanceInit: FinanceRecord[] = [
  { id: 1, type: "income", amount: 15000000, description: "Xem Tarot", date: "2024-10-01" },
  { id: 2, type: "income", amount: 8000000, description: "Xem phong thủy", date: "2024-10-02" },
  { id: 3, type: "income", amount: 12000000, description: "Bói bài Tarot", date: "2024-10-03" },
  { id: 4, type: "expense", amount: 3000000, description: "Mua bài Tarot mới", date: "2024-10-01" },
  { id: 5, type: "expense", amount: 1500000, description: "Điện nước", date: "2024-10-02" },
];

const menuItems = [
  { id: "employees", label: "👥 Nhân viên", icon: "👥" },
  { id: "departments", label: "🏢 Phòng ban", icon: "🏢" },
  { id: "contracts", label: "📄 Hợp đồng", icon: "📄" },
  { id: "packages", label: "💰 Gói lương %", icon: "💰" },
  { id: "salary", label: "🧮 Tính lương", icon: "🧮" },
  { id: "attendance", label: "📅 Chấm công", icon: "📅" },
  { id: "finance", label: "💵 Thu chi", icon: "💵" },
  { id: "performance", label: "⭐ Đánh giá", icon: "⭐" },
  { id: "reports", label: "📊 Báo cáo", icon: "📊" },
  { id: "customers", label: "🤝 Khách hàng", icon: "🤝" },
  { id: "bookings", label: "📅 Đặt lịch", icon: "📅" },
  { id: "services", label: "🔮 Dịch vụ", icon: "🔮" },
  { id: "inventory", label: "📦 Kho", icon: "📦" },
  { id: "reviews", label: "💬 Đánh giá", icon: "💬" },
  { id: "accounts", label: "🔑 Tài khoản", icon: "🔑" },
];

export default function Home() {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [packages, setPackages] = useState<SalaryPackage[]>(mockPackages);
  const [selectedTab, setSelectedTab] = useState<Tab>("employees");
  const [darkMode, setDarkMode] = useState(true);
  const [currentRole, setCurrentRole] = useState<Role | null>(null);
  const [showLogin, setShowLogin] = useState(true);
  const [revenue, setRevenue] = useState<number>(50000000);
  const [selectedEmployeePackages, setSelectedEmployeePackages] = useState<Map<number, number>>(new Map());
  const [finance, setFinance] = useState<FinanceRecord[]>(mockFinanceInit);
  const [attendance, setAttendance] = useState<Attendance[]>(mockAttendanceInit);
  const [departments, setDepartments] = useState<string[]>(mockDepartmentsInit);
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [services, setServices] = useState<Service[]>(mockServices);
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory);
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [accounts, setAccounts] = useState<UserAccount[]>(mockAccounts);
  const [loginError, setLoginError] = useState("");
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showPackageForm, setShowPackageForm] = useState(false);
  const [showFinanceForm, setShowFinanceForm] = useState(false);
  const [showDeptForm, setShowDeptForm] = useState(false);
  const [showAttendanceForm, setShowAttendanceForm] = useState(false);
  
  const [newEmployee, setNewEmployee] = useState({
    name: "", position: "", phone: "", startDate: "", department: "", contractType: "", skills: [] as string[],
  });

  const [newPackage, setNewPackage] = useState({ name: "", percentage: 0, description: "" });
  const [newFinance, setNewFinance] = useState({ type: "income" as "income" | "expense", amount: 0, description: "", date: "" });
  const [newDept, setNewDept] = useState("");
  const [newAttendance, setNewAttendance] = useState({ employeeId: 0, date: "", checkIn: "", checkOut: "", status: "present" as "present" | "absent" | "late" });

  const handleAddEmployee = () => {
    if (!newEmployee.name || !newEmployee.position) return;
    const id = editingId || Math.max(...employees.map(e => e.id), 0) + 1;
    setEmployees(editingId 
      ? employees.map(e => e.id === editingId ? { ...e, ...newEmployee, id: editingId } : e)
      : [...employees, { ...newEmployee, id, status: "active" }]
    );
    resetForms();
  };

  const handleEditEmployee = (emp: Employee) => {
    setNewEmployee({ name: emp.name, position: emp.position, phone: emp.phone, startDate: emp.startDate, department: emp.department, contractType: emp.contractType, skills: emp.skills });
    setEditingId(emp.id);
    setShowAddForm(true);
  };

  const handleDeleteEmployee = (id: number) => setEmployees(employees.filter((e) => e.id !== id));

  const handleLogin = () => {
    const account = accounts.find(a => a.username === loginUsername && a.password === loginPassword);
    if (account) {
      setCurrentRole(account.role);
      setShowLogin(false);
      setLoginError("");
      setLoginUsername("");
      setLoginPassword("");
    } else {
      setLoginError("❌ Tên đăng nhập hoặc mật khẩu không đúng!");
    }
  };

  const handleAddAccount = (username: string, password: string, role: Role) => {
    if (!username || !password) return;
    if (accounts.some(a => a.username === username)) {
      alert("Tên đăng nhập đã tồn tại!");
      return;
    }
    setAccounts([...accounts, { id: accounts.length + 1, username, password, role, createdAt: new Date().toISOString().split('T')[0] }]);
  };

  const handleDeleteAccount = (id: number) => setAccounts(accounts.filter(a => a.id !== id));

  const handleAddPackage = () => {
    if (!newPackage.name || !newPackage.percentage) return;
    const id = Math.max(...packages.map(p => p.id), 0) + 1;
    setPackages([...packages, { ...newPackage, id }]);
    setNewPackage({ name: "", percentage: 0, description: "" });
    setShowPackageForm(false);
  };

  const handleDeletePackage = (id: number) => setPackages(packages.filter(p => p.id !== id));

  const handleAddFinance = () => {
    if (!newFinance.amount || !newFinance.description) return;
    const id = Math.max(...finance.map(f => f.id), 0) + 1;
    setFinance([...finance, { ...newFinance, id }]);
    setNewFinance({ type: "income", amount: 0, description: "", date: "" });
    setShowFinanceForm(false);
  };

  const handleDeleteFinance = (id: number) => setFinance(finance.filter(f => f.id !== id));

  const handleAddDept = () => {
    if (!newDept) return;
    if (!departments.includes(newDept)) {
      setDepartments([...departments, newDept]);
    }
    setNewDept("");
    setShowDeptForm(false);
  };

  const handleDeleteDept = (dept: string) => {
    if (employees.some(e => e.department === dept)) {
      alert("Không thể xóa phòng ban có nhân viên!");
      return;
    }
    setDepartments(departments.filter(d => d !== dept));
  };

  const handleAddAttendance = () => {
    if (!newAttendance.employeeId || !newAttendance.date) return;
    const id = Math.max(...attendance.map(a => a.id), 0) + 1;
    setAttendance([...attendance, { ...newAttendance, id }]);
    setNewAttendance({ employeeId: 0, date: "", checkIn: "", checkOut: "", status: "present" });
    setShowAttendanceForm(false);
  };

  const handleDeleteAttendance = (id: number) => setAttendance(attendance.filter(a => a.id !== id));

  const handleAddCustomer = (customer: Omit<Customer, "id">) => {
    setCustomers([...customers, { ...customer, id: customers.length + 1 }]);
  };
  const handleDeleteCustomer = (id: number) => setCustomers(customers.filter(c => c.id !== id));
  
  const handleAddBooking = (booking: Omit<Booking, "id">) => {
    setBookings([...bookings, { ...booking, id: bookings.length + 1 }]);
  };
  const handleDeleteBooking = (id: number) => setBookings(bookings.filter(b => b.id !== id));
  
  const handleAddService = (service: Omit<Service, "id">) => {
    setServices([...services, { ...service, id: services.length + 1 }]);
  };
  const handleDeleteService = (id: number) => setServices(services.filter(s => s.id !== id));
  
  const handleUpdateInventory = (id: number, qty: number) => {
    setInventory(inventory.map(i => i.id === id ? { ...i, quantity: qty } : i));
  };
  const handleDeleteInventory = (id: number) => setInventory(inventory.filter(i => i.id !== id));

  const resetForms = () => {
    setNewEmployee({ name: "", position: "", phone: "", startDate: "", department: "", contractType: "", skills: [] });
    setEditingId(null);
    setShowAddForm(false);
  };

  const handleAssignPackage = (employeeId: number, percentage: number) => {
    const newMap = new Map(selectedEmployeePackages);
    newMap.set(employeeId, percentage);
    setSelectedEmployeePackages(newMap);
  };

  const totalIncome = finance.filter(f => f.type === "income").reduce((sum, f) => sum + f.amount, 0);
  const totalExpense = finance.filter(f => f.type === "expense").reduce((sum, f) => sum + f.amount, 0);
  const permissions = currentRole ? rolePermissions[currentRole] : null;
  const userTabs = permissions?.tabs || [];

  if (showLogin || !currentRole) {
    const bgGradient = darkMode 
      ? "background: radial-gradient(ellipse at center, #1a1a2e 0%, #0a0a0f 100%)"
      : "background: radial-gradient(ellipse at center, #e0e7ff 0%, #f1f5f9 100%)";
    const roles = [
      { id: "admin", name: "Admin", icon: "👑", desc: "Quản lý toàn diện", color: "from-purple-600 to-indigo-600" },
      { id: "manager", name: "Manager", icon: "🎯", desc: "Quản lý & Báo cáo", color: "from-violet-600 to-purple-600" },
      { id: "user", name: "User", icon: "👤", desc: "Nhân viên", color: "from-emerald-600 to-teal-600" },
    ];
    return (
      <div className="min-h-screen flex items-center justify-center" style={darkMode ? { background: '#0a0a0f' } : { background: '#f1f5f9' }}>
        <div className="glass-card p-10 max-w-lg w-full mx-4 text-center animate-fade-in">
          <div className="text-6xl mb-4">🔮</div>
          <h1 className={`text-3xl font-bold mb-2 ${darkMode ? 'gold-gradient' : 'text-purple-700'}`}>Bách Diệp Cổ Trấn</h1>
          <p className={`mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Hệ thống quản lý nhân viên & bói toán</p>
          
          <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>🗝️ Đăng nhập hệ thống - Chọn vai trò của bạn:</p>
          
          <div className="space-y-4 mb-8">
            <div>
              <input type="text" placeholder="Tên đăng nhập" value={loginUsername} onChange={(e) => setLoginUsername(e.target.value)} className="form-input px-4 py-3 w-full" />
            </div>
            <div>
              <input type="password" placeholder="Mật khẩu" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} className="form-input px-4 py-3 w-full" />
            </div>
            {loginError && <p className="text-red-400 text-sm">{loginError}</p>}
            <button onClick={handleLogin} className="w-full btn-glow py-3 text-lg">🚀 Đăng nhập</button>
            
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t" style={{ borderColor: darkMode ? '#333' : '#ddd' }}></div></div>
              <div className="relative flex justify-center text-sm"><span className={`px-2 ${darkMode ? 'bg-[#12121a]' : 'bg-white'} ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>hoặc chọn nhanh</span></div>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              {roles.map((role) => (
                <button 
                  key={role.id} 
                  onClick={() => { setCurrentRole(role.id as Role); setShowLogin(false); }} 
                  className={`p-2 rounded-lg bg-gradient-to-r ${role.color} hover:opacity-90 text-white text-sm`}
                >
                  {role.icon} {role.name}
                </button>
              ))}
            </div>
          </div>
          <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Tài khoản mặc định: admin/admin123, manager/manager123, user/user123</p>

          <div className="flex justify-center gap-4 pt-4 border-t" style={{ borderColor: darkMode ? '#333' : '#ddd' }}>
            <button onClick={() => setDarkMode(!darkMode)} className={`text-sm ${darkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}>
              {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex min-h-screen ${darkMode ? '' : 'light-mode'}`} style={darkMode ? { background: '#0a0a0f' } : { background: '#f1f5f9' }}>
      <aside className={`w-64 p-4 hidden md:block ${darkMode ? '' : 'light-sidebar'}`} style={darkMode ? { background: '#12121a', borderRight: '1px solid #27272a' } : { background: '#f8fafc', borderRight: '1px solid #e2e8f0' }}>
        <div className="mb-6 text-center pt-4 flex justify-between items-center">
          <div className="flex-1">
            <div className="text-3xl mb-2">🔮</div>
            <h1 className={`text-2xl font-bold ${darkMode ? 'gold-gradient' : 'text-purple-700'}`}>Bách Diệp</h1>
            <p className={`text-xs font-medium ${darkMode ? 'purple-gradient' : 'text-purple-500'}`}>Cổ Trấn</p>
          </div>
          <button onClick={() => setDarkMode(!darkMode)} className={`p-2 rounded-lg ${darkMode ? 'bg-purple-900 text-yellow-400' : 'bg-purple-100 text-purple-700'} text-xl`}>
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
        <nav className="space-y-2">
          {menuItems.filter(item => userTabs.includes(item.id as Tab)).map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedTab(item.id as Tab)}
              className={`w-full text-left sidebar-link ${selectedTab === item.id ? "active" : darkMode ? "text-gray-400" : "text-gray-600"}`}
              style={darkMode ? {} : { color: '#475569' }}
            >
              <span className="mr-2">{item.icon}</span>
              {item.label.split(" ")[1]}
            </button>
          ))}
        </nav>
        <div className="mt-8 pt-4 border-t" style={{ borderColor: '#27272a' }}>
          <button onClick={() => { setCurrentRole(null); setShowLogin(true); }} className={`w-full text-left text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'} hover:text-red-400`}>
            🚪 Đăng xuất
          </button>
        </div>
        <div className="mt-8 pt-4 border-t" style={{ borderColor: '#27272a' }}>
          <p className="text-xs text-center text-gray-500">✨ Quản lý & Tính lương</p>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-8 overflow-auto">
        <div className="max-w-6xl mx-auto">
          <header className="md:hidden mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🔮</span>
                <div>
                  <h1 className="text-xl font-bold gold-gradient">Bách Diệp Cổ Trấn</h1>
                </div>
              </div>
              <button onClick={() => setDarkMode(!darkMode)} className="btn-outline px-3 py-2 text-lg">
                {darkMode ? '☀️' : '🌙'}
              </button>
            </div>
            <nav className="flex gap-2 mt-3 overflow-x-auto pb-2">
              {menuItems.slice(0, 5).map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedTab(item.id as Tab)}
                  className={`px-3 py-2 rounded-lg text-sm whitespace-nowrap ${
                    selectedTab === item.id ? "btn-glow" : "btn-outline"
                  }`}
                >
                  {item.icon} {item.label.split(" ")[1]}
                </button>
              ))}
            </nav>
          </header>

          {selectedTab === "employees" && (
            <section className="animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">👥 <span className="purple-gradient">Danh sách nhân viên</span></h2>
                {permissions?.canAdd && (
                  <button onClick={() => { resetForms(); setShowAddForm(true); }} className="btn-glow px-5 py-2.5 text-sm">
                    + Thêm NV
                  </button>
                )}
              </div>
              {showAddForm && (
                <div className="glass-card p-6 mb-6 animate-fade-in">
                  <h3 className="font-semibold mb-4 gold-gradient text-lg">{editingId ? "✏️ Sửa nhân viên" : "➕ Thêm nhân viên mới"}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input type="text" placeholder="Họ tên" value={newEmployee.name} onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })} className="form-input px-4 py-3" />
                    <input type="text" placeholder="Chức vụ" value={newEmployee.position} onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })} className="form-input px-4 py-3" />
                    <input type="text" placeholder="Số điện thoại" value={newEmployee.phone} onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })} className="form-input px-4 py-3" />
                    <input type="date" value={newEmployee.startDate} onChange={(e) => setNewEmployee({ ...newEmployee, startDate: e.target.value })} className="form-input px-4 py-3" />
                    <select value={newEmployee.department} onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })} className="form-input px-4 py-3">
                      <option value="">Chọn phòng ban</option>
                      {departments.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <select value={newEmployee.contractType} onChange={(e) => setNewEmployee({ ...newEmployee, contractType: e.target.value })} className="form-input px-4 py-3">
                      <option value="">Loại hợp đồng</option>
                      {mockContracts.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="flex gap-3 mt-5">
                    <button onClick={handleAddEmployee} className="btn-glow px-6 py-2.5">💾 Lưu</button>
                    <button onClick={resetForms} className="btn-outline px-6 py-2.5">Huỷ</button>
                  </div>
                </div>
              )}
              <div className="glass-card overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="table-header">
                    <tr><th className="px-4 py-3 text-left">Tên</th><th className="px-4 py-3 text-left">Chức vụ</th><th className="px-4 py-3 text-left">Kỹ năng</th><th className="px-4 py-3 text-left">Phòng ban</th><th className="px-4 py-3 text-left">Ngày vào</th><th className="px-4 py-3 text-center">TT</th></tr>
                  </thead>
                  <tbody>
                    {employees.map(emp => (
                      <tr key={emp.id} className="table-row">
                        <td className="px-4 py-3 font-medium">{emp.name}</td>
                        <td className="px-4 py-3">{emp.position}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {emp.skills?.map((skill, i) => (
                              <span key={i} className="text-xs bg-purple-900 text-purple-200 px-2 py-0.5 rounded-full">{skill}</span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3">{emp.department}</td>
                        <td className="px-4 py-3">{emp.startDate}</td>
                        <td className="px-4 py-3 text-center"><span className="badge text-xs">Hoạt động</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {selectedTab === "departments" && (
<section className="animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">🏢 <span className="purple-gradient">Phòng ban</span></h2>
                <button onClick={() => setShowDeptForm(true)} className="btn-glow px-4 py-2 text-sm">+ Thêm PB</button>
              </div>
              {showDeptForm && (
                <div className="bg-neutral-800 p-4 rounded-lg mb-4 flex gap-2">
                  <input type="text" placeholder="Tên phòng ban mới" value={newDept} onChange={(e) => setNewDept(e.target.value)} className="bg-neutral-700 px-3 py-2 rounded-lg flex-1" />
                  <button onClick={handleAddDept} className="bg-emerald-600 px-4 py-2 rounded-lg">Lưu</button>
                  <button onClick={() => setShowDeptForm(false)} className="bg-neutral-700 px-4 py-2 rounded-lg">Hủy</button>
                </div>
              )}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {departments.map(dept => (
                  <div key={dept} className="stat-card p-5 flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-lg">{dept}</div>
                      <div className="text-sm text-gray-400">{employees.filter(e => e.department === dept).length} nhân viên</div>
                    </div>
                    <button onClick={() => handleDeleteDept(dept)} className="text-red-400 hover:text-red-300 p-2">🗑️</button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {selectedTab === "contracts" && (
            <section>
              <h2 className="text-xl font-semibold mb-4">Hợp đồng lao động</h2>
              <div className="bg-neutral-800 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-neutral-700">
                    <tr><th className="px-3 py-2 text-left">Nhân viên</th><th className="px-3 py-2 text-left">Loại HĐ</th><th className="px-3 py-2 text-left">Ngày ký</th><th className="px-3 py-2 text-left">Trạng thái</th><th className="px-3 py-2 text-center">Thao tác</th></tr>
                  </thead>
                  <tbody>
                    {employees.map(emp => (
                      <tr key={emp.id} className="border-t border-neutral-700">
                        <td className="px-3 py-2">{emp.name}</td>
                        <td className="px-3 py-2">
                          <select value={emp.contractType} onChange={(ev) => {
                            setEmployees(employees.map(emp2 => emp2.id === emp.id ? { ...emp2, contractType: ev.target.value } : emp2));
                          }} className="bg-neutral-700 px-2 py-1 rounded text-sm">
                            {mockContracts.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </td>
                        <td className="px-3 py-2">{emp.startDate}</td>
                        <td className="px-3 py-2 text-green-400">Còn hiệu lực</td>
                        <td className="px-3 py-2 text-center">
                          <button onClick={() => handleDeleteEmployee(emp.id)} className="text-red-400 text-xs">Xóa</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {selectedTab === "packages" && (
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Gói lương %</h2>
                <button onClick={() => { setNewPackage({ name: "", percentage: 0, description: "" }); setShowPackageForm(true); }} className="bg-emerald-600 px-4 py-2 rounded-lg text-sm">+ Thêm gói</button>
              </div>
              {showPackageForm && (
                <div className="bg-neutral-800 p-4 rounded-lg mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input type="text" placeholder="Tên gói" value={newPackage.name} onChange={(e) => setNewPackage({ ...newPackage, name: e.target.value })} className="bg-neutral-700 px-3 py-2 rounded-lg" />
                    <input type="number" placeholder="Phần trăm (%)" value={newPackage.percentage || ""} onChange={(e) => setNewPackage({ ...newPackage, percentage: Number(e.target.value) })} className="bg-neutral-700 px-3 py-2 rounded-lg" />
                    <input type="text" placeholder="Mô tả" value={newPackage.description} onChange={(e) => setNewPackage({ ...newPackage, description: e.target.value })} className="bg-neutral-700 px-3 py-2 rounded-lg" />
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button onClick={handleAddPackage} className="bg-emerald-600 px-4 py-2 rounded-lg">Lưu</button>
                    <button onClick={() => setShowPackageForm(false)} className="bg-neutral-700 px-4 py-2 rounded-lg">Hủy</button>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {packages.map(pkg => (
                  <div key={pkg.id} className="bg-neutral-800 p-4 rounded-lg">
                    <div className="flex justify-between">
                      <div className="text-3xl font-bold text-emerald-400">{pkg.percentage}%</div>
                      <button onClick={() => handleDeletePackage(pkg.id)} className="text-red-400 text-xs">Xóa</button>
                    </div>
                    <div className="font-semibold">{pkg.name}</div>
                    <div className="text-neutral-400 text-sm">{pkg.description}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {selectedTab === "salary" && (
            <section className="animate-fade-in">
              <h2 className="text-2xl font-semibold mb-6">🧮 <span className="purple-gradient">Tính lương theo %gói</span></h2>
              <div className="glass-card p-6 mb-6">
                <label className="block mb-3 text-gray-400">Tổng doanh thu tháng</label>
                <input type="number" value={revenue} onChange={(e) => setRevenue(Number(e.target.value))} className="form-input px-4 py-3 w-full md:w-72 text-lg" />
                <p className="gold-gradient text-xl mt-3 font-semibold">💰 {revenue.toLocaleString("vi-VN")}đ</p>
                <p className="text-gray-500 text-sm mt-2">✨ Công thức: Lương = Doanh thu × %gói</p>
              </div>
              <div className="bg-neutral-800 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-neutral-700">
                    <tr><th className="px-3 py-2 text-left">NV</th><th className="px-3 py-2 text-left">Gói %</th><th className="px-3 py-2 text-left">Doanh thu</th><th className="px-3 py-2 text-right">Lương (=DT × %)</th></tr>
                  </thead>
                  <tbody>
                    {employees.map(emp => {
                      const pkg = packages.find(p => p.id === selectedEmployeePackages.get(emp.id));
                      const percent = pkg?.percentage || 0;
                      const salary = revenue * (percent / 100);
                      return (
                        <tr key={emp.id} className="border-t border-neutral-700">
                          <td className="px-3 py-2">{emp.name}</td>
                          <td className="px-3 py-2">
                            {permissions?.canEditSalary ? (
                              <select value={selectedEmployeePackages.get(emp.id) || ""} onChange={(e) => handleAssignPackage(emp.id, Number(e.target.value))} className="bg-neutral-700 px-2 py-1 rounded text-sm">
                                <option value="">Chọn</option>
                                {packages.map(p => <option key={p.id} value={p.id}>{p.percentage}% - {p.name}</option>)}
                              </select>
                            ) : (
                              <span className="text-purple-400 font-medium">
                                {pkg ? `${pkg.percentage}% - ${pkg.name}` : "Chưa gán"}
                              </span>
                            )}
                          </td>
                          <td className="px-3 py-2 text-neutral-400">{revenue.toLocaleString("vi-VN")}đ × {percent}%</td>
                          <td className="px-3 py-2 text-right font-semibold text-emerald-400">{salary.toLocaleString("vi-VN")}đ</td>
                        </tr>
                      );
                    })}
                    <tr className="border-t border-neutral-600 bg-neutral-700">
                      <td className="px-3 py-2 font-semibold" colSpan={2}>Tổng</td>
                      <td className="px-3 py-2 text-right"></td>
                      <td className="px-3 py-2 text-right font-bold text-emerald-400">
                        {employees.reduce((sum, emp) => {
                          const pkg = packages.find(p => p.id === selectedEmployeePackages.get(emp.id));
                          return sum + (revenue * ((pkg?.percentage || 0) / 100));
                        }, 0).toLocaleString("vi-VN")}đ
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {selectedTab === "attendance" && (
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Chấm công</h2>
                <button onClick={() => setShowAttendanceForm(true)} className="bg-emerald-600 px-4 py-2 rounded-lg text-sm">+ Thêm</button>
              </div>
              {showAttendanceForm && (
                <div className="bg-neutral-800 p-4 rounded-lg mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <select value={newAttendance.employeeId} onChange={(e) => setNewAttendance({ ...newAttendance, employeeId: Number(e.target.value) })} className="bg-neutral-700 px-3 py-2 rounded-lg">
                      <option value={0}>Chọn nhân viên</option>
                      {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                    </select>
                    <input type="date" value={newAttendance.date} onChange={(e) => setNewAttendance({ ...newAttendance, date: e.target.value })} className="bg-neutral-700 px-3 py-2 rounded-lg" />
                    <input type="time" value={newAttendance.checkIn} onChange={(e) => setNewAttendance({ ...newAttendance, checkIn: e.target.value })} className="bg-neutral-700 px-3 py-2 rounded-lg" />
                    <input type="time" value={newAttendance.checkOut} onChange={(e) => setNewAttendance({ ...newAttendance, checkOut: e.target.value })} className="bg-neutral-700 px-3 py-2 rounded-lg" />
                    <select value={newAttendance.status} onChange={(e) => setNewAttendance({ ...newAttendance, status: e.target.value as any })} className="bg-neutral-700 px-3 py-2 rounded-lg">
                      <option value="present">Đúng giờ</option>
                      <option value="late">Muộn</option>
                      <option value="absent">Nghỉ</option>
                    </select>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button onClick={handleAddAttendance} className="bg-emerald-600 px-4 py-2 rounded-lg">Lưu</button>
                    <button onClick={() => setShowAttendanceForm(false)} className="bg-neutral-700 px-4 py-2 rounded-lg">Hủy</button>
                  </div>
                </div>
              )}
              <div className="bg-neutral-800 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-neutral-700">
                    <tr><th className="px-3 py-2 text-left">NV</th><th className="px-3 py-2 text-left">Ngày</th><th className="px-3 py-2 text-left">Giờ vào</th><th className="px-3 py-2 text-left">Giờ ra</th><th className="px-3 py-2 text-left">Trạng thái</th><th className="px-3 py-2 text-center">Thao tác</th></tr>
                  </thead>
                  <tbody>
                    {attendance.map(a => {
                      const emp = employees.find(e => e.id === a.employeeId);
                      return (
                        <tr key={a.id} className="border-t border-neutral-700">
                          <td className="px-3 py-2">{emp?.name}</td>
                          <td className="px-3 py-2">{a.date}</td>
                          <td className="px-3 py-2">{a.checkIn}</td>
                          <td className="px-3 py-2">{a.checkOut}</td>
                          <td className={`px-3 py-2 ${a.status === "present" ? "text-green-400" : a.status === "late" ? "text-yellow-400" : "text-red-400"}`}>
                            {a.status === "present" ? "Đúng giờ" : a.status === "late" ? "Muộn" : "Nghỉ"}
                          </td>
                          <td className="px-3 py-2 text-center">
                            <button onClick={() => handleDeleteAttendance(a.id)} className="text-red-400 text-xs">Xóa</button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {selectedTab === "finance" && (
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Thu chi</h2>
                <button onClick={() => { setNewFinance({ type: "income", amount: 0, description: "", date: "" }); setShowFinanceForm(true); }} className="bg-emerald-600 px-4 py-2 rounded-lg text-sm">+ Thêm</button>
              </div>
              {showFinanceForm && (
                <div className="bg-neutral-800 p-4 rounded-lg mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <select value={newFinance.type} onChange={(e) => setNewFinance({ ...newFinance, type: e.target.value as any })} className="bg-neutral-700 px-3 py-2 rounded-lg">
                      <option value="income">Thu</option>
                      <option value="expense">Chi</option>
                    </select>
                    <input type="date" value={newFinance.date} onChange={(e) => setNewFinance({ ...newFinance, date: e.target.value })} className="bg-neutral-700 px-3 py-2 rounded-lg" />
                    <input type="number" placeholder="Số tiền" value={newFinance.amount || ""} onChange={(e) => setNewFinance({ ...newFinance, amount: Number(e.target.value) })} className="bg-neutral-700 px-3 py-2 rounded-lg" />
                    <input type="text" placeholder="Mô tả" value={newFinance.description} onChange={(e) => setNewFinance({ ...newFinance, description: e.target.value })} className="bg-neutral-700 px-3 py-2 rounded-lg" />
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button onClick={handleAddFinance} className="bg-emerald-600 px-4 py-2 rounded-lg">Lưu</button>
                    <button onClick={() => setShowFinanceForm(false)} className="bg-neutral-700 px-4 py-2 rounded-lg">Hủy</button>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-neutral-800 p-4 rounded-lg">
                  <div className="text-neutral-400 text-sm">Tổng thu</div>
                  <div className="text-2xl font-bold text-green-400">{totalIncome.toLocaleString("vi-VN")}đ</div>
                </div>
                <div className="bg-neutral-800 p-4 rounded-lg">
                  <div className="text-neutral-400 text-sm">Tổng chi</div>
                  <div className="text-2xl font-bold text-red-400">{totalExpense.toLocaleString("vi-VN")}đ</div>
                </div>
              </div>
              <div className="bg-neutral-800 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-neutral-700">
                    <tr><th className="px-3 py-2 text-left">Ngày</th><th className="px-3 py-2 text-left">Loại</th><th className="px-3 py-2 text-left">Mô tả</th><th className="px-3 py-2 text-right">Số tiền</th><th className="px-3 py-2 text-center">Thao tác</th></tr>
                  </thead>
                  <tbody>
                    {finance.map(f => (
                      <tr key={f.id} className="border-t border-neutral-700">
                        <td className="px-3 py-2">{f.date}</td>
                        <td className={`px-3 py-2 ${f.type === "income" ? "text-green-400" : "text-red-400"}`}>
                          {f.type === "income" ? "Thu" : "Chi"}
                        </td>
                        <td className="px-3 py-2">{f.description}</td>
                        <td className="px-3 py-2 text-right">{f.amount.toLocaleString("vi-VN")}đ</td>
                        <td className="px-3 py-2 text-center">
                          <button onClick={() => handleDeleteFinance(f.id)} className="text-red-400 text-xs">Xóa</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {selectedTab === "performance" && (
            <section>
              <h2 className="text-xl font-semibold mb-4">Đánh giá hiệu suất</h2>
              <div className="bg-neutral-800 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-neutral-700">
                    <tr><th className="px-3 py-2 text-left">NV</th><th className="px-3 py-2 text-left">Xếp loại</th><th className="px-3 py-2 text-left">Ghi chú</th></tr>
                  </thead>
                  <tbody>
                    {employees.map(emp => {
                      const pkg = packages.find(p => p.id === selectedEmployeePackages.get(emp.id));
                      const rating = pkg ? Math.min(5, Math.floor(pkg.percentage / 3) + 1) : 2;
                      const stars = "⭐".repeat(rating);
                      const notes = rating >= 4 ? "Xuất sắc" : rating >= 3 ? "Hoàn thành tốt" : "Cần cải thiện";
                      return (
                        <tr key={emp.id} className="border-t border-neutral-700">
                          <td className="px-3 py-2">{emp.name}</td>
                          <td className="px-3 py-2 text-yellow-400">{stars}</td>
                          <td className="px-3 py-2 text-neutral-400">{notes}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {selectedTab === "reports" && permissions?.canViewReports && (
            <section className="animate-fade-in">
              <h2 className="text-2xl font-semibold mb-6">📊 <span className="purple-gradient">Báo cáo tổng hợp</span></h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="stat-card p-6 text-center">
                  <div className="text-gray-400 mb-2">👥 Tổng nhân viên</div>
                  <div className="stat-value text-5xl">{employees.length}</div>
                </div>
                <div className="stat-card p-6 text-center">
                  <div className="text-gray-400 mb-2">💰 Tổng lương (%gói)</div>
                  <div className="stat-value text-3xl">
                    {employees.reduce((sum, e) => {
                      const pkg = packages.find(p => p.id === selectedEmployeePackages.get(e.id));
                      return sum + (revenue * ((pkg?.percentage || 0) / 100));
                    }, 0).toLocaleString("vi-VN")}đ
                  </div>
                </div>
                <div className="stat-card p-6 text-center">
                  <div className="text-gray-400 mb-2">📈 Doanh thu tháng</div>
                  <div className="gold-gradient text-3xl">{revenue.toLocaleString("vi-VN")}đ</div>
                </div>
                <div className="stat-card p-6 text-center">
                  <div className="text-gray-400 mb-2">🎯 Lợi nhuận ước tính</div>
                  <div className="text-3xl" style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    {(revenue - totalExpense - employees.reduce((sum, e) => {
                      const pkg = packages.find(p => p.id === selectedEmployeePackages.get(e.id));
                      return sum + (revenue * ((pkg?.percentage || 0) / 100));
                    }, 0)).toLocaleString("vi-VN")}đ
                  </div>
                </div>
              </div>
            </section>
          )}

          {selectedTab === "customers" && permissions?.canAdd && (
            <section className="animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">🤝 <span className="purple-gradient">Khách hàng</span></h2>
                <button onClick={() => {}} className="btn-glow px-4 py-2 text-sm">+ Thêm KH</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {customers.map(c => (
                  <div key={c.id} className="stat-card p-5">
                    <div className="font-semibold text-lg">{c.name}</div>
                    <div className="text-sm text-gray-400">{c.phone}</div>
                    <div className="text-sm text-gray-500">{c.email}</div>
                    <div className="text-sm mt-2 text-gray-400">📝 {c.note}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {selectedTab === "bookings" && permissions?.canAdd && (
            <section className="animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">📅 <span className="purple-gradient">Đặt lịch</span></h2>
                <button onClick={() => {}} className="btn-glow px-4 py-2 text-sm">+ Thêm đặt lịch</button>
              </div>
              <div className="glass-card overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="table-header">
                    <tr><th className="px-4 py-3 text-left">KH</th><th className="px-4 py-3 text-left">NV</th><th className="px-4 py-3 text-left">Dịch vụ</th><th className="px-4 py-3 text-left">Ngày</th><th className="px-4 py-3 text-left">Giờ</th><th className="px-4 py-3 text-left">TT</th></tr>
                  </thead>
                  <tbody>
                    {bookings.map(b => {
                      const cust = customers.find(c => c.id === b.customerId);
                      const emp = employees.find(e => e.id === b.employeeId);
                      return (
                        <tr key={b.id} className="table-row">
                          <td className="px-4 py-3">{cust?.name}</td>
                          <td className="px-4 py-3">{emp?.name}</td>
                          <td className="px-4 py-3">{b.service}</td>
                          <td className="px-4 py-3">{b.date}</td>
                          <td className="px-4 py-3">{b.time}</td>
                          <td className="px-4 py-3">
                            <span className={`badge ${b.status === 'completed' ? 'bg-green-500' : b.status === 'confirmed' ? 'bg-blue-500' : b.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'}`}>
                              {b.status === 'confirmed' ? 'Xác nhận' : b.status === 'completed' ? 'Hoàn thành' : b.status === 'pending' ? 'Chờ' : 'Hủy'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {selectedTab === "services" && permissions?.canAdd && (
            <section className="animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">🔮 <span className="purple-gradient">Dịch vụ</span></h2>
                <button onClick={() => {}} className="btn-glow px-4 py-2 text-sm">+ Thêm DV</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map(s => (
                  <div key={s.id} className="stat-card p-5">
                    <div className="font-semibold text-lg">{s.name}</div>
                    <div className="gold-gradient text-xl">{s.price.toLocaleString("vi-VN")}đ</div>
                    <div className="text-sm text-gray-400">{s.duration} phút</div>
                    <div className="text-sm text-gray-500 mt-1">{s.description}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {selectedTab === "inventory" && permissions?.canAdd && (
            <section className="animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">📦 <span className="purple-gradient">Kho vật tư</span></h2>
                <button onClick={() => {}} className="btn-glow px-4 py-2 text-sm">+ Thêm</button>
              </div>
              <div className="glass-card overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="table-header">
                    <tr><th className="px-4 py-3 text-left">Tên vật tư</th><th className="px-4 py-3 text-right">Số lượng</th><th className="px-4 py-3 text-left">Đơn vị</th></tr>
                  </thead>
                  <tbody>
                    {inventory.map(i => (
                      <tr key={i.id} className="table-row">
                        <td className="px-4 py-3">{i.name}</td>
                        <td className="px-4 py-3 text-right font-semibold text-purple-400">{i.quantity}</td>
                        <td className="px-4 py-3">{i.unit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {selectedTab === "reviews" && (
            <section className="animate-fade-in">
              <h2 className="text-2xl font-semibold mb-6">💬 <span className="purple-gradient">Đánh giá từ khách</span></h2>
              <div className="glass-card overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="table-header">
                    <tr><th className="px-4 py-3 text-left">Khách hàng</th><th className="px-4 py-3 text-left">Nhân viên</th><th className="px-4 py-3 text-left">Đánh giá</th><th className="px-4 py-3 text-left">Bình luận</th><th className="px-4 py-3 text-left">Ngày</th></tr>
                  </thead>
                  <tbody>
                    {reviews.map(r => {
                      const cust = customers.find(c => c.id === r.customerId);
                      const emp = employees.find(e => e.id === r.employeeId);
                      return (
                        <tr key={r.id} className="table-row">
                          <td className="px-4 py-3">{cust?.name}</td>
                          <td className="px-4 py-3">{emp?.name}</td>
                          <td className="px-4 py-3 text-yellow-400">{"⭐".repeat(r.rating)}</td>
                          <td className="px-4 py-3 text-gray-400">{r.comment}</td>
                          <td className="px-4 py-3 text-gray-500">{r.date}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {selectedTab === "accounts" && (
            <section className="animate-fade-in">
              <h2 className="text-2xl font-semibold mb-6">🔐 <span className="purple-gradient">Quản lý tài khoản</span></h2>
              
              <div className="glass-card p-6 mb-6">
                <h3 className="font-semibold mb-4 gold-gradient">➕ Tạo tài khoản mới</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <input id="newUsername" type="text" placeholder="Tên đăng nhập" className="form-input px-4 py-3" />
                  <input id="newPassword" type="password" placeholder="Mật khẩu" className="form-input px-4 py-3" />
                  <select id="newRole" className="form-input px-4 py-3">
                    <option value="user">User - Nhân viên</option>
                    <option value="manager">Manager - Quản lý</option>
                    <option value="admin">Admin - Quản trị</option>
                  </select>
                  <button onClick={() => {
                    const username = (document.getElementById('newUsername') as HTMLInputElement).value;
                    const password = (document.getElementById('newPassword') as HTMLInputElement).value;
                    const role = (document.getElementById('newRole') as HTMLSelectElement).value as Role;
                    handleAddAccount(username, password, role);
                    (document.getElementById('newUsername') as HTMLInputElement).value = '';
                    (document.getElementById('newPassword') as HTMLInputElement).value = '';
                  }} className="btn-glow px-4 py-2">Tạo tài khoản</button>
                </div>
              </div>

              <div className="glass-card overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="table-header">
                    <tr><th className="px-4 py-3 text-left">Tên đăng nhập</th><th className="px-4 py-3 text-left">Vai trò</th><th className="px-4 py-3 text-left">Ngày tạo</th><th className="px-4 py-3 text-center">Thao tác</th></tr>
                  </thead>
                  <tbody>
                    {accounts.map(acc => (
                      <tr key={acc.id} className="table-row">
                        <td className="px-4 py-3 font-medium">{acc.username}</td>
                        <td className="px-4 py-3">
                          <span className={`badge ${acc.role === 'admin' ? 'bg-red-500' : acc.role === 'manager' ? 'bg-blue-500' : 'bg-green-500'}`}>
                            {acc.role === 'admin' ? '👑 Admin' : acc.role === 'manager' ? '🎯 Manager' : '👤 User'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-400">{acc.createdAt}</td>
                        <td className="px-4 py-3 text-center">
                          <button onClick={() => handleDeleteAccount(acc.id)} className="text-red-400 hover:text-red-300">🗑️ Xóa</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}