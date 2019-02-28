import Document, { Head, Main, NextScript } from "next/document";
import { ServerStyleSheet } from "styled-components";
import { getServerSideToken, getUserScript } from "<utils>/auth";

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet();
    const page = ctx.renderPage(App => props =>
      sheet.collectStyles(<App {...props} />)
    );
    const styleTags = sheet.getStyleElement();

    const props = await Document.getInitialProps(ctx);
    const userData = await getServerSideToken(ctx.req);
    return { ...page, styleTags, ...props, ...userData };
  }

  render() {
    const { user } = this.props;

    return (
      <html>
        <Head>
          <link rel="stylesheet" href="../static/css/antd.css" />
          <link rel="stylesheet" href="../static/css/index.css" />
          {this.props.styleTags}
        </Head>
        <body>
          <Main />
          <script dangerouslySetInnerHTML={{ __html: getUserScript(user) }} />
          <NextScript />
        </body>
      </html>
    );
  }
}
