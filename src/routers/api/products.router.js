import { Router } from 'express';
import { buildResponsePaginated } from '../../utils.js'
import ProductsManager from '../../dao/Products.manager.js';
import ProductModel from '../../models/product.model.js'

const router = Router();

const baseUrl = 'http://localhost:8080/'


router.get('/products', async (req, res) => {
  const { limit = 8, page = 1, sort, search } = req.query;
  const criteria = {};
  const options = { limit, page };

  if (sort) {
    options.sort = { price: sort };
  }

  if (search) {
    criteria.category = search;
  }

  const result = await ProductModel.paginate(criteria, options);

  // Pasa el parámetro 'search' en la llamada a buildResponsePaginated
  const data = buildResponsePaginated({ ...result, sort, search }, baseUrl, search, sort);
  res.status(200).json(data);
});

router.get('/products/:pid', async (req, res) => {
  try {
    const { pid } = req.params;
    const products = await ProductsManager.getProducts();
    const product = products.find((p) => p.id === parseInt(pid));

    if (product) {
      res.render('product', { product });
    } else {
      res.status(404).json({ message: 'No se ha encontrado el producto' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el producto', error: error.message });
  }
});


export default router;