import nc from 'next-connect';
import db from '../../../../utils/db';
import User from '../../../../models/User';
import { isAuth, isAdmin } from '../../../../utils/auth';

const handler = nc();
handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
  await db.connect();
  const users = await User.find({});
  await db.disconnect();
  res.send(users);
});

export default handler;
