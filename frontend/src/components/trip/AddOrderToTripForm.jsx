import { useState } from 'react';
// Import CSS mới
import './AddOrderToTripForm.css';

// Import Feather Icons
import { X, Plus, Package, Truck, Info, User } from 'react-feather';

const AddOrderToTripForm = ({ trip, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    Ma_don_hang: '',
    Thu_tu_lay_hang: 1,
    Thu_tu_giao_hang: 1
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleClose = () => {
    if (onCancel) onCancel();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.Ma_don_hang.trim()) {
      newErrors.Ma_don_hang = 'Mã đơn hàng không được để trống';
    }

    if (formData.Thu_tu_lay_hang < 1) {
      newErrors.Thu_tu_lay_hang = 'Thứ tự lấy hàng phải >= 1';
    }

    if (formData.Thu_tu_giao_hang < 1) {
      newErrors.Thu_tu_giao_hang = 'Thứ tự giao hàng phải >= 1';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const submitData = {
        Ma_don_hang: formData.Ma_don_hang,
        Thu_tu_lay_hang: parseInt(formData.Thu_tu_lay_hang),
        Thu_tu_giao_hang: parseInt(formData.Thu_tu_giao_hang)
      };
      await onSubmit(submitData);
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content add-order-form-modal" onClick={(e) => e.stopPropagation()}>
        
        {/* HEADER */}
        <div className="modal-header" style={{display:'flex', justifyContent:'space-between', padding:'16px 24px', borderBottom:'1px solid #e2e8f0'}}>
          <h2 style={{margin:0, fontSize:'18px', display:'flex', alignItems:'center', gap:'10px', color:'#1e293b'}}>
             <Package size={20} color="#3B5998" /> 
             Thêm đơn hàng vào chuyến
          </h2>
          <button className="btn-close" onClick={handleClose} style={{background:'none', border:'none', cursor:'pointer'}}>
             <X size={20} color="#64748b" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="add-order-form">
          
          {/* Trip Info Box */}
          <div className="trip-info-box">
            <p><Truck size={14} color="#3B5998"/> <strong>Chuyến:</strong> {trip.Ma_chuyen_giao_hang || trip.DeliveryID}</p>
            <p><User size={14} color="#3B5998"/> <strong>Tài xế:</strong> {trip.ma_tai_xe}</p>
            <p><Info size={14} color="#3B5998"/> <strong>Số đơn hiện tại:</strong> {trip.orderCount || 0} đơn</p>
          </div>

          {/* Order ID */}
          <div className="form-group">
            <label htmlFor="Ma_don_hang">Mã đơn hàng <span className="required">*</span></label>
            <input
              type="text"
              id="Ma_don_hang"
              name="Ma_don_hang"
              value={formData.Ma_don_hang}
              onChange={handleChange}
              placeholder="Ví dụ: DH001"
              className={errors.Ma_don_hang ? 'input-error' : ''}
            />
            {errors.Ma_don_hang && <span className="error-message">{errors.Ma_don_hang}</span>}
          </div>

          {/* 2 Cột cho Thứ tự */}
          <div style={{display: 'flex', gap: '15px'}}>
              <div className="form-group" style={{flex:1}}>
                <label htmlFor="Thu_tu_lay_hang">Thứ tự lấy <span className="required">*</span></label>
                <input
                  type="number"
                  id="Thu_tu_lay_hang"
                  name="Thu_tu_lay_hang"
                  value={formData.Thu_tu_lay_hang}
                  onChange={handleChange}
                  min="1"
                  className={errors.Thu_tu_lay_hang ? 'input-error' : ''}
                />
              </div>
              <div className="form-group" style={{flex:1}}>
                <label htmlFor="Thu_tu_giao_hang">Thứ tự giao <span className="required">*</span></label>
                <input
                  type="number"
                  id="Thu_tu_giao_hang"
                  name="Thu_tu_giao_hang"
                  value={formData.Thu_tu_giao_hang}
                  onChange={handleChange}
                  min="1"
                  className={errors.Thu_tu_giao_hang ? 'input-error' : ''}
                />
              </div>
          </div>
          
          <small className="help-text" style={{marginTop:'-10px', marginBottom:'20px', display:'block'}}>
              Thứ tự 1, 2, 3... xác định lộ trình đi của tài xế.
          </small>

          {/* Actions */}
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={handleClose} disabled={submitting}>Hủy</button>
            <button type="submit" className="btn-submit" disabled={submitting}>
              <Plus size={18} /> {submitting ? 'Đang thêm...' : 'Thêm đơn hàng'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddOrderToTripForm;