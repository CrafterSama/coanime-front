import type { NextApiHandler } from 'next';
import axios from '@/lib/axios';

const credentialsAuth: NextApiHandler = (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }
  axios
    .post('/login', {
      email: req.body.email,
      password: req.body.password,
    })
    .then((response) => {
      console.log(response);
      res.status(200).json(response.data);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
};

export default credentialsAuth;
