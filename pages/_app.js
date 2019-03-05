import App, { Container } from "next/app";
import React from "react";
import withReduxStore from "../lib/with-redux-store";
import { Provider } from "react-redux";
import Head from "next/head";
import { Sider } from "<components>";
import { Layout } from "antd";

class MyApp extends App {
  render() {
    const { Component, pageProps, reduxStore } = this.props;
    // console.log(pageProps, "app");
    return (
      <Container>
        <Head>
          <title>Freeze Food</title>
        </Head>
        <Layout style={{ background: "white" }}>
          <Sider {...pageProps} />
          <Provider store={reduxStore}>
            <Component {...pageProps} />
          </Provider>
        </Layout>
      </Container>
    );
  }
}

export default withReduxStore(MyApp);
