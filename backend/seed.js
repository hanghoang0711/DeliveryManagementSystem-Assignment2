const sql = require("mssql");

const config = {
    user: "sa",  // bạn phải dùng sa để tạo tài khoản
    password: "Nhom6251",
    server: "ThuyHien",
    database: "QuanLyGiaoHang_Nhom06",
    options: { encrypt: false }
};

async function createManagerAccount() {
    try {
        await sql.connect(config);
        console.log(dbConfig.dialect) ;
        // tạo login
        await sql.query(`
            IF NOT EXISTS (SELECT * FROM sys.server_principals WHERE name = 'sManager')
            BEGIN
                CREATE LOGIN sManager WITH PASSWORD = 'Nhom6251';
            END
        `);

        // tạo user trong database chính
        await sql.query(`
            USE QuanLyGiaoHang_Nhom06;
            IF NOT EXISTS (SELECT * FROM sys.database_principals WHERE name = 'sManager')
            BEGIN
                CREATE USER sManager FOR LOGIN sManager;
                EXEC sp_addrolemember 'db_owner', 'sManager';
            END
        `);

        console.log("✅ Đã tạo tài khoản sManager thành công!");
        process.exit();
    } catch (err) {
        console.error("❌ Lỗi:", err);
        process.exit();
    }
}

createManagerAccount();
