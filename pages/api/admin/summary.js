import nc from 'next-connect';
import db from '../../../utils/db';
import { onError } from '../../../utils/error';
import Order from '../../../models/Order';
import Product from '../../../models/Product';
import User from '../../../models/User';
import { isAuth, isAdmin } from '../../../utils/auth';

const handler = nc({
  onError,
});
handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
  await db.connect();

  const ordersPriceGroup = await Order.aggregate([
    {
      $group: {
        _id: null,
        sales: { $sum: '$totalPrice' },
      },
    },
  ]);

  const ordersPrice =
    ordersPriceGroup.length > 0 ? ordersPriceGroup[0].sales : 0;

  const ordersCount = await Order.countDocuments();

  const productsCount = await Product.countDocuments();

  const usersCount = await User.countDocuments();

  const salesData = await Order.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: '%m/%Y', date: '$createdAt' } },
        totalSales: { $sum: '$totalPrice' },
      },
    },
  ]);

  await db.disconnect();

  res.send({ ordersPrice, ordersCount, productsCount, usersCount, salesData });
});

export default handler;
