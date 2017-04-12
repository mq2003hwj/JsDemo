import React from 'react';
import axios from 'axios';
import { Table, Row, Col, Form, Button, Input, Select, DatePicker } from 'antd';

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;

const COMMISSION_ENUM = {
  '-1': '全部',
  '1': '扣除交易服务费',
  '2': '退回交易服务费',
  '3': '返还交易服务费',
}

const DailyColumns = [{
  title: '账单日期',
  dataIndex: 'ReportDate',
  key: 'ReportDate',
}, {
  title: '结算类型',
  dataIndex: 'CommissionTypeDes',
  key: 'CommissionTypeDes',
}, {
  title: '买手ID',
  dataIndex: 'SellerUserId',
  key: 'SellerUserId',
}, {
  title: '买手用户名',
  dataIndex: 'SellerLoginId',
  key: 'SellerLoginId',
}, {
  title: '国家',
  dataIndex: 'CountryName',
  key: 'CountryName',
}, {
  title: '结算金额/元',
  dataIndex: 'CommissionAmount',
  key: 'CommissionAmount',
}];

class FundCommission extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      data: [],
      pagination: {
        pageSize: 25,
        total: 0,
        current: 1,
      },
      query: {
        startTime: null,
        endTime: null,
        userLoginId: '',
        userId: '',
        commissionType: '-1',
      },
      loading: false,
    };


    ['handleTableChange', 'handleReset', 'fetch'].forEach(method => {
      this[method] = this[method].bind(this);
    });
  }

  handleTableChange(pagination) {
    this.setState({ pagination }, this.fetch);
  }


  fetch() {
    //显示loading
    this.setState({ loading: true });

    const { query, pagination } = this.state;
    let params = {
      ...query,
      pageSize: pagination.pageSize,
      pageNum: pagination.current,
    };

    axios.post('/Invoice/FundCommission/GetCommissionDaily', params)
      .then(({ data }) => {
        //更新state
        this.setState({
          loading: false,
          data: data.Result,
          pagination: {
            ...this.state.pagination,
            total: data.Totals,
          },
        });
      }).catch(error => {
        //隐藏loading
        this.setState({ loading: false });
      });
  }


  componentDidMount() {
    this.fetch();
  }

  _getQuery() {
    const query = this.props.form.getFieldsValue();
    if (query['rangeTime']) {
      query['startTime'] = query['rangeTime'][0].format('YYYY-MM-DD');
      query['endTime'] = query['rangeTime'][1].format('YYYY-MM-DD');
      delete query['rangeTime'];
    }
    for (let key in query && typeof query[key] === 'string') {
      if (query[key]) {
        query[key] = query[key].trim();
      }
    }
    return query;
  }


  handleSubmit(e) {
    e.preventDefault();

    this.props.form.validateFields((errors, values) => {
      if (!!errors) return;
      const query = this._getQuery();
      this.setState({ query }, this.fetch);
    });
  }

  handleReset(e) {
    e.preventDefault();
    this.props.form.resetFields();
  }

  checkUserId(rule, value, callback) {
    if (!/^\d*$/.test(value.trim())) {
      callback(new Error('必须为数字'));
    }
    callback();
  }

  render() {
    /* 结算类型option */
    const commissionTypeOptions = [];
    for (let k in COMMISSION_ENUM) {
      commissionTypeOptions.push(
        <Option value={k} key={k}> {COMMISSION_ENUM[k]} </Option>
      );
    }

    /* 高级查询表单初始化 */
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
    };

    return (
      <div className="content-box">
            <h2 style={{marginBottom:16}}>交易服务费对账</h2>
            <Form horizontal className="ant-advanced-search-form" style={{marginBottom: '16px'}} onSubmit={this.handleSubmit.bind(this)}>
                <Row gutter={16}>
                    <Col span={8}>
                        <FormItem label="账单日期范围" {...formItemLayout}>
                            {getFieldDecorator('rangeTime')(
                              <RangePicker />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label="买手ID" {...formItemLayout}>
                            {getFieldDecorator('userId', { initialValue: '', rules: [{validator: this.checkUserId}] })(
                              <Input placeholder="买手ID" />
                            )} 
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label="买手用户名" {...formItemLayout}>
                            {getFieldDecorator('userLoginId')(
                              <Input placeholder="买手用户名" />   
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <FormItem label="结算类型" {...formItemLayout}>
                            {getFieldDecorator('commissionType', { initialValue: '-1' })(
                              <Select size="default" style={{ width: 200 }}>
                                  { commissionTypeOptions }
                              </Select> 
                            )}
                        </FormItem> 
                    </Col>   
                </Row> 
                <Row>
                    <Col span={24} style={{textAlign:'right'}}>
                        <Button type="primary" htmlType="submit" loading={this.state.loading}>查询</Button>
                        <Button onClick={this.handleReset}>清空</Button>
                    </Col>
                </Row>
            </Form> 

            <Table
                columns={ DailyColumns }
                dataSource={ this.state.data } 
                pagination={{
                    ...this.state.pagination,
                    showSizeChanger: true,
                    pageSizeOptions: ['25','50','100']
                }}
                loading={ this.state.loading }
                onChange={ this.handleTableChange } />
        </div>
    );
  }
}

export default Form.create({})(FundCommission);