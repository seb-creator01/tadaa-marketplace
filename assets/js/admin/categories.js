// ============================================
// TADAA! - CATEGORY MANAGEMENT
// ============================================

import { db } from '../config/firebase.js';
import { 
    collection, 
    addDoc, 
    getDocs, 
    doc, 
    updateDoc, 
    deleteDoc,
    query,
    orderBy
} from 'firebase/firestore';

// ===== State =====
let categories = [];
let editingCategoryId = null;

// ===== Load Categories =====
export async function loadCategories() {
    const container = document.getElementById('categoriesList');
    if (!container) return;
    
    container.innerHTML = '<p style="color: #9CA3AF;">Loading categories...</p>';
    
    try {
        const q = query(collection(db, 'categories'), orderBy('order', 'asc'));
        const snapshot = await getDocs(q);
        
        categories = [];
        snapshot.forEach(doc => {
            categories.push({ id: doc.id, ...doc.data() });
        });
        
        renderCategories();
        
    } catch (error) {
        console.error('Error loading categories:', error);
        container.innerHTML = `<p style="color: #EF4444;">Error loading categories: ${error.message}</p>`;
    }
}

// ===== Render Categories =====
function renderCategories() {
    const container = document.getElementById('categoriesList');
    if (!container) return;
    
    if (categories.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #9CA3AF;">
                <p style="font-size: 48px; margin-bottom: 16px;">📂</p>
                <p>No categories yet. Click "Add Category" to create one.</p>
            </div>
        `;
        return;
    }
    
    let html = `
        <div style="overflow-x: auto;">
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Slug</th>
                        <th>Description</th>
                        <th>Order</th>
                        <th>Featured</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    categories.forEach((cat, index) => {
        html += `
            <tr>
                <td>${index + 1}</td>
                <td><strong>${cat.name}</strong></td>
                <td>${cat.slug || cat.name.toLowerCase().replace(/ /g, '-')}</td>
                <td>${cat.description || '-'}</td>
                <td>${cat.order || 0}</td>
                <td>${cat.featured ? '✅' : '❌'}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editCategory('${cat.id}')">✏️ Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteCategory('${cat.id}')">🗑️ Delete</button>
                </td>
            </tr>
        `;
    });
    
    html += `
                </tbody>
            </table>
        </div>
    `;
    
    container.innerHTML = html;
}

// ===== Show Add/Edit Form =====
export function showCategoryForm(category = null) {
    const container = document.getElementById('categoriesList');
    if (!container) return;
    
    const isEdit = !!category;
    editingCategoryId = isEdit ? category.id : null;
    
    container.innerHTML = `
        <div class="admin-form" style="max-width: 100%;">
            <h4 style="font-family: 'Cormorant Garamond', serif; margin-bottom: 20px; font-size: 20px;">
                ${isEdit ? '✏️ Edit Category' : '➕ Add New Category'}
            </h4>
            <form id="categoryForm">
                <div class="form-group">
                    <label for="catName">Category Name *</label>
                    <input type="text" id="catName" value="${isEdit ? category.name : ''}" required placeholder="e.g., Electronics" />
                </div>
                
                <div class="form-group">
                    <label for="catSlug">Slug (URL-friendly)</label>
                    <input type="text" id="catSlug" value="${isEdit ? category.slug : ''}" placeholder="e.g., electronics (auto-generated if empty)" />
                    <small style="color: #6B7280;">Leave empty to auto-generate from name</small>
                </div>
                
                <div class="form-group">
                    <label for="catDescription">Description</label>
                    <input type="text" id="catDescription" value="${isEdit ? category.description || '' : ''}" placeholder="Brief description of this category" />
                </div>
                
                <div class="form-group">
                    <label for="catOrder">Display Order</label>
                    <input type="number" id="catOrder" value="${isEdit ? category.order || 0 : 0}" placeholder="0" />
                    <small style="color: #6B7280;">Lower numbers appear first</small>
                </div>
                
                <div class="form-group">
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                        <input type="checkbox" id="catFeatured" ${isEdit && category.featured ? 'checked' : ''} />
                        Featured Category (show on homepage)
                    </label>
                </div>
                
                <div style="display: flex; gap: 12px; margin-top: 16px;">
                    <button type="submit" class="btn btn-primary">
                        ${isEdit ? '💾 Update Category' : '➕ Add Category'}
                    </button>
                    <button type="button" class="btn btn-outline" onclick="cancelCategoryForm()">Cancel</button>
                </div>
            </form>
        </div>
    `;
    
    // Auto-generate slug from name
    document.getElementById('catName').addEventListener('input', function() {
        const slugInput = document.getElementById('catSlug');
        if (!slugInput.value || slugInput.dataset.auto === 'true') {
            slugInput.value = this.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
            slugInput.dataset.auto = 'true';
        }
    });
    
    // Handle form submission
    document.getElementById('categoryForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        await saveCategory();
    });
}

// ===== Save Category =====
async function saveCategory() {
    const name = document.getElementById('catName').value.trim();
    const slug = document.getElementById('catSlug').value.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const description = document.getElementById('catDescription').value.trim();
    const order = parseInt(document.getElementById('catOrder').value) || 0;
    const featured = document.getElementById('catFeatured').checked;
    
    if (!name) {
        alert('Category name is required!');
        return;
    }
    
    try {
        const data = {
            name,
            slug,
            description,
            order,
            featured,
            updatedAt: new Date().toISOString()
        };
        
        if (editingCategoryId) {
            // Update existing
            const docRef = doc(db, 'categories', editingCategoryId);
            await updateDoc(docRef, data);
            alert('✅ Category updated successfully!');
        } else {
            // Add new
            data.createdAt = new Date().toISOString();
            await addDoc(collection(db, 'categories'), data);
            alert('✅ Category added successfully!');
        }
        
        // Reload categories
        await loadCategories();
        
    } catch (error) {
        console.error('Error saving category:', error);
        alert('❌ Error saving category: ' + error.message);
    }
}

// ===== Edit Category =====
window.editCategory = function(categoryId) {
    const category = categories.find(c => c.id === categoryId);
    if (category) {
        showCategoryForm(category);
    }
};

// ===== Delete Category =====
window.deleteCategory = async function(categoryId) {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return;
    
    if (confirm(`Are you sure you want to delete "${category.name}"? This cannot be undone.`)) {
        try {
            await deleteDoc(doc(db, 'categories', categoryId));
            alert('✅ Category deleted successfully!');
            await loadCategories();
        } catch (error) {
            console.error('Error deleting category:', error);
            alert('❌ Error deleting category: ' + error.message);
        }
    }
};

// ===== Cancel Form =====
window.cancelCategoryForm = function() {
    loadCategories();
};

// ===== Make functions globally available =====
window.showCategoryForm = showCategoryForm;

// ===== Initialize on page load =====
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on the categories page
    if (document.getElementById('categoriesList')) {
        loadCategories();
    }
});

console.log('✅ Category management loaded!');
