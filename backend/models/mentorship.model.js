module.exports = (sequelize, DataTypes) => {
  const Mentorship = sequelize.define("MENTORSHIP", {
    MentorID: { type: DataTypes.STRING(10), primaryKey: true },
    MenteeID: { type: DataTypes.STRING(10), primaryKey: true },
    Ngay_Bat_Dau: { type: DataTypes.DATEONLY, primaryKey: true },

    Ngay_Ket_Thuc: {
      type: DataTypes.DATEONLY,
      validate: {
        isAfterStart(value) {
          if (value && this.Ngay_Bat_Dau && value < this.Ngay_Bat_Dau) {
            throw new Error("Ngày kết thúc phải >= ngày bắt đầu");
          }
        }
      }
    },

    Muc_do_tien_bo: { type: DataTypes.STRING(100) },
    Danh_Gia: { type: DataTypes.TEXT }
  }, {
    tableName: "MENTORSHIP",
    timestamps: false
  });

  return Mentorship;
};
