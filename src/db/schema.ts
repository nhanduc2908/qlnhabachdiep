import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const employees = sqliteTable("employees", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  position: text("position").notNull(),
  phone: text("phone"),
  startDate: integer("start_date", { mode: "timestamp" }).notNull(),
  baseSalary: integer("base_salary").notNull(),
  status: text("status").default("active"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const salaryPackages = sqliteTable("salary_packages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  percentage: real("percentage").notNull(),
  description: text("description"),
});

export const employeePackages = sqliteTable("employee_packages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  employeeId: integer("employee_id").notNull().references(() => employees.id),
  packageId: integer("package_id").notNull().references(() => salaryPackages.id),
  effectiveDate: integer("effective_date", { mode: "timestamp" }).notNull(),
});

export const salaryRecords = sqliteTable("salary_records", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  employeeId: integer("employee_id").notNull().references(() => employees.id),
  month: integer("month").notNull(),
  year: integer("year").notNull(),
  totalSalary: integer("total_salary").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});