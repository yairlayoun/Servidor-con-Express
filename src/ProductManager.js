import fs from 'fs';
export default class ProductManager {
  constructor(filePath) {
      this.path = filePath;
  }

  // Agregar un producto
  addProduct(product) {
    const products = this.getProductsFromFile();
    product.id = this.generateId(products);
    products.push(product);
    this.saveProductsToFile(products);
  }

  // Obtener todos los productos
  getProducts() {
    return this.getProductsFromFile();
  }

  // Obtener un producto por ID
  getProductById(id) {
    const products = this.getProductsFromFile();
    const product = products.find((product) => product.id === id);
    if (!product) {
      throw new Error('Producto no encontrado.');
    }
    return product;
  }

  // Actualizar un producto por ID
  updateProduct(id, updatedProduct) {
    const products = this.getProductsFromFile();
    const index = products.findIndex((product) => product.id === id);
    if (index !== -1) {
      products[index] = { ...products[index], ...updatedProduct };
      this.saveProductsToFile(products);
    } else {
      throw new Error('Producto no encontrado. No se puede actualizar.');
    }
  }

  // Eliminar un producto por ID
  deleteProduct(id) {
    const products = this.getProductsFromFile();
    const updatedProducts = products.filter((product) => product.id !== id);
    if (updatedProducts.length === products.length) {
      // No se eliminó ningún producto, no lanzar excepción
      return;
    }
    
    this.saveProductsToFile(updatedProducts);
  }

  // Generar un nuevo ID autoincrementable
  generateId(products) {
    const maxId = products.reduce((max, product) => (product.id > max ? product.id : max), 0);
    return maxId + 1;
  }

  // Leer productos desde el archivo
  getProductsFromFile() {
    try {
      const data = fs.readFileSync(this.path, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  // Guardar productos en el archivo
  saveProductsToFile(products) {
    const data = JSON.stringify(products, null, 2);
    fs.writeFileSync(this.path, data);
  }
}

// Ejemplo de uso
const productManager = new ProductManager('products.json');

try {
  productManager.addProduct({
    title: 'Producto 1',
    description: 'Descripción 1',
    price: 10.99,
    thumbnail: 'imagen1.jpg',
    code: 'P1',
    stock: 100,
  });

  console.log('Lista de productos:', productManager.getProducts());
  console.log('Producto por ID:', productManager.getProductById(1));

  productManager.updateProduct(1, { price: 12.99, stock: 90 });

  console.log('Producto actualizado:', productManager.getProductById(1));

  productManager.deleteProduct(2); // Intentar eliminar un producto que no existe.
} catch (error) {
  console.error(error.message);
}
