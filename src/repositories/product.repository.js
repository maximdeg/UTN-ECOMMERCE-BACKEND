import Product from "../models/product.model.js";

// class ProductRepository {
//   /**
//    * Retrieves all active products from the database
//    * @returns {Promise<Product[]>} An array of all active products
//    */
//   static async getAll() {
//     return await Product.find({ active: true });
//   }

//   /**
//    * Retrieves a product by its id
//    * @param {string} id - Product identifier
//    * @returns {Promise<Product>} The product with the given id
//    */
//   static async getById(id) {
//     return await Product.findById(id);
//   }

//   /**
//    * Creates a new product in the database
//    * @param {Object} product_data - The data for the new product
//    * @returns {Promise<Product>} The newly created product
//    */
//   static async createProduct(product_data) {
//     const new_product = new Product(product_data);
//     return await new_product.save();
//   }

//   /**
//    * Updates a product in the database with new data
//    * @param {string} id - Product identifier
//    * @param {Object} new_product_data - The new data for the product
//    * @returns {Promise<Product>} The updated product
//    */
//   static async updateProductById(id, new_product_data) {
//     return await Product.findByIdAndUpdate(id, new_product_data, { new: true });
//   }

//   /**
//    * Deletes a product from the database by setting its 'active' property to false
//    * @param {string} id - Product identifier
//    * @returns {Promise<Product>} The product with 'active' set to false
//    */
//   static async deleteProductById(id) {
//     return await Product.findByIdAndUpdate(id, { active: false }, { new: true });
//   }
// }

// MYSQL Database Repository
import database_pool from "../db/configMysql.js";

class ProductRepository {
  static async getAll() {
    const query_string = "SELECT * FROM products WHERE active = true";
    const [rows, columns] = await database_pool.execute(query_string);
    // This will return two values(arrays)
    // The first one is the result of the query
    // The second one with the fields of the affected rows
    return rows;
  }

  static async getById(id) {
    const query_string = "SELECT * FROM products WHERE id = ?";
    // The question mark will be replaced with the id
    // Because the id is a string, we need to use the ?
    // To avoid SQL injection from wrong users
    const [rows] = await database_pool.execute(query_string, [id]);
    // The second parameter is an array with the id that I want to find
    return rows.length > 0 ? rows[0] : null;
  }

  static async createProduct(product_data) {
    const { name, description, category, price, stock, seller_id, image_base_64 } = product_data;
    const query_string = `
        INSERT INTO products 
        (name, description, category, price, stock, seller_id, image_base_64) 
        VALUES 
        ( ?, ?, ?, ?, ?, ?, ? )
        `;
    const [result] = await database_pool.execute(query_string, [name, description, category, price, stock, seller_id, image_base_64]);
    return { id: result.insertId, name, price, stock, description, seller_id, image_base_64, active: true };
  }
}

export default ProductRepository;
