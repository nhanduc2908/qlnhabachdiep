"use client";

import { useState } from "react";

interface Employee {
  id: number;
  name: string;
  position: string;
  phone: string;
  startDate: string;
  baseSalary: number;
  status: string;
}

interface SalaryPackage {
  id: number;
  name: string;
  percentage: number;
  description: string;
}

interface EmployeePackage {
  employeeId: number;
  packageId: number;
  percentage: number;
}

interface SalaryRecord {
  id: number;
  employeeId: number;
  month: number;
  year: number;
  totalSalary: number;
}

const mockEmployees: Employee[] = [
  { id: 1, name: "Nguyễn Văn A", position: "Quản lý", phone: "0912345678", startDate: "2024-01-15", baseSalary: 8000000, status: "active" },
  { id: 2, name: "Trần Thị B", position: "Hướng dẫn viên", phone: "0912345679", startDate: "2024-03-01", baseSalary: 5000000, status: "active" },
  { id: 3, name: "Lê Văn C", position: "Bảo vệ", phone: "0912345680", startDate: "2024-02-10", baseSalary: 4000000, status: "active" },
];

const mockPackages: SalaryPackage[] = [
  { id: 1, name: "Gói 5%", percentage: 5, description: "Nhân viên mới" },
  { id: 2, name: "Gói 10%", percentage: 10, description: "Nhân viên chính thức" },
  { id: 3, name: "Gói 15%", percentage: 15, description: "Nhân viên kinh nghiệm" },
  { id: 4, name: "Gói 20%", percentage: 20, description: "Quản lý" },
];

