import { connect } from "react-redux";
import { authInitialProps, checkUserRole } from "<utils>/auth";
import moment from "moment";
import { InputDateItem } from "<components>";
import { Table, Icon, Button } from "antd";
import styled from "styled-components";
import { Formik, Field } from "formik";
import { actionTypes } from "<action_types>";
import { FlowDailyItem } from "<actions>";

class Report extends React.PureComponent {
  constructor(props) {
    super(props);

    const columns = [
      {
        title: "รหัสสินค้า",
        dataIndex: "item_id",
        width: "10%",
        align: "center"
      },
      {
        title: "ชื่อสินค้า",
        dataIndex: "item_name",
        width: "15%"
      },
      {
        title: "รับเข้า",
        dataIndex: "inbound",
        width: "10%"
      },
      {
        title: "ส่งออก",
        dataIndex: "outbound",
        width: "10%"
      },
      {
        title: "รับคืน",
        dataIndex: "return",
        width: "10%"
      },
      {
        title: "คงเหลือ ณ ช่วงเวลา",
        // dataIndex: "remark",
        width: "15%",
        render: (text, record, index) => {
          return (
            <span>
              {parseInt(record.inbound) -
                parseInt(record.outbound) +
                parseInt(record.return)}
            </span>
          );
        }
      }
    ];

    this.state = {
      columns,
      loading: false
    };
  }

  render() {
    const { columns, loading } = this.state;
    const { ReportReducer } = this.props;

    return (
      <Container>
        <H1TextCenter>รายงานความเคลื่อนไหวสินค้า</H1TextCenter>
        <Formik
          initialValues={{
            start_date: moment(),
            end_date: moment().add(1, "d")
          }}
          onSubmit={async (values, actions) => {
            let { start_date, end_date } = values;
            start_date = moment(start_date).format("YYYY-MM-DD");
            end_date = moment(end_date).format("YYYY-MM-DD");
            if (start_date <= end_date) {
              this.setState({ loading: true });
              await this.props.FlowDailyItem(values);
              this.setState({ loading: false });
            }
          }}
          render={props => (
            <form>
              <FlexCenter>
                <FieldContainer width="45%">
                  <Field
                    label="วันที่เริ่มต้น"
                    name="start_date"
                    component={InputDateItem}
                    value={moment(props.values.start_date)}
                    requireStar="true"
                    onChange={e => props.setFieldValue("start_date", e)}
                    allowClear={false}
                    onBlur={null}
                  />
                </FieldContainer>
                <FieldContainer width="45%">
                  <Field
                    label="วันที่สิ้นสุด"
                    name="end_date"
                    component={InputDateItem}
                    value={moment(props.values.end_date)}
                    requireStar="true"
                    onChange={e => props.setFieldValue("end_date", e)}
                    allowClear={false}
                    onBlur={null}
                  />
                </FieldContainer>
              </FlexCenter>

              <FlexCenter>
                <ActionContainer>
                  <Button
                    type="primary"
                    icon="snippets"
                    onClick={() => props.handleSubmit()}
                  >
                    เรียกดู
                  </Button>
                </ActionContainer>
              </FlexCenter>
            </form>
          )}
        />

        <hr />
        <Loading className="loader" loading={loading} />
        <MainContainer>
          <Table
            columns={columns}
            dataSource={ReportReducer.List}
            pagination={false}
            rowKey={record => record.id}
          />
        </MainContainer>
      </Container>
    );
  }
}

Report.getInitialProps = async ctx => {
  const { auth } = await authInitialProps(true)(ctx);
  if (auth) {
    await checkUserRole(auth)(ctx);

    await ctx.reduxStore.dispatch({ type: actionTypes.REPORT.RESET });
  }
  return { auth };
};

export default connect(
  ({ ReportReducer }) => ({ ReportReducer }),
  { FlowDailyItem }
)(Report);

const H1TextCenter = styled.h1`
  margin: 0px;
  padding: 10px 0px;
  text-align: center;
`;

const MainContainer = styled.div`
  height: 70vh;
  overflow-y: scroll;
`;
const Container = styled.div`
  padding: 0px 10px;
  width: 100%;
`;

const FlexCenter = styled.div`
  display: flex;
  justify-content: center;
`;

const ActionContainer = styled.div`
  padding: 10px 0px;
`;

const FieldContainer = styled.div`
  width: ${props => ` ${props.width}` || ""};
`;

const Loading = styled.div`
  display: ${props => (props.loading ? "block" : "none")};
`;
