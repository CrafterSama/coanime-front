import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="es">
        <Head>
          <meta name="language" content="es" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
          <meta
            name="google-site-verification"
            content="eIQBLZgWmisXKwYEiGVWty1gOk2YPohgAWQKvGjKEsE"
          />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous" // disabled-eslint
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Red+Hat+Text:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap"
            rel="stylesheet"
          />
          <meta name="referrer" content="default" />
          <meta property="fb:pages" content="127729317274121" />
          <meta content="all, index, follow" name="robots" />
          <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4955562843486224"
            crossOrigin="anonymous" // disabled-eslint
          ></script>
        </Head>
        <body className="antialiased">
          <Main />
          <div id="portal" />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
