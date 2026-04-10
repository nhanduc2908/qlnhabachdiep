"use client";

import { useState } from "react";

type Tab = "employees" | "packages" | "salary" | "attendance" | "finance" | "reports" | "departments" | "contracts" | "insurance" | "performance";

interface Employee {
  id: number;
  name: string;
  position: string;
  phone: string;
  startDate: string;
  status: string;
  department: string;
  contractType: string;
}

interface SalaryPackage {
  id: number;
  name: string;
  percentage: number;
  description: string;
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
  { id: 1, name: "Nguyễn Văn A", position: "Thầy Tarot", phone: "0912345678", startDate: "2024-01-15", status: "active", department: "Tarot", contractType: "HĐLĐ" },
  { id: 2, name: "Trần Thị B", position: "Thầy phong thủy", phone: "0912345679", startDate: "2024-03-01", status: "active", department: "Phong Thủy", contractType: "HĐLĐ" },
  { id: 3, name: "Lê Văn C", position: "Thầy xem bói", phone: "0912345680", startDate: "2024-02-10", status: "active", department: "Bói Toán", contractType: "HĐLĐ" },
  { id: 4, name: "Phạm Thị D", position: "Cô phù thủy", phone: "0912345681", startDate: "2024-04-01", status: "active", department: "Xăm Bùa", contractType: "HĐLĐ" },
  { id: 5, name: "Nguyễn Văn E", position: "Nhân viên lễ tân", phone: "0912345682", startDate: "2024-05-01", status: "active", department: "Lễ Tân", contractType: "Thử việc" },
  { id: 6, name: "Hoàng Thị F", position: "Hướng dẫn viên", phone: "0912345683", startDate: "2024-06-01", status: "active", department: "Hướng Dẫn", contractType: "HĐLĐ" },
];

const mockPackages: SalaryPackage[] = [
  { id: 1, name: "Gói Tân binh", percentage: 5, description: "Nhân viên mới" },
  { id: 2, name: "Gói Chính thức", percentage: 10, description: "Nhân viên chính thức" },
  { id: 3, name: "Gói Cao cấp", percentage: 15, description: "Thầy cô kinh nghiệm" },
  { id: 4, name: "Gói VIP", percentage: 20, description: "Trưởng phòng" },
];

const mockDepartmentsInit = ["Tarot", "Phong Thủy", "Bói Toán", "Xăm Bùa", "Lễ Tân", "Hướng Dẫn", "Kế Toán"];
const mockContracts = ["HĐLĐ", "Thử việc", "Hợp đồng thời vụ"];

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
  { id: "insurance", label: "🏥 BHXH", icon: "🏥" },
  { id: "finance", label: "💵 Thu chi", icon: "💵" },
  { id: "performance", label: "⭐ Đánh giá", icon: "⭐" },
  { id: "reports", label: "📊 Báo cáo", icon: "📊" },
];

