/* apps/api/prisma/seed.ts */
import { PrismaClient, ResourceType, SecurityLevel, RequestStatus, EmploymentType } from "@prisma/client";
import bcrypt from "bcryptjs";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

function randInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function sample<T>(arr: T[]) {
    return arr[randInt(0, arr.length - 1)];
}
function chance(p: number) {
    return Math.random() < p;
}
function dateBetween(from: Date, to: Date) {
    return new Date(from.getTime() + Math.random() * (to.getTime() - from.getTime()));
}

async function main() {
    console.log("🔄 Clearing existing data…");

    // Xóa theo thứ tự ràng buộc
    await prisma.trainingParticipant.deleteMany();
    await prisma.trainingSession.deleteMany();
    await prisma.overtime.deleteMany();
    await prisma.absence.deleteMany();
    await prisma.auditLog.deleteMany();
    await prisma.accessRequest.deleteMany();
    await prisma.userRole.deleteMany();
    await prisma.rolePermission.deleteMany();
    await prisma.permission.deleteMany();
    await prisma.resource.deleteMany();
    await prisma.refreshToken.deleteMany();
    await prisma.role.deleteMany();
    await prisma.user.deleteMany();

    console.log("✅ Cleared. Seeding base data…");

    // ---------- Roles ----------
    const [adminRole, managerRole, employeeRole] = await Promise.all([
        prisma.role.create({ data: { name: "Admin", description: "System administrator" } }),
        prisma.role.create({ data: { name: "Manager", description: "Team/Department manager" } }),
        prisma.role.create({ data: { name: "Employee", description: "Regular employee" } }),
    ]);

    // ---------- Permissions ----------
    const permsSpec = [
        { name: "users.read", resource: "users", action: "read" },
        { name: "users.write", resource: "users", action: "write" },
        { name: "resources.read", resource: "resources", action: "read" },
        { name: "resources.write", resource: "resources", action: "write" },
        { name: "access.approve", resource: "accessRequests", action: "approve" },
        { name: "audit.read", resource: "auditLogs", action: "read" },
        { name: "reports.read", resource: "reports", action: "read" },
    ];
    const permissions = await prisma.$transaction(
        permsSpec.map(p => prisma.permission.create({ data: p }))
    );

    // Gán quyền: Admin có tất cả, Manager có 1 phần, Employee chỉ read
    await prisma.$transaction([
        ...permissions.map(p => prisma.rolePermission.create({ data: { roleId: adminRole.id, permissionId: p.id } })),
        prisma.rolePermission.create({ data: { roleId: managerRole.id, permissionId: permissions.find(p => p.name === "users.read")!.id } }),
        prisma.rolePermission.create({ data: { roleId: managerRole.id, permissionId: permissions.find(p => p.name === "resources.read")!.id } }),
        prisma.rolePermission.create({ data: { roleId: managerRole.id, permissionId: permissions.find(p => p.name === "access.approve")!.id } }),
        prisma.rolePermission.create({ data: { roleId: managerRole.id, permissionId: permissions.find(p => p.name === "reports.read")!.id } }),
        prisma.rolePermission.create({ data: { roleId: employeeRole.id, permissionId: permissions.find(p => p.name === "resources.read")!.id } }),
    ]);

    // ---------- Users ----------
    const adminPasswordHash = await bcrypt.hash("Admin@123", 10);
    const adminUser = await prisma.user.create({
        data: {
            email: "admin@company.com",
            passwordHash: adminPasswordHash,
            firstName: "System",
            lastName: "Admin",
            department: "IT",
            position: "Administrator",
            employmentType: EmploymentType.full_time,
            accessLevel: "Admin",
            isActive: true,
            lastLogin: new Date(),
            roles: { create: [{ roleId: adminRole.id }] },
        },
    });

    const departments = ["Sales", "IT", "Finance", "HR", "Support", "Marketing", "Admin", "Other"];
    const positions = ["Executive", "Specialist", "Officer", "Engineer", "Analyst", "Coordinator", "Lead"];
    const employmentTypes = [EmploymentType.full_time, EmploymentType.part_time, EmploymentType.contractor];

    const employeeCount = 60;
    const users: { id: string; email: string; dept: string }[] = [];

    for (let i = 0; i < employeeCount; i++) {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const email = faker.internet.email({ firstName, lastName }).toLowerCase();
        const dept = sample(departments);
        const position = sample(positions);
        const accessLevel = chance(0.1) ? "Privileged" : "Standard";

        const u = await prisma.user.create({
            data: {
                email,
                passwordHash: await bcrypt.hash("User@123", 10),
                firstName, lastName,
                employeeId: faker.string.alphanumeric({ length: 8 }).toUpperCase(),
                department: dept,
                position,
                phone: faker.phone.number(),
                isActive: chance(0.95),
                accessLevel,
                lastLogin: chance(0.8) ? dateBetween(new Date(Date.now() - 1000 * 60 * 60 * 24 * 60), new Date()) : null,
                employmentType: sample(employmentTypes),
                roles: { create: [{ roleId: employeeRole.id }, ...(chance(0.15) ? [{ roleId: managerRole.id }] : [])] },
            },
            select: { id: true, email: true, department: true },
        });
        users.push({ id: u.id, email: u.email, dept: u.department ?? "Other" });
    }

    // Một số Manager thật sự (5 người từ users) để làm approver
    const managers = users.slice(0, 5).map(u => u.id);
    const fallbackApproverId = managers[0] ?? adminUser.id;

    // ---------- Resources ----------
    const resourceNames = [
        "Server Room A", "CRM System", "ERP SAP", "GitLab Repo", "S3 Bucket Finance",
        "HR Portal", "VPN Gateway", "Production Database", "Design NAS", "QA Cluster"
    ];
    const allResources = [];
    for (let i = 0; i < resourceNames.length; i++) {
        const r = await prisma.resource.create({
            data: {
                name: resourceNames[i],
                type: sample([ResourceType.physical, ResourceType.digital, ResourceType.system]),
                location: chance(0.7) ? faker.location.city() : null,
                securityLevel: sample([SecurityLevel.low, SecurityLevel.medium, SecurityLevel.high, SecurityLevel.critical]),
                accessSchedule: chance(0.5) ? { window: "9:00-18:00", tz: "Asia/Ho_Chi_Minh" } : undefined,
                isActive: chance(0.9),
            },
        });
        allResources.push(r);
    }

    // ---------- Access Requests ----------
    console.log("📥 Seeding Access Requests …");
    const reqPerUser = { min: 0, max: 3 };
    for (const u of users) {
        const n = randInt(reqPerUser.min, reqPerUser.max);
        for (let i = 0; i < n; i++) {
            const resource = sample(allResources);
            const start = dateBetween(new Date(Date.now() - 1000 * 60 * 60 * 24 * 90), new Date());
            const end = new Date(start.getTime() + randInt(1, 14) * 24 * 3600 * 1000);

            const r = await prisma.accessRequest.create({
                data: {
                    requesterId: u.id,
                    resourceId: resource.id,
                    purpose: faker.lorem.sentence(),
                    startDate: start,
                    endDate: end,
                    status: RequestStatus.pending,
                },
            });

            // Random chuyển trạng thái
            if (chance(0.6)) {
                const approved = chance(0.7);
                await prisma.accessRequest.update({
                    where: { id: r.id },
                    data: {
                        status: approved ? RequestStatus.approved : RequestStatus.rejected,
                        approverId: sample(managers) ?? fallbackApproverId,
                        approvedAt: new Date(r.createdAt.getTime() + randInt(1, 72) * 3600 * 1000),
                    },
                });
            }
        }
    }

    // ---------- Absence & Overtime ----------
    console.log("📊 Seeding Absence & Overtime for last 5 years …");
    const now = new Date();
    const start5y = new Date(now);
    start5y.setFullYear(now.getFullYear() - 5);

    for (const u of users) {
        // Absence: 3–12 bản ghi mỗi năm
        for (let y = now.getFullYear() - 4; y <= now.getFullYear(); y++) {
            const absCount = randInt(3, 12);
            for (let i = 0; i < absCount; i++) {
                const d = new Date(y, randInt(0, 11), randInt(1, 28));
                await prisma.absence.create({
                    data: {
                        userId: u.id,
                        date: d,
                        hours: sample([4, 8]),
                        type: sample(["sick", "vacation", "personal", "other"]),
                        approved: chance(0.9),
                    },
                });
            }
        }

        // Overtime: 8–24 bản ghi mỗi năm
        for (let y = now.getFullYear() - 4; y <= now.getFullYear(); y++) {
            const otCount = randInt(8, 24);
            for (let i = 0; i < otCount; i++) {
                const d = new Date(y, randInt(0, 11), randInt(1, 28));
                await prisma.overtime.create({
                    data: {
                        userId: u.id,
                        date: d,
                        hours: randInt(1, 5),
                        approved: chance(0.95),
                    },
                });
            }
        }
    }

    // ---------- Training ----------
    console.log("🎓 Seeding Trainings …");
    const trainingNames = [
        "Security Awareness", "Kubernetes Basics", "Advanced SQL", "Project Management",
        "Cloud Cost Optimization", "React Performance", "Data Privacy", "Leadership 101",
        "Time Management", "Domain-Driven Design"
    ];
    for (let i = 0; i < trainingNames.length; i++) {
        const start = dateBetween(start5y, now);
        const end = new Date(start.getTime() + randInt(1, 5) * 24 * 3600 * 1000);
        const cost = randInt(1_000, 20_000) * 100;     // cents
        const returns = chance(0.7) ? randInt(500, 15_000) * 100 : 0;

        const t = await prisma.trainingSession.create({
            data: {
                name: trainingNames[i],
                startDate: start,
                endDate: end,
                cost,
                returns,
            },
        });

        // chọn 5–20 người tham gia
        const participantCount = randInt(5, 20);
        const picks = faker.helpers.arrayElements(users, participantCount);
        await prisma.$transaction(
            picks.map(p => prisma.trainingParticipant.create({
                data: { trainingId: t.id, userId: p.id },
            }))
        );
    }

    // ---------- Audit Logs (một ít cho vui) ----------
    console.log("🧾 Seeding Audit Logs …");
    const actions = ["LOGIN", "LOGOUT", "READ_RESOURCE", "UPDATE_RESOURCE", "CREATE_ACCESS_REQUEST", "APPROVE_REQUEST", "REJECT_REQUEST"];
    for (let i = 0; i < 200; i++) {
        const actor = sample(users);
        const resource = chance(0.6) ? sample(allResources) : null;
        await prisma.auditLog.create({
            data: {
                userId: chance(0.9) ? actor.id : null,
                resourceId: resource?.id ?? null,
                action: sample(actions),
                ipAddress: faker.internet.ip(),
                userAgent: faker.internet.userAgent(),
                success: chance(0.95),
                details: chance(0.3) ? { extra: faker.lorem.words(3) } : undefined,
                createdAt: dateBetween(start5y, now),
            },
        });
    }

    console.log("✅ Seed done!");
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
