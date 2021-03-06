import nc from 'next-connect';
import db from '../../../../utils/db';
import Product from '../../../../models/Product';
import { isAuth, isAdmin } from '../../../../utils/auth';

const handler = nc();
handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
  await db.connect();
  const products = await Product.find({});
  await db.disconnect();
  res.send(products);
});

handler.post(async (req, res) => {
  await db.connect();

  const newProduct = new Product({
    name: 'sample name',
    slug: 'sample-slug' + Math.random(),
    price: 0,
    category: 'sample category',
    image: '/images/shirt1.jpg',
    brand: 'sample brand',
    countInStock: 0,
    description: 'sample description',
    rating: 0,
    numReview: 0,
  });

  const product = await newProduct.save();

  await db.disconnect();

  res.send({ message: 'Product Created Successfully.', product });
});

export default handler;
