import express from 'express';
import ProductManager from './ProductManager.js'; // Importa la clase ProductManager
const app = express();
app.use(express.urlencoded({extended:true}))
const port = 8080;

const productManager = new ProductManager('products.json'); // Crea una instancia de ProductManager con el archivo de productos existente


app.use(express.json());

// Endpoint para obtener productos
app.get('/products', async (req, res) => {
  try {
    const limit = req.query.limit; // Obtiene el valor del query param "limit"
    const products = await productManager.getProducts();
    
    if (limit) {
      const limitedProducts = products.slice(0, limit);
      res.json(limitedProducts);
    } else {
      res.json(products);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
});

// Endpoint para obtener un producto por ID
app.get('/products/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid); // Obtiene el ID del producto desde los parámetros de la URL
    const product = await productManager.getProductById(productId);
    
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
});

app.listen(port, () => {
  console.log(`Servidor Express en ejecución en el puerto ${port}`);
});
