import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Sparkles } from 'lucide-react';
import { Product, Category, Variant } from '../../types';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

interface ProductFormModalProps {
  product: Product | null;
  categories: Category[];
  onClose: () => void;
  onSuccess: () => void;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  product,
  categories,
  onClose,
  onSuccess
}) => {
  const isEditing = Boolean(product);
  const { showToast } = useToast();

  const [name, setName] = useState(product?.name || '');
  const [sku, setSku] = useState(product?.sku || '');
  const [brand, setBrand] = useState(product?.brand || 'Syvora Beauty');
  const [categoryId, setCategoryId] = useState<number>(product?.category_id || (categories[0]?.id || 1));
  const [price, setPrice] = useState<number>(product?.price || 50.0);
  const [salePrice, setSalePrice] = useState<string>(product?.sale_price ? String(product.sale_price) : '');
  const [costPrice, setCostPrice] = useState<string>(product?.cost_price ? String(product.cost_price) : '');
  const [stock, setStock] = useState<number>(product?.stock !== undefined ? product.stock : 25);
  const [lowStockThreshold, setLowStockThreshold] = useState<number>(product?.low_stock_threshold || 5);
  const [description, setDescription] = useState(product?.description || '');
  const [shortDescription, setShortDescription] = useState(product?.short_description || '');

  const [images, setImages] = useState<string[]>(
    product?.images && product.images.length ? product.images : ['https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80']
  );

  const [variants, setVariants] = useState<Variant[]>(product?.variants || []);
  const [ingredients, setIngredients] = useState(product?.ingredients || '');
  const [benefits, setBenefits] = useState(product?.benefits || '');
  const [howToUse, setHowToUse] = useState(product?.how_to_use || '');

  const [featured, setFeatured] = useState<boolean>(product?.featured || false);
  const [bestSeller, setBestSeller] = useState<boolean>(product?.best_seller || false);
  const [newArrival, setNewArrival] = useState<boolean>(product?.new_arrival || true);
  const [submitting, setSubmitting] = useState(false);

  // Auto generate SKU if empty
  const handleGenerateSku = () => {
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    setSku(`SYV-${name.slice(0, 3).toUpperCase() || 'BEAUTY'}-${random}`);
  };

  const handleAddImage = () => {
    setImages([...images, '']);
  };

  const handleUpdateImage = (index: number, val: string) => {
    const updated = [...images];
    updated[index] = val;
    setImages(updated);
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleAddVariant = () => {
    setVariants([...variants, { name: 'New Size', price }]);
  };

  const handleRemoveVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) {
      showToast('Name and price are required.', 'warning');
      return;
    }

    setSubmitting(true);
    const validImages = images.filter(img => img.trim().length > 0);

    const payload = {
      name,
      sku: sku || `SYV-${Date.now().toString().slice(-5)}`,
      brand,
      category_id: categoryId,
      price: parseFloat(String(price)),
      sale_price: salePrice ? parseFloat(salePrice) : null,
      cost_price: costPrice ? parseFloat(costPrice) : null,
      stock: parseInt(String(stock)),
      low_stock_threshold: parseInt(String(lowStockThreshold)),
      description,
      short_description: shortDescription,
      images: validImages.length ? validImages : ['https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80'],
      variants,
      ingredients,
      benefits,
      how_to_use: howToUse,
      featured,
      best_seller: bestSeller,
      new_arrival: newArrival,
      status: 'active'
    };

    try {
      if (isEditing && product) {
        await api.updateProduct(product.id, payload);
        showToast('Product updated successfully!', 'success');
      } else {
        await api.createProduct(payload);
        showToast('New product added to catalog!', 'success');
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      showToast(err.message || 'Failed to save product.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 flex items-center justify-center">
      <div className="fixed inset-0 bg-syvora-charcoal/60 backdrop-blur-xs" onClick={onClose} />

      <div className="relative bg-syvora-ivory border border-syvora-border shadow-2xl rounded-3xl max-w-4xl w-full p-6 sm:p-8 z-10 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center pb-4 border-b border-syvora-border mb-6">
          <h3 className="font-serif text-2xl font-bold text-syvora-charcoal">
            {isEditing ? 'Edit Product Details' : 'Add New Luxury Product'}
          </h3>
          <button onClick={onClose} className="p-2 text-syvora-muted hover:text-syvora-charcoal rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          {/* General Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold uppercase tracking-wider text-syvora-charcoal block mb-1">
                Product Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Syvora Hydrating Facial Elixir"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-white text-syvora-charcoal rounded-xl p-3 border border-syvora-border outline-none focus:border-syvora-rose font-medium"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-bold uppercase tracking-wider text-syvora-charcoal block">SKU Code</label>
                <button type="button" onClick={handleGenerateSku} className="text-[10px] text-syvora-rose font-bold hover:underline">
                  Auto Generate SKU
                </button>
              </div>
              <input
                type="text"
                placeholder="SYV-SKIN-001"
                value={sku}
                onChange={e => setSku(e.target.value)}
                className="w-full bg-white text-syvora-charcoal rounded-xl p-3 border border-syvora-border outline-none focus:border-syvora-rose font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold uppercase tracking-wider text-syvora-charcoal block mb-1">Brand Name</label>
              <input
                type="text"
                value={brand}
                onChange={e => setBrand(e.target.value)}
                className="w-full bg-white text-syvora-charcoal rounded-xl p-3 border border-syvora-border outline-none focus:border-syvora-rose"
              />
            </div>

            <div>
              <label className="font-bold uppercase tracking-wider text-syvora-charcoal block mb-1">Category *</label>
              <select
                value={categoryId}
                onChange={e => setCategoryId(parseInt(e.target.value))}
                className="w-full bg-white text-syvora-charcoal rounded-xl p-3 border border-syvora-border outline-none focus:border-syvora-rose font-medium"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-white/60 p-4 rounded-2xl border border-syvora-border">
            <div>
              <label className="font-bold uppercase tracking-wider text-syvora-charcoal block mb-1">Regular Price ($) *</label>
              <input
                type="number"
                step="0.01"
                required
                value={price}
                onChange={e => setPrice(parseFloat(e.target.value))}
                className="w-full bg-syvora-ivory text-syvora-charcoal rounded-xl p-2.5 border border-syvora-border outline-none font-bold text-syvora-rose"
              />
            </div>

            <div>
              <label className="font-bold uppercase tracking-wider text-syvora-charcoal block mb-1">Sale Price ($)</label>
              <input
                type="number"
                step="0.01"
                placeholder="Optional"
                value={salePrice}
                onChange={e => setSalePrice(e.target.value)}
                className="w-full bg-syvora-ivory text-syvora-charcoal rounded-xl p-2.5 border border-syvora-border outline-none"
              />
            </div>

            <div>
              <label className="font-bold uppercase tracking-wider text-syvora-charcoal block mb-1">Stock Level *</label>
              <input
                type="number"
                required
                value={stock}
                onChange={e => setStock(parseInt(e.target.value))}
                className="w-full bg-syvora-ivory text-syvora-charcoal rounded-xl p-2.5 border border-syvora-border outline-none font-bold"
              />
            </div>

            <div>
              <label className="font-bold uppercase tracking-wider text-syvora-charcoal block mb-1">Low Stock Alert</label>
              <input
                type="number"
                value={lowStockThreshold}
                onChange={e => setLowStockThreshold(parseInt(e.target.value))}
                className="w-full bg-syvora-ivory text-syvora-charcoal rounded-xl p-2.5 border border-syvora-border outline-none"
              />
            </div>
          </div>

          {/* Image Gallery URLs */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="font-bold uppercase tracking-wider text-syvora-charcoal">
                Product Image URLs (Unsplash / Licensed Image URLs)
              </label>
              <button
                type="button"
                onClick={handleAddImage}
                className="text-[11px] text-syvora-rose font-bold hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Image URL
              </button>
            </div>
            {images.map((img, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={img}
                  onChange={e => handleUpdateImage(idx, e.target.value)}
                  className="flex-1 bg-white text-syvora-charcoal rounded-xl p-2.5 border border-syvora-border outline-none"
                />
                {images.length > 1 && (
                  <button type="button" onClick={() => handleRemoveImage(idx)} className="p-2 text-rose-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Descriptions */}
          <div className="space-y-4">
            <div>
              <label className="font-bold uppercase tracking-wider text-syvora-charcoal block mb-1">Short Summary</label>
              <input
                type="text"
                placeholder="1-line headline description..."
                value={shortDescription}
                onChange={e => setShortDescription(e.target.value)}
                className="w-full bg-white text-syvora-charcoal rounded-xl p-3 border border-syvora-border outline-none"
              />
            </div>

            <div>
              <label className="font-bold uppercase tracking-wider text-syvora-charcoal block mb-1">Full Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full bg-white text-syvora-charcoal rounded-xl p-3 border border-syvora-border outline-none"
              />
            </div>
          </div>

          {/* Badges Toggle */}
          <div className="flex flex-wrap gap-6 pt-2 border-t border-syvora-border font-semibold">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={e => setFeatured(e.target.checked)}
                className="accent-syvora-rose w-4 h-4"
              />
              <span>Featured Product</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={bestSeller}
                onChange={e => setBestSeller(e.target.checked)}
                className="accent-syvora-rose w-4 h-4"
              />
              <span>Best Seller Badge</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={newArrival}
                onChange={e => setNewArrival(e.target.checked)}
                className="accent-syvora-rose w-4 h-4"
              />
              <span>New Arrival Tag</span>
            </label>
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-syvora-border flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl border border-syvora-border text-syvora-charcoal font-semibold hover:bg-syvora-champagne"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-syvora-charcoal hover:bg-syvora-rose text-syvora-ivory px-8 py-3 rounded-xl font-bold uppercase tracking-wider transition-colors shadow-luxury disabled:opacity-50 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> {isEditing ? 'Update Product' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
