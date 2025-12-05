const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Delivery Management System API',
      version: '1.0.0',
      description: 'RESTful API for Delivery Management System with Driver and Order Management',
      contact: {
        name: 'Development Team',
        email: 'team@example.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token from /api/auth/login'
        }
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Error message'
            }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['username', 'password'],
          properties: {
            username: {
              type: 'string',
              example: 'user_example'
            },
            password: {
              type: 'string',
              example: 'password123'
            }
          }
        },
        LoginResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Đăng nhập thành công!'
            },
            token: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
            }
          }
        },
        Driver: {
          type: 'object',
          required: ['DriverID', 'Ho_ten', 'CCCD', 'Ngay_Sinh', 'Ngay_Bat_Dau_Lam_Viec', 'Ma_Nhan_Vien_quan_li', 'Ngay_Bat_Dau_Quan_Ly'],
          properties: {
            DriverID: {
              type: 'string',
              readOnly: true,
              description: 'Driver ID (auto-generated)'
            },
            Ho_ten: {
              type: 'string',
              example: 'Nguyen Van Test Driver',
              description: 'Full name'
            },
            CCCD: {
              type: 'string',
              example: '123456789898',
              description: 'Citizen ID (12 digits)'
            },
            Gioi_Tinh: {
              type: 'string',
              enum: ['Nam', 'Nữ', 'Khác'],
              example: 'Nam',
              description: 'Gender'
            },
            Ngay_Sinh: {
              type: 'string',
              format: 'date',
              example: '1990-01-01',
              description: 'Date of birth (must be >= 18 years old)'
            },
            Ngay_Bat_Dau_Lam_Viec: {
              type: 'string',
              format: 'date',
              example: '2020-01-01',
              description: 'Start working date'
            },
            Rating: {
              type: 'number',
              format: 'decimal',
              example: 5.0,
              description: 'Rating (0-5)',
              default: 5.0
            },
            Ma_Nhan_Vien_quan_li: {
              type: 'string',
              example: 'NV0002',
              description: 'Manager employee ID'
            },
            Trang_Thai: {
              type: 'string',
              example: 'Sẵn sàng',
              description: 'Driver status',
              default: 'Sẵn sàng'
            },
            Ngay_Bat_Dau_Quan_Ly: {
              type: 'string',
              format: 'date',
              example: '2020-01-01',
              description: 'Management start date'
            }
          }
        },
        Order: {
          type: 'object',
          required: ['Ma_khach_hang', 'SDT_nguoi_nhan', 'ten_nguoi_nhan', 'dia_chi_lay_hang', 'dia_chi_giao_hang', 'can_nang', 'gia_tri_hang_hoa_phi_van_chuyen', 'Thoi_gian_giao_hang_du_kien'],
          properties: {
            Ma_khach_hang: {
              type: 'string',
              example: 'KH1',
              description: 'Customer ID'
            },
            SDT_nguoi_nhan: {
              type: 'string',
              example: '0912345678',
              description: 'Receiver phone number'
            },
            ten_nguoi_nhan: {
              type: 'string',
              example: 'Nguyễn Văn A',
              description: 'Receiver name'
            },
            dia_chi_lay_hang: {
              type: 'string',
              example: '123 ABC Street, District 1',
              description: 'Pickup address'
            },
            dia_chi_giao_hang: {
              type: 'string',
              example: '456 XYZ Street, District 3',
              description: 'Delivery address'
            },
            can_nang: {
              type: 'number',
              format: 'decimal',
              example: 2.5,
              description: 'Weight (kg)'
            },
            gia_tri_hang_hoa_phi_van_chuyen: {
              type: 'number',
              format: 'decimal',
              example: 250000,
              description: 'Order value + shipping fee (VND)'
            },
            phuong_thuc_giao_hang: {
              type: 'string',
              example: 'Nhanh',
              description: 'Delivery method'
            },
            Thoi_gian_giao_hang_du_kien: {
              type: 'string',
              format: 'date-time',
              example: '2025-12-31T14:00:00',
              description: 'Expected delivery time'
            },
            Thoi_gian_lay_hang_du_kien: {
              type: 'string',
              format: 'date-time',
              example: '2025-12-30T10:00:00',
              description: 'Expected pickup time (optional)'
            }
          }
        },
        ChuyenGiaoHang: {
          type: 'object',
          required: ['DriverID'],
          properties: {
            DeliveryID: {
              type: 'string',
              example: 'CGH001',
              description: 'Delivery trip ID (auto-generated)'
            },
            DriverID: {
              type: 'string',
              example: 'DRV001',
              description: 'Driver ID'
            },
            so_luong_don_gop: {
              type: 'integer',
              example: 0,
              description: 'Number of orders grouped (default 0)'
            },
            TrangThaiChuyen: {
              type: 'string',
              enum: ['Đang thực hiện', 'Hoàn thành', 'Đã hủy'],
              example: 'Đang thực hiện',
              description: 'Trip status'
            },
            tong_quang_duong_tinh_toan: {
              type: 'string',
              example: '25.50',
              description: 'Total distance calculated (km)'
            }
          }
        },
        AddOrderToDelivery: {
          type: 'object',
          required: ['Ma_don_hang', 'Thu_tu_lay_hang', 'Thu_tu_giao_hang'],
          properties: {
            Ma_don_hang: {
              type: 'string',
              example: 'DH001',
              description: 'Order ID to add to delivery trip'
            },
            Thu_tu_lay_hang: {
              type: 'integer',
              example: 1,
              description: 'Pickup sequence number'
            },
            Thu_tu_giao_hang: {
              type: 'integer',
              example: 1,
              description: 'Delivery sequence number'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./routes/*.js', './controllers/*.js'] // Path to API routes
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
