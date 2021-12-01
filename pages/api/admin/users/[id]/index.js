import nc from 'next-connect';
import db from '../../../../../utils/db';
import User from '../../../../../models/User';
import { isAuth, isAdmin } from '../../../../../utils/auth';

const handler = nc();
handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
  await db.connect();
  const user = await User.findById(req.query.id);
  await db.disconnect();
  res.send(user);
});

handler.put(async (req, res) => {
  await db.connect();

  const user = await User.findById(req.query.id);

  if (user) {
    user.name = req.body.name;
    user.isAdmin = Boolean(req.body.isAdmin);
    await user.save();
    await db.disconnect();
    res.send({
      message: 'User Updated Successfully',
      statusMessage: 'success',
    });
  } else {
    await db.disconnect();
    res
      .status(404)
      .send({ message: 'User Not Found', statusMessage: 'warning' });
  }
});

handler.delete(async (req, res) => {
  await db.connect();
  const user = await User.findById(req.query.id);
  if (user) {
    await user.remove();
    await db.disconnect();
    res.send({
      message: 'User Deleted Successfully',
      statusMessage: 'success',
    });
  } else {
    await db.disconnect();
    res
      .status(404)
      .send({ message: 'User Not Found', statusMessage: 'warning' });
  }
});

export default handler;
