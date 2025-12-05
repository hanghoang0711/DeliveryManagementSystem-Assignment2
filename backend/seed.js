/**
 * Seed Script - Setup database và tạo admin user
 * Run: node seed.js
 */

const sql = require("mssql");
const bcrypt = require('bcryptjs');
const db = require('./models');

require('dotenv').config();

const sqlConfig = {
    user: process.env.SA_USER, 
    password: process.env.SA_PASSWORD,
    server: process.env.DB_SERVER || "localhost",
    database: "master",
    options: { 
        encrypt: false,
        trustServerCertificate: true // Thêm cái này nếu chạy local cho chắc
    }
};

// Step 1: Tạo SQL Server login và user
async function createManagerAccount() {
    try {
        await sql.connect(sqlConfig);

        // Tạo login
        await sql.query(`
            IF NOT EXISTS (SELECT * FROM sys.server_principals WHERE name = 'sManager')
            BEGIN
                CREATE LOGIN sManager WITH PASSWORD = '${process.env.DB_PASSWORD}';;
            END
        `);

        // Tạo user trong database chính
        await sql.query(`
            USE QuanLyGiaoHang_Nhom06;
            IF NOT EXISTS (SELECT * FROM sys.database_principals WHERE name = 'sManager')
            BEGIN
                CREATE USER sManager FOR LOGIN sManager;
                EXEC sp_addrolemember 'db_owner', 'sManager';
            END
        `);

        console.log("✅ Đã tạo tài khoản SQL Server (sManager) thành công!");
        await sql.close();
    } catch (err) {
        console.error("❌ Lỗi khi tạo SQL account:", err.message);
        throw err;
    }
}

// Step 2: Tạo admin user trong bảng User
async function seedAdminUser() {
    try {
        // Sync database
        await db.sequelize.sync();
        console.log('✅ Database synced');

        // Check if admin already exists
        const existingAdmin = await db.User.findOne({ where: { username: 'admin' } });
        
        if (existingAdmin) {
            console.log('⚠️  Admin user đã tồn tại, bỏ qua tạo mới');
            return;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash('admin123', 10);

        // Create admin user
        await db.User.create({
            username: 'admin',
            password: hashedPassword,
            role: 'admin'
        });

        console.log('✅ Admin user được tạo thành công!');
        console.log('   Username: admin');
        console.log('   Password: admin123');
        console.log('   Role: admin');
    } catch (err) {
        console.error("❌ Lỗi khi tạo admin user:", err.message);
        throw err;
    }
}

// Step 3: Seed NHANVIEN first (FK constraint requirement) - Use RAW SQL
async function seedNhanVien() {
    try {
        // ⭐ Use raw SQL to insert into NHANVIEN (singular, no timestamps)
        await db.sequelize.query(
            `IF NOT EXISTS (SELECT 1 FROM NHANVIEN WHERE Ma_nhan_vien = 'NV001')
             BEGIN
                 INSERT INTO NHANVIEN (
                     Ma_nhan_vien, 
                     Gioi_tinh,
                     Ho_va_ten_lot, 
                     Ten, 
                     Ngay_sinh, 
                     CCCD, 
                     Ngay_bat_dau_lam, 
                     Vai_tro,
                     Email,
                     SDT,
                     Dia_chi
                 )
                 VALUES (
                     'NV001',
                     N'Nam',
                     N'Nguyễn Văn', 
                     N'Quản Lý', 
                     '1990-01-01', 
                     '999999999999', 
                     '2020-01-01', 
                     N'Quản lý tài xế',
                     'nv001@example.com',
                     '0999999999',
                     N'Hà Nội'
                 )
             END`
        );
        console.log('✅ NHANVIEN NV001 được tạo thành công (raw SQL)');
    } catch (err) {
        console.error("❌ Lỗi khi tạo NHANVIEN:", err.message);
        throw err;
    }
}

// Step 4: Seed NHAN_VIEN_QUAN_LY_TAI_XE data (for driver FK constraint)
async function seedNhanVienQuanLyTaiXe() {
    try {
        // Check if NV001 already exists
        const existing = await db.NhanVienQuanLyTaiXe.findOne({ where: { Ma_nhan_vien: 'NV001' } });
        
        if (existing) {
            console.log('⚠️  Nhân viên quản lý NV001 đã tồn tại, bỏ qua tạo mới');
            return;
        }

        // Create manager employee record
        // Note: NHAN_VIEN_QUAN_LY_TAI_XE table only has 2 columns:
        // - Ma_nhan_vien (PK)
        // - So_luong_tai_xe_dang_phu_trach (default: 0)
        await db.NhanVienQuanLyTaiXe.create({
            Ma_nhan_vien: 'NV001',
            So_luong_tai_xe_dang_phu_trach: 0
        });

        console.log('✅ Nhân viên quản lý (NV001) được tạo thành công!');
        console.log('   Ma_nhan_vien: NV001');
        console.log('   So_luong_tai_xe_dang_phu_trach: 0');
    } catch (err) {
        console.error("❌ Lỗi khi tạo nhân viên quản lý:", err.message);
        throw err;
    }
}

// Main seed function
async function runSeed() {
    console.log('\n🌱 BẮT ĐẦU SEED DATABASE...\n');
    
    try {
        // Skip Step 1: sManager account đã tồn tại (không cần tạo lại)
        console.log('📌 Step 1: Skip - sManager account đã tồn tại');
        
        // Step 2: Tạo admin user
        console.log('\n📌 Step 2: Tạo admin user...');
        await seedAdminUser();
        
        // Step 3: Tạo NHANVIEN NV001 (FK requirement)
        console.log('\n📌 Step 3: Tạo NHANVIEN NV001...');
        await seedNhanVien();
        
        // Step 4: Tạo nhân viên quản lý tài xế
        console.log('\n📌 Step 4: Tạo nhân viên quản lý tài xế...');
        await seedNhanVienQuanLyTaiXe();
        
        console.log('\n🎉 HOÀN TẤT SEED DATABASE!\n');
        process.exit(0);
    } catch (err) {
        console.error('\n❌ SEED THẤT BẠI:', err);
        process.exit(1);
    }
}

runSeed();
