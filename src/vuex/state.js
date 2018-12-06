import fixedField from '../untils/fixed_field'

export default {
  fixedField,
  showDialogUpdatePassword: false,
  auditorListData: [], // 审批操作人列表
  handleListData: [], // 客服操作人列表
  payhandleListData: [], // 财务操作人
  operatorIdList: [], // 催收操作人
  // v_0.1.0
  dialogBackOne: false, // 单期还款列表的弹框显示
  refreshLoanDetailDataType: false, // 借款详情信息是否刷新成功
  refreshLoanDetailType: false, // 还款计划表是否刷新成功
  userLoginInfo: null, // 用户登录信息
  status: 0, // 添加或者修改状态
  topicType: 1, // 主题的列别
  loanListData: {}, // 借款列表
  loanDetailDataInfo: {}, // 借款详情-借款信息
  loanDetailDataPlan: {loanPhaseInnerList: []}, // 借款详情-还款计划表
  backAll: {}, // 全部还款数据
  backOne: {}, // 单期还款数据
  payOneDetailData: {}, // 单期还款明细
  reimbursementListData: {}, // 减免列表
  lendingListData: {}, // 放款列表
  breaksListData: {}, // 代扣还款列表
  breaksEntryListData: {}, // 还款录入列表
  tradingListData: {}, // 借款详情
  threeChannelData: [], // 三大渠道数据
  signingRecordData: [], // 签约记录数据
  billListData: [], // 账单列表
  stickListData: {total: 200, rows: []}, // 绑卡列表
  billDetailListData: {}, // 账单详情
  installmentManageData: [], // 期次管理
  // v_0.2.0
  setLetterOnData: {}, // 信审列表数据
  letterRecordsData: [], // 审批记录
  remarkRecordsData: [],  // 备注记录
  dialogVisibleMandatory: false, // 强制退出
  userListData: {}, // 用户列表
  blackListData: {}, // 黑名单列表
  creditListData: {}, // 授信列表
  productListData: {}, // 产品列表
  waitLendingListData: {}, // 待款列表
  errorList: {}, // 放款/还款列表
  handleRecordsList: [], // 处理记录列表
  handleDetail: {}, // 处理详情
  entryDetail: [], // 还款录入明细，减免明细
  waterCenter: {}, // 流水中心
  setSinglePhaseStatus: true, // 明细的状态
  // v_0.6.0
  caseDataList: {}, // 案件列表
  caseDataOverDueList: [], // 案件列表期次列表
  collectionRecords: [], // 案件列表页的催收记录
  showDialogTableVisible: false, // 催收记录弹框
  ruleFormData: {},  // 表单信息
  collectionType: false,
  caseSpeedData: null,
  // v_0.6.1  按钮权限配置
  setButtonLimitData: [],
  // v_0.7.0
  openAccountData: [],
  userDetailBaseInfoData: {},
  bidListInfoInfoData: null,
  payChannelListData: [],
  userDetailDialogVisible: false,
  userDetailLendData: [],
  // v_0.7.1
  myCaseBackList: {},
  myAuditListData: {},
  overTimeInfo: {},
  caseUserId: '',
  CaseRecordDialogTableVisible: null,
  openBankList: [],
  messageRecordList: null, // 短信记录列表
  commonProblemList: null // 常见问题列表
}
