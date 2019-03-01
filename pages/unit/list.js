import { authInitialProps, checkUserRole } from "<utils>/auth";

class Test extends React.PureComponent {
  render() {
    return <button onClick={() => this.test()}>11111</button>;
  }
}

Test.getInitialProps = async ctx => {
  const { auth } = await authInitialProps(true)(ctx);

  return { auth };
};

export default Test;
