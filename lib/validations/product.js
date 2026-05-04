export const validateProductForm = (formData) => {
  const errors = {}
  
  if (!formData.name || formData.name.trim().length < 3) {
    errors.name = 'Product name must be at least 3 characters'
  }
  
  if (!formData.description || formData.description.trim().length < 10) {
    errors.description = 'Description must be at least 10 characters'
  }
  
  if (!formData.price || parseFloat(formData.price) <= 0) {
    errors.price = 'Price must be greater than 0'
  }
  
  if (formData.mrp && parseFloat(formData.mrp) < parseFloat(formData.price)) {
    errors.mrp = 'MRP must be greater than or equal to price'
  }
  
  if (formData.stock === undefined || formData.stock === null || formData.stock < 0) {
    errors.stock = 'Stock must be a non-negative number'
  }
  
  if (!formData.category_id) {
    errors.category_id = 'Category is required'
  }
  
  return { isValid: Object.keys(errors).length === 0, errors }
}

export const validateCategoryForm = (name, slug) => {
  const errors = {}
  
  if (!name || name.trim().length < 2) {
    errors.name = 'Category name must be at least 2 characters'
  }
  
  if (!slug || slug.trim().length < 2) {
    errors.slug = 'Slug is required'
  }
  
  return { isValid: Object.keys(errors).length === 0, errors }
}
