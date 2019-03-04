import { authInitialProps, checkUserRole } from "<utils>/auth";

class Index extends React.PureComponent {
  render() {
    return <h1>test</h1>;
  }
}

Index.getInitialProps = async ctx => {
  const { auth } = await authInitialProps()(ctx);

  return { auth };
};

export default Index;
