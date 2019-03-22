import { connect } from "react-redux";
import { authInitialProps, checkUserRole } from "<utils>/auth";
import moment from "moment";
import { InputDateItem } from "<components>";
import { Table, Icon, Button } from "antd";
import styled from "styled-components";
import { Formik, Field } from "formik";
import { actionTypes } from "<action_types>";
import { GetExpireItem } from "<actions>";

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
        title: "รหัสใบรับของ",
        dataIndex: "rs_code",
        width: "10%"
      },
      {
        title: "จำนวน",
        dataIndex: "remain_qty",
        width: "15%",
        align: "center"
      },

      {
        title: "หน่วยสินค้า",
        dataIndex: "unit_name",
        width: "10%",
        align: "center"
      },
      {
        title: "วันที่รับของ",
        dataIndex: "rs_date",
        width: "10%",
        render: (text, record, index) => {
          return <span>{moment(text).format("YYYY-MM-DD")}</span>;
        }
      },
      {
        title: "วันหมดอายุ",
        dataIndex: "expire_date",
        width: "10%",
        render: (text, record, index) => {
          return <span>{moment(text).format("YYYY-MM-DD")}</span>;
        }
      },
      {
        title: "หมายเหตุ",
        dataIndex: "remark",
        width: "20%"
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
        <HeaderContainer>
          <H1TextCenter>Expire Item Report</H1TextCenter>
          <Formik
            initialValues={{
              start_date: moment(),
              end_date: moment().add(1, "d")
            }}
            // validationSchema={POFormSchema}
            onSubmit={async (values, actions) => {
              let { start_date, end_date } = values;
              start_date = moment(start_date).format("YYYY-MM-DD");
              end_date = moment(end_date).format("YYYY-MM-DD");
              if (start_date <= end_date) {
                this.setState({ loading: true });
                await this.props.GetExpireItem(values);
                this.setState({ loading: false });
                // console.log(start_date, end_date);
              } else {
                alert("kuy");
              }

              // console.log(values);
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
                      สร้าง
                    </Button>
                  </ActionContainer>
                </FlexCenter>
              </form>
            )}
          />
        </HeaderContainer>
        <hr />
        <Loading className="loader" loading={loading} />
        <MainContainer>
          <Table
            columns={columns}
            dataSource={ReportReducer.List}
            pagination={false}
            rowKey={record => record.id}
            // scroll={{ y: 500 }}
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
  { GetExpireItem }
)(Report);

const H1TextCenter = styled.h1`
  margin: 0px;
  padding: 10px 0px;
  text-align: center;
`;

const HeaderContainer = styled.div`
  height: 20vh;
`;

const MainContainer = styled.div`
  height: 78vh;

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
