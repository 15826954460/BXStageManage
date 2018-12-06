/* eslint-disabled */
export default {
  // 进件渠道
  IntoChannelList: [
    {channelName: '全部', channelNum: null},
    {channelName: '融360', channelNum: 1}
    // {channelName: '融宝', channelNum: 2},
    // {channelName: '宝付', channelNum: 3}
  ],
  // 签约渠道
  payChannelList: [
    {channelName: '全部', channelNum: null},
    {channelName: '富友', channelNum: 1},
    // {channelName: '融宝', channelNum: 2},
    {channelName: '宝付', channelNum: 2}
  ],
  // 支付渠道
  payChannel: [
    {channelName: '全部', channelNum: null},
    {channelName: '宝付', channelNum: 2},
    {channelName: '富友', channelNum: 1}
  ],
  // 账单状态
  accountStatus: [
    {value: '待还款', color: '#000', statusCode: 0},
    {value: '已还清', color: '#67C23A', statusCode: 1}
  ],
  // 期次状态
  installmentStatus: [
    {value: '全部', color: '#000', statusCode: null},
    {value: '待还款', color: '#000', statusCode: 0},
    {value: '还款中', color: '#000', statusCode: 1},
    {value: '逾期中', color: '#FF0000', statusCode: 3},
    {value: '已还清', color: '#67C23A', statusCode: 2}
  ],
  // 放款状态
  lendingStatus: [
    {value: '放款中', color: '#000', statusCode: 1},
    {value: '放款成功', color: '#000', statusCode: 2},
    {value: '放款失败', color: '#000', statusCode: 3}
  ],
  // 还款状态
  breakStatus: [
    {value: '还款中', color: '#000', statusCode: 1},
    {value: '还款成功', color: '#000', statusCode: 2},
    {value: '还款失败', color: '#000', statusCode: 3}
  ],
  // 减免状态
  reduceStatus: [
    {value: '成功', color: '#000', statusCode: null}
  ],
  // 签约状态
  singingStatus: [
    {value: '全部', color: '#000', statusCode: null},
    {value: '失败', color: '#000', statusCode: 0},
    {value: '成功', color: '#000', statusCode: 1}
  ],
  // 借款期数
  loanInstallmentList: [
    {installment: '全部', index: null},
    {installment: '3期', index: 3},
    {installment: '6期', index: 6},
    {installment: '9期', index: 9},
    {installment: '12期', index: 12}
  ],
  // 订单类型
  orderType: [
    {value: '全部', code: null},
    {value: '授信订单', code: 1},
    {value: '借款订单', code: 2}
  ],
  // 实名认证一致性
  realNameCertification: [
    {value: '一致', color: '#67C23A', code: 0},
    {value: '不一致', color: '#FF0000', code: 1},
    {value: '相似', color: '#000', code: 2}
  ],
  // 学历类型
  schoolingType: [
    {value: '研究生', key: 1, color: '#67C23A'},
    {value: '普通', key: 2, color: '#67C23A'},
    {value: '成人', key: 3, color: '#67C23A'},
    {value: '自考', key: 4, color: '#67C23A'},
    {value: '开放教育', key: 5, color: '#67C23A'},
    {value: '网络教育', key: 6, color: '#67C23A'},
    {value: '自学考试', key: 7, color: '#67C23A'},
    {value: '查询接口异常', key: -2, color: '#FF0000'},
    {value: '其它', key: 9, color: '#CCCBCA'},
    {value: '暂无数据', key: 0, color: '#CCCBCA'}
  ],
  // 学历认证结果
  schoolingCertification: [
    {value: '博士研究生', key: 1, color: '#67C23A'},
    {value: '硕士研究生', key: 2, color: '#67C23A'},
    {value: '本科', key: 3, color: '#67C23A'},
    {value: '专科', key: 4, color: '#67C23A'},
    {value: '专升本', key: 5, color: '#67C23A'},
    {value: '专科(高职)', key: 6, color: '#67C23A'},
    {value: '夜大电大函大普通班', key: 7, color: '#67C23A'},
    {value: '第二学士学位', key: 8, color: '#67C23A'},
    {value: '暂无数据', key: 0, color: '#CCCBCA'},
    {value: '其它', key: 9, color: '#CCCBCA'},
    {value: '查询接口异常', key: -2, color: '#FF0000'}
  ],
  // 流转字段
  circulationList: [
    {key: 0, name: '发送短信', color: 'primary', codeType: ''},
    {key: 1, name: '备注', color: 'warning', codeType: ''},
    {key: 2, name: '通过', color: 'success', codeType: 1},
    {key: 3, name: '流转', color: 'primary', codeType: 3}
    // {key: 4, name: '退出', color: 'error', codeType: ''}
  ],
  // 照片枚举
  photoType: [
    {value: '头像照', type: '拍摄照片', code: 1, color: '#909399'},
    {value: '国徽照', type: '拍摄照片', code: 2, color: '#909399'},
    {value: '最佳照', type: '活体检测', code: 3, color: '#67c23a'},
    {value: '张嘴照', type: '活体检测', code: 4, color: '#67c23a'},
    {value: '点头照', type: '活体检测', code: 5, color: '#67c23a'},
    {value: '摇头照', type: '活体检测', code: 6, color: '#67c23a'},
    {value: '最佳照', type: '活体检测', code: 7, color: '#67c23a'},
    {value: '张嘴照', type: '活体检测', code: 8, color: '#67c23a'},
    {value: '点头照', type: '活体检测', code: 9, color: '#67c23a'},
    {value: '摇头照', type: '活体检测', code: 10, color: '#67c23a'}
  ],
  // 授信审批状态
  creditStatus: [
    // {value: '审批中', code: 1, color: '#000'},
    // {value: '已退回', code: 2, color: '#FF0000'},
    // {value: '已通过', code: 3, color: '#67C23A'},
    // {value: '未通过', code: 4, color: '#000'}
  ],
  // 借款 授信 审批状态
  examinationStatus: [
    {value: '待人工审批', code: 101, color: '#000'},
    {value: '审核中', code: 1, color: '#000'},
    {value: '重新提交', code: 103, color: '#000'},
    {value: '已挂起', code: 2, color: '#000'},
    {value: '已退回', code: 102, color: '#000'},
    {value: '已关闭', code: 400, color: '#FF0000'},
    {value: '已拒绝', code: 300, color: '#FF0000'},
    {value: '已通过', code: 200, color: '#67C23A'}
  ],
  // 借款状态
  loanStatus: [
    {value: '审批中', color: '#000', statusCode: 1},
    {value: '已退回', color: '#000', statusCode: 2},
    {value: '未通过', color: '#000', statusCode: 3},
    {value: '放款中', color: '#000', statusCode: 4},
    {value: '待还款', color: '#000', statusCode: 5},
    {value: '逾期中', color: '#FF0000', statusCode: 6},
    {value: '已结清', color: '#67C23A', statusCode: 7},
    {value: '已关单', color: '#000', statusCode: 8},
    {value: '已关闭', color: '#67C23A', statusCode: 0}
  ],
  // 借款审批状态
  auditStatus: [],
  // 提交频率
  submitTimes: [
    {value: '持续', key: -1},
    {value: '每5分钟', key: 5},
    {value: '每10分钟', key: 10},
    {value: '每20分钟', key: 20},
    {value: '每30分钟', key: 30},
    {value: '每40分钟', key: 40},
    {value: '每50分钟', key: 50},
    {value: '每60分钟', key: 60}
  ],
  // 放款时间
  lendingTime: [
    {value: '00', key: 0},
    {value: '01', key: 1},
    {value: '02', key: 2},
    {value: '03', key: 3},
    {value: '04', key: 4},
    {value: '05', key: 5},
    {value: '06', key: 6},
    {value: '07', key: 7},
    {value: '08', key: 8},
    {value: '09', key: 9},
    {value: '10', key: 10},
    {value: '11', key: 11},
    {value: '12', key: 12},
    {value: '13', key: 13},
    {value: '14', key: 14},
    {value: '15', key: 15},
    {value: '16', key: 16},
    {value: '17', key: 17},
    {value: '18', key: 18},
    {value: '19', key: 19},
    {value: '20', key: 20},
    {value: '21', key: 21},
    {value: '22', key: 22},
    {value: '23', key: 23}
  ],
  // 审批记录弹框的操作枚举
  aduitRecordsList: [
    {value: '通过', key: 1, color: '#67c23a'},
    {value: '拒绝', key: 2, color: '#FF0000'},
    {value: '退回', key: 3, color: '#F9D664'},
    {value: '关闭', key: 4, color: '#FF0000'},
    {value: '挂起', key: 5, color: '#F9D664'},
    {value: '备注', key: 6, color: '#000'},
    {value: '重新提交', key: 7, color: '#000'},
    {value: '转人工审核', key: 8, color: '#000'},
    {value: '退出', key: 9, color: '#000'},
    {value: '强制退出', key: 10, color: '#000'},
    {value: '审批中', key: 11, color: '#F9D664'},
    {value: '发送短信', key: 12, color: '#000'}
  ],
  // 来源
  resource: [
    {value: '所有', key: null},
    {value: '币下', key: 1},
    {value: '线下贷款系统', key: 2},
    {value: '荷包理财', key: 3}
  ],
  // 企业类别
  enterpriseList: [
    {value: '未知', code: 0},
    {value: '企业主', code: 1},
    {value: '个体工商户', code: 2},
    {value: '上班人群', code: 3},
    {value: '学生', code: 5},
    {value: '无固定职业', code: 10}
  ],
// 在网状态
  onlineList: [
    {value: '手机号码不存在', key: -1, color: '#FF0000'},
    {value: '数据不存在', key: 0, color: '#FF0000'},
    {value: '正常在用', key: 1, color: '#67c23a'},
    {value: '停机', key: 2, color: '#FF0000'},
    {value: '在网但不可用', key: 3, color: '#FF0000'},
    {value: '不在网', key: 4, color: '#FF0000'},
    {value: '无法查询', key: 9, color: '#FF0000'},
    {value: '查询接口异常', key: -2, color: '#FF0000'}
  ],
  // 在网时常
  onlineTime: [
    {value: '查询无结果', key: 0, color: '#FF0000'},
    {value: '24个月以上', key: 1, color: '#67c23a'},
    {value: '12-24个月', key: 2, color: '#67c23a'},
    {value: '6-12个月', key: 3, color: '#F9D664'},
    {value: '0-3个月', key: 4, color: '#FF0000'},
    {value: '3-6个月', key: 5, color: '#FF0000'},
    {value: '手机号码不存在', key: 6, color: '#FF0000'},
    {value: '数据不存在', key: 7, color: '#FF0000'},
    {value: '查询接口异常', key: -2, color: '#FF0000'}
  ],
  // 实名一致
  realName: [
    {value: '库无记录', key: 0, color: '#FF0000'},
    {value: '一致', key: 1, color: '#67c23a'},
    {value: '不一致', key: 2, color: '#FF0000'},
    {value: '查询接口异常', key: -2, color: '#FF0000'}
  ],
  // 与本人关系列表
  relationShipList: [
    {value: '配偶', key: 1},
    {value: '父亲', key: 2},
    {value: '母亲', key: 3},
    {value: '兄弟', key: 5},
    {value: '姐妹', key: 6}
  ],
  // 放款 搜索条件异常类型
  lendingErrorType: [
    {value: '全部', code: null, color: '#000'},
    {value: '放款中超过30分钟', code: 100, color: '#F9D664'},
    {value: '放款失败待定', code: 101, color: '#000'},
    {value: '退票', code: 102, color: '#000'}
  ],
  // / 还款 搜索条件异常类型
  backErrorType: [
    {value: '全部', code: null, color: '#000'},
    {value: '还款中超过30分钟', code: 200, color: '#F9D664'},
    {value: '还款失败待定', code: 201, color: '#000'}
  ],
  // 还款 / 放款 列表异常类型
  errorType: [
    {value: '放款中超过30分钟', code: 100, color: '#F9D664'},
    {value: '放款失败待定', code: 101, color: '#000'},
    {value: '还款中超过30分钟', code: 200, color: '#F9D664'},
    {value: '还款失败待定', code: 201, color: '#000'},
    {value: '退票', code: 102, color: '#000'}
  ],
  // 处理记录操作列表
  handleRecordsList: [
    // 100,备注 ,101挂起 ,201置为放款成功 202重新放款 ,203置为放款失败,204,查询交易状态 ,301, 置为还款成功 ,302置为还款失败 ,304发送短信,303,查询交易状态,401 结束工单 ,501 退出 ,502 强制退出;
    {value: '备注', code: 100},
    {value: '挂起', code: 101},
    {value: '置为放款成功', code: 201},
    {value: '重新放款', code: 202},
    {value: '置为放款失败', code: 203},
    {value: '查询交易状态', code: 204},
    {value: '置为还款成功', code: 301},
    {value: '置为还款失败', code: 302},
    {value: '查询交易状态', code: 303},
    {value: '发送短信', code: 304},
    {value: '结束工单', code: 401},
    {value: '退出', code: 501},
    {value: '强制退出', code: 502}
  ],
  // 还款类型
  breaksType: [
    {value: '全部', code: null},
    {value: '单期', code: 101},
    {value: '多期(单笔借款)', code: 103}
  ],
  // 减免类型
  reimburseType: [
    {value: '全部', code: null},
    {value: '整笔结清自动减免', code: 201},
    {value: '单期手动减免', code: 202}
  ],
  // 流水类型=>搜所条件
  waterType: [
    {
      value: null,
      label: '全部'
    },
    {
      value: '1',
      label: '放款',
      children: [
        {value: null, label: '全部'},
        {value: '1', label: '放款-本⾦'}
      ]
    },
    {
      value: '2',
      label: '费用',
      children: [
        {value: null, label: '全部'},
        {value: '101', label: '费⽤-借款利息'},
        {value: '102', label: '费⽤-借款服务费'},
        {value: '103', label: '费⽤-逾期管理费'},
        {value: '104', label: '费⽤-逾期复利'}
      ]
    },
    {
      value: '3',
      label: '还款',
      children: [
        {value: null, label: '全部'},
        {value: '201', label: '还款-本⾦'},
        {value: '202', label: '还款-借款利息'},
        {value: '203', label: '还款-借款服务费'},
        {value: '204', label: '还款-逾期管理费'},
        {value: '205', label: '还款-逾期复利'},
        {value: '206', label: '还款-溢缴'}
      ]
    },
    {
      value: '4',
      label: '减免',
      children: [
        {value: null, label: '全部'},
        {value: '301', label: '减免-借款利息'},
        {value: '302', label: '减免-借款服务费'},
        {value: '303', label: '减免-逾期管理费'},
        {value: '304', label: '减免-逾期复利'}
      ]
    }
  ],
  // 流水类型的前端展示字段
  waterTypeShow: [
    // {code: null, value: '全部'},
    {code: '1', value: '放款-本⾦'},
    {code: '101', value: '费⽤-借款利息'},
    {code: '102', value: '费⽤-借款服务费'},
    {code: '103', value: '费⽤-逾期管理费'},
    {code: '104', value: '费⽤-逾期复利'},
    {code: '201', value: '还款-本⾦'},
    {code: '202', value: '还款-借款利息'},
    {code: '203', value: '还款-借款服务费'},
    {code: '204', value: '还款-逾期管理费'},
    {code: '205', value: '还款-逾期复利'},
    {code: '206', value: '还款-溢缴'},
    {code: '301', value: '减免-借款利息'},
    {code: '302', value: '减免-借款服务费'},
    {code: '303', value: '减免-逾期管理费'},
    {code: '304', value: '减免-逾期复利'}
  ],
  // 催收板块 案件状态
  caseType: [
    {value: '全部', code: null},
    {value: '新案', code: 1},
    {value: '承诺还款', code: 2},
    {value: '重点跟进', code: 3},
    {value: '每日必跟', code: 4},
    {value: '跳票', code: 5},
    {value: '信息均无效', code: 6}
  ],
  // 标的状态
  bidType: [
    {value: '待建标', code: 1},
    {value: '已建标', code: 2},
    {value: '建标失败', code: 3},
    {value: '已撤标', code: 4},
    {value: '撤标失败', code: 5},
    {value: '待提交发标', code: 6},
    {value: '提交发标成功', code: 7},
    {value: '提交发标失败', code: 8},
    {value: '融资成功', code: 9},
    {value: '已流标', code: 10}
  ],
  // 支付商户
  payMerchants: [
    {value: '全部', code: null},
    {value: '荷包', code: 2},
    {value: '淮南', code: 1}
  ],
  // 签约类型
  signingType: [
    {value: '全部', code: null},
    {value: '三要素', code: 1},
    {value: '五要素', code: 2}
  ],
  // 资金方
  funderType: [
    {value: '全部', code: null},
    {value: '淮南', code: 1},
    {value: '荷包', code: 2}
  ],
  // 短信模板
  messageModel: [
    // {value: '提醒用户接听手机', code: 1},
    // {value: '放款失败结束订单提醒', code: 2},
    {value: '对公还款通知', code: 3}
    // {value: '通知用户处理超时，还款失败', code: 1},
    // {value: '自定义短信', code: 4},
    // {value: '还款提醒', code: 5}
  ],
  // 还款异常查看日志里面的短信模板
  logModal: [
    {value: '还款成功', code: 1},
    {value: '还款失败', code: 2},
    {value: '挂起', code: 3},
    {value: '发短信', code: 4}
  ],
  // 查看短信日志模板
  lookMessageModal: [
    {value: '提醒用户接听手机', code: 1},
    {value: '放款失败结束订单提醒', code: 2},
    {value: '对公还款通知', code: 3},
    {value: '通知用户处理超时，还款失败', code: 4},
    {value: '自定义短信', code: 5},
    {value: '还款提醒', code: 6}
  ],
  // 用户姓民，手机号，用户的 id 的搜索条件
  searchConditions: [
    {value: '姓名', code: 1},
    {value: '手机号', code: 2},
    {value: '用户ID', code: 3}
  ],
  /**
   * 2018-32-30
   * baiyunsong
   * 一下枚举针对 App
   */
  // 问题类型
  questionType: [
    {value: '账户问题', code: 1},
    {value: '审核问题', code: 2},
    {value: '还款放款', code: 3},
    {value: '产品介绍', code: 4}
  ],
  // 还清方式  1：正常结清，2：逾期结清，3：提前结清）
  reimbursementWay: [
    {value: '全部', code: null},
    {value: '正常还清', code: 1},
    {value: '逾期还清', code: 2},
    {value: '提前还清', code: 3}
  ]
}