export default function Home() {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [packages, setPackages] = useState<SalaryPackage[]>(mockPackages);
  const [selectedTab, setSelectedTab] = useState<Tab>("employees");
  const [revenue, setRevenue] = useState<number>(50000000);
  const [selectedEmployeePackages, setSelectedEmployeePackages] = useState<Map<number, number>>(new Map());
  const [finance, setFinance] = useState<FinanceRecord[]>(mockFinanceInit);
  const [attendance, setAttendance] = useState<Attendance[]>(mockAttendanceInit);
  const [departments, setDepartments] = useState<string[]>(mockDepartmentsInit);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showPackageForm, setShowPackageForm] = useState(false);
  const [showFinanceForm, setShowFinanceForm] = useState(false);
  const [showDeptForm, setShowDeptForm] = useState(false);
  const [showAttendanceForm, setShowAttendanceForm] = useState(false);
  
  const [newEmployee, setNewEmployee] = useState({
    name: "", position: "", phone: "", startDate: "", department: "", contractType: "",
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
    setNewEmployee({ name: emp.name, position: emp.position, phone: emp.phone, startDate: emp.startDate, department: emp.department, contractType: emp.contractType });
    setEditingId(emp.id);
    setShowAddForm(true);
  };

  const handleDeleteEmployee = (id: number) => setEmployees(employees.filter((e) => e.id !== id));

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

  const resetForms = () => {
    setNewEmployee({ name: "", position: "", phone: "", startDate: "", department: "", contractType: "" });
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

  return (
    <div className="flex min-h-screen bg-neutral-900">
      <aside className="w-64 bg-neutral-800 p-4 hidden md:block">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-emerald-400">Bách Diệp</h1>
          <p className="text-xs text-neutral-400">Cổ Trấn</p>
        </div>
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedTab(item.id as Tab)}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                selectedTab === item.id ? "bg-emerald-600 text-white" : "text-neutral-300 hover:bg-neutral-700"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-4 md:p-8 text-white overflow-auto">
        <div className="max-w-5xl mx-auto">
          <header className="md:hidden mb-6">
            <h1 className="text-2xl font-bold text-emerald-400">Bách Diệp Cổ Trấn</h1>
            <nav className="flex gap-2 mt-3 overflow-x-auto pb-2">
              {menuItems.slice(0, 5).map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedTab(item.id as Tab)}
                  className={`px-3 py-1 rounded-lg text-sm whitespace-nowrap ${
                    selectedTab === item.id ? "bg-emerald-600" : "bg-neutral-800"
                  }`}
                >
                  {item.icon} {item.label.split(" ")[1]}
                </button>
              ))}
            </nav>
          </header>

          {selectedTab === "employees" && (
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Danh sách nhân viên</h2>
                <button onClick={() => { resetForms(); setShowAddForm(true); }} className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg text-sm">
                  + Thêm NV
                </button>
              </div>
              {showAddForm && (
                <div className="bg-neutral-800 p-4 rounded-lg mb-4">
                  <h3 className="font-semibold mb-3">{editingId ? "Sửa nhân viên" : "Thêm nhân viên mới"}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input type="text" placeholder="Họ tên" value={newEmployee.name} onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })} className="bg-neutral-700 px-3 py-2 rounded-lg" />
                    <input type="text" placeholder="Chức vụ" value={newEmployee.position} onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })} className="bg-neutral-700 px-3 py-2 rounded-lg" />
                    <input type="text" placeholder="Số điện thoại" value={newEmployee.phone} onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })} className="bg-neutral-700 px-3 py-2 rounded-lg" />
                    <input type="date" value={newEmployee.startDate} onChange={(e) => setNewEmployee({ ...newEmployee, startDate: e.target.value })} className="bg-neutral-700 px-3 py-2 rounded-lg" />
                    <select value={newEmployee.department} onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })} className="bg-neutral-700 px-3 py-2 rounded-lg">
                      <option value="">Chọn phòng ban</option>
                      {departments.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <select value={newEmployee.contractType} onChange={(e) => setNewEmployee({ ...newEmployee, contractType: e.target.value })} className="bg-neutral-700 px-3 py-2 rounded-lg">
                      <option value="">Loại hợp đồng</option>
                      {mockContracts.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button onClick={handleAddEmployee} className="bg-emerald-600 px-4 py-2 rounded-lg">Lưu</button>
                    <button onClick={resetForms} className="bg-neutral-700 px-4 py-2 rounded-lg">Hủy</button>
                  </div>
                </div>
              )}
              <div className="bg-neutral-800 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-neutral-700">
                    <tr><th className="px-3 py-2 text-left">Tên</th><th className="px-3 py-2 text-left">Chức vụ</th><th className="px-3 py-2 text-left">Phòng ban</th><th className="px-3 py-2 text-left">Ngày vào</th><th className="px-3 py-2 text-center">TT</th><th className="px-3 py-2 text-center">Thao tác</th></tr>
                  </thead>
                  <tbody>
                    {employees.map(emp => (
                      <tr key={emp.id} className="border-t border-neutral-700">
                        <td className="px-3 py-2">{emp.name}</td>
                        <td className="px-3 py-2">{emp.position}</td>
                        <td className="px-3 py-2">{emp.department}</td>
                        <td className="px-3 py-2">{emp.startDate}</td>
                        <td className="px-3 py-2 text-center"><span className="text-green-400 text-xs">Đang hoạt động</span></td>
                        <td className="px-3 py-2 text-center">
                          <button onClick={() => handleEditEmployee(emp)} className="text-blue-400 text-xs mr-2">Sửa</button>
                          <button onClick={() => handleDeleteEmployee(emp.id)} className="text-red-400 text-xs">Xóa</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {selectedTab === "departments" && (
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Phòng ban</h2>
                <button onClick={() => setShowDeptForm(true)} className="bg-emerald-600 px-4 py-2 rounded-lg text-sm">+ Thêm PB</button>
              </div>
              {showDeptForm && (
                <div className="bg-neutral-800 p-4 rounded-lg mb-4 flex gap-2">
                  <input type="text" placeholder="Tên phòng ban mới" value={newDept} onChange={(e) => setNewDept(e.target.value)} className="bg-neutral-700 px-3 py-2 rounded-lg flex-1" />
                  <button onClick={handleAddDept} className="bg-emerald-600 px-4 py-2 rounded-lg">Lưu</button>
                  <button onClick={() => setShowDeptForm(false)} className="bg-neutral-700 px-4 py-2 rounded-lg">Hủy</button>
                </div>
              )}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {departments.map(dept => (
                  <div key={dept} className="bg-neutral-800 p-4 rounded-lg flex justify-between items-center">
                    <div>
                      <div className="font-semibold">{dept}</div>
                      <div className="text-neutral-400 text-sm">{employees.filter(e => e.department === dept).length} nhân viên</div>
                    </div>
                    <button onClick={() => handleDeleteDept(dept)} className="text-red-400 text-xs">Xóa</button>
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
            <section>
              <h2 className="text-xl font-semibold mb-4">Tính lương theo %gói</h2>
              <div className="bg-neutral-800 p-4 rounded-lg mb-4">
                <label className="block mb-2">Tổng doanh thu tháng</label>
                <input type="number" value={revenue} onChange={(e) => setRevenue(Number(e.target.value))} className="bg-neutral-700 px-3 py-2 rounded-lg w-full md:w-64" />
                <p className="text-emerald-400 text-lg mt-1">Doanh thu: {revenue.toLocaleString("vi-VN")}đ</p>
                <p className="text-neutral-400 text-sm">Công thức: Lương = Doanh thu × %gói</p>
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
                            <select value={selectedEmployeePackages.get(emp.id) || ""} onChange={(e) => handleAssignPackage(emp.id, Number(e.target.value))} className="bg-neutral-700 px-2 py-1 rounded text-sm">
                              <option value="">Chọn</option>
                              {packages.map(p => <option key={p.id} value={p.id}>{p.percentage}% - {p.name}</option>)}
                            </select>
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

          {selectedTab === "insurance" && (
            <section>
              <h2 className="text-xl font-semibold mb-4">Bảo hiểm xã hội</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-neutral-800 p-4 rounded-lg">
                  <div className="text-neutral-400 text-sm">Tổng NV tham gia BHXH</div>
                  <div className="text-2xl font-bold">{employees.filter(e => e.contractType === "HĐLĐ").length}</div>
                </div>
                <div className="bg-neutral-800 p-4 rounded-lg">
                  <div className="text-neutral-400 text-sm">Tỷ lệ đóng</div>
                  <div className="text-2xl font-bold">17%</div>
                </div>
              </div>
              <div className="bg-neutral-800 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-neutral-700">
                    <tr><th className="px-3 py-2 text-left">NV</th><th className="px-3 py-2 text-left">Mã BHXH</th><th className="px-3 py-2 text-left">Trạng thái</th></tr>
                  </thead>
                  <tbody>
                    {employees.filter(e => e.contractType === "HĐLĐ").map(emp => (
                      <tr key={emp.id} className="border-t border-neutral-700">
                        <td className="px-3 py-2">{emp.name}</td>
                        <td className="px-3 py-2">BHXH-{emp.id.toString().padStart(6, "0")}</td>
                        <td className="px-3 py-2 text-green-400">Đang tham gia</td>
                      </tr>
                    ))}
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

          {selectedTab === "reports" && (
            <section>
              <h2 className="text-xl font-semibold mb-4">Báo cáo</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-neutral-800 p-4 rounded-lg">
                  <div className="font-semibold mb-2">Tổng nhân viên</div>
                  <div className="text-3xl font-bold text-emerald-400">{employees.length}</div>
                </div>
                <div className="bg-neutral-800 p-4 rounded-lg">
                  <div className="font-semibold mb-2">Tổng lương (%gói)</div>
                  <div className="text-3xl font-bold text-emerald-400">
                    {employees.reduce((sum, e) => {
                      const pkg = packages.find(p => p.id === selectedEmployeePackages.get(e.id));
                      return sum + (revenue * ((pkg?.percentage || 0) / 100));
                    }, 0).toLocaleString("vi-VN")}đ
                  </div>
                </div>
                <div className="bg-neutral-800 p-4 rounded-lg">
                  <div className="font-semibold mb-2">Doanh thu tháng</div>
                  <div className="text-3xl font-bold text-emerald-400">{revenue.toLocaleString("vi-VN")}đ</div>
                </div>
                <div className="bg-neutral-800 p-4 rounded-lg">
                  <div className="font-semibold mb-2">Lợi nhuận ước tính</div>
                  <div className="text-3xl font-bold text-green-400">
                    {(revenue - totalExpense - employees.reduce((sum, e) => {
                      const pkg = packages.find(p => p.id === selectedEmployeePackages.get(e.id));
                      return sum + (revenue * ((pkg?.percentage || 0) / 100));
                    }, 0)).toLocaleString("vi-VN")}đ
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}