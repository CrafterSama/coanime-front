import axios from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import type { NextApiHandler } from 'next';
import { CookieJar } from 'tough-cookie';

const credentialsAuth: NextApiHandler = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      res
        .status(500)
        .json({ error: 'NEXT_PUBLIC_API_URL no está configurado' });
      return;
    }

    // Crear jar de cookies para mantener la sesión entre requests
    const jar = new CookieJar();
    const axiosInstance = wrapper(
      axios.create({
        baseURL: apiUrl,
        jar, // Usar el jar de cookies
        withCredentials: true,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
      })
    );

    // Primero obtener CSRF cookie (se guarda automáticamente en el jar)
    await axiosInstance.get('/sanctum/csrf-cookie');

    // Extraer token CSRF de las cookies del jar
    let xsrfToken = null;
    const cookies = await jar.getCookies(apiUrl);
    for (const cookie of cookies) {
      if (cookie.key === 'XSRF-TOKEN') {
        xsrfToken = cookie.value;
        break;
      }
    }

    // Hacer login (las cookies se envían automáticamente)
    await axiosInstance.post(
      '/login',
      {
        email: req.body.email,
        password: req.body.password,
      },
      {
        headers: {
          ...(xsrfToken && { 'X-XSRF-TOKEN': xsrfToken }),
        },
      }
    );

    // Obtener usuario autenticado (las cookies se envían automáticamente)
    const userResponse = await axiosInstance.get('/api/user', {
      headers: {
        ...(xsrfToken && { 'X-XSRF-TOKEN': xsrfToken }),
      },
    });

    res.status(200).json(userResponse.data);
  } catch (error: any) {
    const status = error.response?.status || 500;
    const data = error.response?.data || { error: error.message };
    res.status(status).json(data);
  }
};

export default credentialsAuth;