export default function Home() {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [packages, setPackages] = useState<SalaryPackage[]>(mockPackages);
  const [selectedTab, setSelectedTab] = useState<"employees" | "packages" | "salary">("employees");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [showPackageForm, setShowPackageForm] = useState(false);
  const [revenue, setRevenue] = useState<number>(50000000);
  const [selectedEmployeePackages, setSelectedEmployeePackages] = useState<Map<number, number>>(new Map());

  const [newEmployee, setNewEmployee] = useState({
    name: "",
    position: "",
    phone: "",
    startDate: "",
    baseSalary: 0,
  });

  const [newPackage, setNewPackage] = useState({
    name: "",
    percentage: 0,
    description: "",
  });

  const calculateSalary = (baseSalary: number, empId: number) => {
    const packagePercentage = selectedEmployeePackages.get(empId) || 0;
    const percentageAmount = (revenue * packagePercentage) / 100;
    return baseSalary + percentageAmount;
  };

  const handleAddEmployee = () => {
    if (!newEmployee.name || !newEmployee.position || !newEmployee.baseSalary) return;
    const id = employees.length + 1;
    setEmployees([...employees, { ...newEmployee, id, status: "active" }]);
    setNewEmployee({ name: "", position: "", phone: "", startDate: "", baseSalary: 0 });
    setShowAddForm(false);
  };

  const handleDeleteEmployee = (id: number) => {
    setEmployees(employees.filter((e) => e.id !== id));
  };

  const handleAddPackage = () => {
    if (!newPackage.name || !newPackage.percentage) return;
    const id = packages.length + 1;
    setPackages([...packages, { ...newPackage, id }]);
    setNewPackage({ name: "", percentage: 0, description: "" });
    setShowPackageForm(false);
  };

  const handleAssignPackage = (employeeId: number, percentage: number) => {
    const newMap = new Map(selectedEmployeePackages);
    newMap.set(employeeId, percentage);
    setSelectedEmployeePackages(newMap);
  };

  return (
    <main className="min-h-screen bg-neutral-900 text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-emerald-400">Bách Diệp Cổ Trấn</h1>
          <p className="text-neutral-400">Quản lý nhân viên & tính lương</p>
        </header>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setSelectedTab("employees")}
            className={`px-4 py-2 rounded-lg ${
              selectedTab === "employees" ? "bg-emerald-600" : "bg-neutral-800 hover:bg-neutral-700"
            }`}
          >
            Nhân viên
          </button>
          <button
            onClick={() => setSelectedTab("packages")}
            className={`px-4 py-2 rounded-lg ${
              selectedTab === "packages" ? "bg-emerald-600" : "bg-neutral-800 hover:bg-neutral-700"
            }`}
          >
            Gói lương %
          </button>
          <button
            onClick={() => setSelectedTab("salary")}
            className={`px-4 py-2 rounded-lg ${
              selectedTab === "salary" ? "bg-emerald-600" : "bg-neutral-800 hover:bg-neutral-700"
            }`}
          >
            Tính lương
          </button>
        </div>

        {selectedTab === "employees" && (
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Danh sách nhân viên</h2>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg"
              >
                + Thêm nhân viên
              </button>
            </div>

            {showAddForm && (
              <div className="bg-neutral-800 p-4 rounded-lg mb-4">
                <h3 className="font-semibold mb-3">Thêm nhân viên mới</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Họ tên"
                    value={newEmployee.name}
                    onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                    className="bg-neutral-700 px-3 py-2 rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Chức vụ"
                    value={newEmployee.position}
                    onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
                    className="bg-neutral-700 px-3 py-2 rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Số điện thoại"
                    value={newEmployee.phone}
                    onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                    className="bg-neutral-700 px-3 py-2 rounded-lg"
                  />
                  <input
                    type="date"
                    value={newEmployee.startDate}
                    onChange={(e) => setNewEmployee({ ...newEmployee, startDate: e.target.value })}
                    className="bg-neutral-700 px-3 py-2 rounded-lg"
                  />
                  <input
                    type="number"
                    placeholder="Lương cơ bản"
                    value={newEmployee.baseSalary || ""}
                    onChange={(e) => setNewEmployee({ ...newEmployee, baseSalary: Number(e.target.value) })}
                    className="bg-neutral-700 px-3 py-2 rounded-lg"
                  />
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={handleAddEmployee}
                    className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg"
                  >
                    Lưu
                  </button>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="bg-neutral-700 hover:bg-neutral-600 px-4 py-2 rounded-lg"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            )}

            <div className="bg-neutral-800 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-neutral-700">
                  <tr>
                    <th className="px-4 py-3 text-left">Tên</th>
                    <th className="px-4 py-3 text-left">Chức vụ</th>
                    <th className="px-4 py-3 text-left">Điện thoại</th>
                    <th className="px-4 py-3 text-left">Ngày vào</th>
                    <th className="px-4 py-3 text-right">Lương CB</th>
                    <th className="px-4 py-3 text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp) => (
                    <tr key={emp.id} className="border-t border-neutral-700">
                      <td className="px-4 py-3">{emp.name}</td>
                      <td className="px-4 py-3">{emp.position}</td>
                      <td className="px-4 py-3">{emp.phone}</td>
                      <td className="px-4 py-3">{emp.startDate}</td>
                      <td className="px-4 py-3 text-right">
                        {emp.baseSalary.toLocaleString("vi-VN")}đ
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleDeleteEmployee(emp.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          Xóa
                        </button>
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
              <h2 className="text-xl font-semibold">Gói lương phần trăm</h2>
              <button
                onClick={() => setShowPackageForm(true)}
                className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg"
              >
                + Thêm gói
              </button>
            </div>

            {showPackageForm && (
              <div className="bg-neutral-800 p-4 rounded-lg mb-4">
                <h3 className="font-semibold mb-3">Thêm gói lương mới</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Tên gói"
                    value={newPackage.name}
                    onChange={(e) => setNewPackage({ ...newPackage, name: e.target.value })}
                    className="bg-neutral-700 px-3 py-2 rounded-lg"
                  />
                  <input
                    type="number"
                    placeholder="Phần trăm (%)"
                    value={newPackage.percentage || ""}
                    onChange={(e) => setNewPackage({ ...newPackage, percentage: Number(e.target.value) })}
                    className="bg-neutral-700 px-3 py-2 rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Mô tả"
                    value={newPackage.description}
                    onChange={(e) => setNewPackage({ ...newPackage, description: e.target.value })}
                    className="bg-neutral-700 px-3 py-2 rounded-lg"
                  />
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={handleAddPackage}
                    className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg"
                  >
                    Lưu
                  </button>
                  <button
                    onClick={() => setShowPackageForm(false)}
                    className="bg-neutral-700 hover:bg-neutral-600 px-4 py-2 rounded-lg"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {packages.map((pkg) => (
                <div key={pkg.id} className="bg-neutral-800 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-emerald-400">{pkg.percentage}%</div>
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
              <label className="block mb-2">Doanh thu tháng</label>
              <input
                type="number"
                value={revenue}
                onChange={(e) => setRevenue(Number(e.target.value))}
                className="bg-neutral-700 px-3 py-2 rounded-lg w-full md:w-64"
              />
              <p className="text-neutral-400 text-sm mt-1">
                Doanh thu: {revenue.toLocaleString("vi-VN")}đ
              </p>
            </div>

            <div className="bg-neutral-800 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-neutral-700">
                  <tr>
                    <th className="px-4 py-3 text-left">Nhân viên</th>
                    <th className="px-4 py-3 text-left">Chức vụ</th>
                    <th className="px-4 py-3 text-left">Gói %</th>
                    <th className="px-4 py-3 text-right">Lương CB</th>
                    <th className="px-4 py-3 text-right">Phần trăm</th>
                    <th className="px-4 py-3 text-right">Tổng lương</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp) => {
                    const empPackage = packages.find(
                      (p) => p.id === selectedEmployeePackages.get(emp.id)
                    );
                    const percentAmount = revenue * ((empPackage?.percentage || 0) / 100);
                    const total = emp.baseSalary + percentAmount;
                    return (
                      <tr key={emp.id} className="border-t border-neutral-700">
                        <td className="px-4 py-3">{emp.name}</td>
                        <td className="px-4 py-3">{emp.position}</td>
                        <td className="px-4 py-3">
                          <select
                            value={selectedEmployeePackages.get(emp.id) || ""}
                            onChange={(e) =>
                              handleAssignPackage(
                                emp.id,
                                Number(e.target.value)
                              )
                            }
                            className="bg-neutral-700 px-2 py-1 rounded"
                          >
                            <option value="">Chọn gói</option>
                            {packages.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.percentage}% - {p.name}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3 text-right">
                          {emp.baseSalary.toLocaleString("vi-VN")}đ
                        </td>
                        <td className="px-4 py-3 text-right">
                          {percentAmount.toLocaleString("vi-VN")}đ
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-emerald-400">
                          {total.toLocaleString("vi-VN")}đ
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}