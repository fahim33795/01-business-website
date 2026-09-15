import db from '../config/database.js';

export function getCategories(req, res) {
  try {
    const { includeInactive } = req.query;
    let query = "SELECT c.*, COUNT(p.id) as product_count FROM categories c LEFT JOIN products p ON c.id = p.category_id AND p.status = 'active'";
    
    if (!includeInactive) {
      query += " WHERE c.status = 'active'";
    }

    query += " GROUP BY c.id ORDER BY c.name ASC";

    const stmt = db.prepare(query);
    const categories = stmt.all();

    res.json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch categories.' });
  }
}

export function createCategory(req, res) {
  try {
    const { name, image, description, status = 'active' } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required.' });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const stmt = db.prepare(`
      INSERT INTO categories (name, slug, image, description, status)
      VALUES (?, ?, ?, ?, ?)
    `);

    const info = stmt.run(name, slug, image || '', description || '', status);

    res.status(201).json({
      success: true,
      message: 'Category created successfully.',
      category: { id: info.lastInsertRowid, name, slug, image, description, status }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create category.' });
  }
}

export function updateCategory(req, res) {
  try {
    const { id } = req.params;
    const { name, image, description, status } = req.body;

    const existingStmt = db.prepare('SELECT * FROM categories WHERE id = ?');
    const existing = existingStmt.get(id);

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    const updatedName = name || existing.name;
    const slug = updatedName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const stmt = db.prepare(`
      UPDATE categories
      SET name = ?, slug = ?, image = COALESCE(?, image), description = COALESCE(?, description), status = COALESCE(?, status)
      WHERE id = ?
    `);

    stmt.run(updatedName, slug, image, description, status, id);

    res.json({ success: true, message: 'Category updated successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update category.' });
  }
}

export function deleteCategory(req, res) {
  try {
    const { id } = req.params;
    const stmt = db.prepare('DELETE FROM categories WHERE id = ?');
    stmt.run(id);

    res.json({ success: true, message: 'Category deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete category.' });
  }
}
