import { useState } from 'react';
import DataTable from '../../components/DataTable';
import FormModal from '../../components/FormModal';
import { getProducts, formatCurrency } from '../../utils/dataLoader';
import './MasterPage.css';

const Products = () => {
  const [products, setProducts] = useState(getProducts());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Furniture',
    unit: 'Piece',
    salePrice: 0,
    purchasePrice: 0,
    stockQuantity: 0
  });

  const columns = [
    { key: 'name', header: 'Product Name', width: '25%' },
    { key: 'category', header: 'Category', width: '15%' },
    { key: 'unit', header: 'Unit', width: '10%' },
    {
      key: 'salePrice',
      header: 'Sale Price',
      type: 'currency',
      width: '15%'
    },
    {
      key: 'purchasePrice',
      header: 'Purchase Price',
      type: 'currency',
      width: '15%'
    },
    { key: 'stockQuantity', header: 'Stock', width: '10%' }
  ];

  const handleAdd = () => {
    setSelectedProduct(null);
    setFormData({
      name: '',
      category: 'Furniture',
      unit: 'Piece',
      salePrice: 0,
      purchasePrice: 0,
      stockQuantity: 0
    });
    setIsModalOpen(true);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      unit: product.unit,
      salePrice: product.salePrice,
      purchasePrice: product.purchasePrice,
      stockQuantity: product.stockQuantity
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (selectedProduct) {
      setProducts(products.map(p =>
        p.id === selectedProduct.id ? { ...selectedProduct, ...formData } : p
      ));
    } else {
      const newProduct = {
        id: Math.max(...products.map(p => p.id)) + 1,
        ...formData
      };
      setProducts([...products, newProduct]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="master-page">
      <div className="master-page-header">
        <div>
          <h1 className="master-page-title">Products</h1>
          <p className="master-page-subtitle">Manage product catalog</p>
        </div>
        <button className="btn btn-primary" onClick={handleAdd}>
          + Add Product
        </button>
      </div>

      <DataTable
        data={products}
        columns={columns}
        actions={(row) => (
          <button
            className="btn-link"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(row);
            }}
          >
            Edit
          </button>
        )}
      />

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedProduct ? 'Edit Product' : 'Add Product'}
        size="medium"
      >
        <div className="form-group">
          <label className="form-label">Product Name</label>
          <input
            type="text"
            className="form-input"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Category</label>
          <input
            type="text"
            className="form-input"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Unit</label>
          <select
            className="form-select"
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
          >
            <option value="Piece">Piece</option>
            <option value="Set">Set</option>
            <option value="Kg">Kg</option>
            <option value="Meter">Meter</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Sale Price (₹)</label>
          <input
            type="number"
            step="0.01"
            className="form-input"
            value={formData.salePrice}
            onChange={(e) => setFormData({ ...formData, salePrice: parseFloat(e.target.value) || 0 })}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Purchase Price (₹)</label>
          <input
            type="number"
            step="0.01"
            className="form-input"
            value={formData.purchasePrice}
            onChange={(e) => setFormData({ ...formData, purchasePrice: parseFloat(e.target.value) || 0 })}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Stock Quantity</label>
          <input
            type="number"
            className="form-input"
            value={formData.stockQuantity}
            onChange={(e) => setFormData({ ...formData, stockQuantity: parseInt(e.target.value) || 0 })}
          />
        </div>
        <div className="form-actions">
          <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            Save
          </button>
        </div>
      </FormModal>
    </div>
  );
};

export default Products;
