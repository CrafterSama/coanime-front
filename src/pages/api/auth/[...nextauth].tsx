import { Method } from 'axios';
import { METHODS } from 'http';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import axios from '../../../lib/axios';

//This is for getting the laravel-session cookie and the CSRF cookie
//from any response of Sanctum or API Breeze
//In my case, the cookies returned are always two and I only need this,
//so you can edit for get independent of position and cookies.
const getCookiesFromResponse = (res) => {
  let cookies = res.headers['set-cookie'][0].split(';')[0] + '; ';
  cookies += res.headers['set-cookie'][1].split(';')[0] + '; ';
  return cookies;
};

//This is to get the X-XSRF-TOKEN from any response of Sanctum or API Breeze,
//In my case, the token is always returned first,
//so you can edit for get independent of position
const getXXsrfToken = (res) => {
  return decodeURIComponent(
    res.headers['set-cookie'][0].split(';')[0]?.replace('XSRF-TOKEN=', '')
  );
};

//This method works to make any request to your Laravel API
//res_cookies are the cookies of the response of last request you do
//obviously res_cookies is null in your first request that is "/sanctum/csrf-cookie"
const makeRequest = async (
  method: Method = 'get',
  url,
  dataForm = null,
  res_cookies
) => {
  const cookies =
    res_cookies != null ? getCookiesFromResponse(res_cookies) : null;
  const res = await axios.request({
    method: method,
    url: url,
    data: dataForm,
    headers: {
      origin: process.env.NEXTAUTH_URL_INTERNAL, // this is your front-end URL, for example in local -> http://localhost:3000
      Cookie: cookies, // set cookie manually on server
      'X-XSRF-TOKEN': res_cookies ? getXXsrfToken(res_cookies) : null,
    },
    withCredentials: true,
    /*credentials: true,*/
  });
  return res;
};

const nextAuthOptions = (req, res) => {
  return {
    providers: [
      Credentials({
        name: 'Email and Password',
        credentials: {
          email: { label: 'Email', type: 'email', placeholder: 'Your Email' },
          password: { label: 'Password', type: 'password' },
        },
        async authorize(credentials: any): Promise<any> {
          const csrf = await makeRequest(
            'get',
            '/sanctum/csrf-cookie',
            null,
            null
          );
          const user = await makeRequest(
            'post',
            '/customer/login',
            credentials,
            csrf
          );

          if (user) return user;
          return null;
        },
      }),
    ],
  };
};
