// 选择是主题的列别
const changeTopicType = (state, res) => {
  state.topicType = res
}
// 借款管理--借款列表
const getLoanList = (state, res) => {
  state.loanListData = res
}
// 借款管理--借款详情-借款信息
const getLoanDetailInfo = (state, res) => {
  state.loanDetailDataInfo = res
}
// 借款管理--借款详情-借款信息刷新成功的状态
const refreshLoanDetailInfo = (state, res) => {
  state.refreshLoanDetailType = res
}
// 借款管理--借款详情-还款计划表
const getLoanDetailPlan = (state, res) => {
  state.loanDetailDataPlan = res
}
// 借款管理--借款详情-还款计划表刷新成功的状态
const refreshLoanDetailPlan = (state, res) => {
  state.refreshLoanDetailDataType = res
}
// 借款管理--借款详情-还款计划表--全部还款数据
const getBackAll = (state, res) => {
  state.backAll = res
}
// 借款管理--借款详情-还款计划表--单期还款数据
const getBackOne = (state, res) => {
  state.backOne = res
}
// 单期还款明细记录
const payOneDetail = (state, res) => {
  state.payOneDetailData = res
}
// 单期还款明细记录权限
const setSinglePhase = (state, res) => {
  state.setSinglePhaseStatus = res
}

// 借款管理--减免列表
const getRemitList = (state, res) => {
  state.reimbursementListData = res
}
// 借款管理--放款列表
const getLendingList = (state, res) => {
  state.lendingListData = res
}
// 借款管理--还款列表
const getBreaksList = (state, res) => {
  state.breaksListData = res
}
// 借款管理--借款详情
const getLoanDetail = (state, res) => {
  console.log(res)
  state.tradingListData = res
}
// 支付中心
const threeChannel = (state, res) => {
  state.threeChannelData = res
}
// 期次管理
const installmentManage = (state, res) => {
  state.installmentManageData = res
}
// 签约记录
const signingRecord = (state, res) => {
  state.signingRecordData = res
}
// 账单列表
const billList = (state, res) => {
  state.billListData = res
}
// 账单详情
const billDetailList = (state, res) => {
  state.billDetailListData = res
}
// 邦卡列表
const stickList = (state, res) => {
  state.stickListData = res
}
// 用户信息
const userLoginInfo = (state, res) => {
  state.userLoginInfo = res
}
// 单期还款弹框的显示
const showBackOne = (state, res) => {
  state.dialogBackOne = res
}
// v_0.2.0
// 心审列表
const setLetterOnList = (state, res) => {
  state.setLetterOnData = res
}
// 审批记录
const setLetterRecordsList = (state, res) => {
  state.letterRecordsData = res
}
// 备注记录
const setRemarkRecordsList = (state, res) => {
  state.remarkRecordsData = res
}
// 强制退出状态
const mandatoryDialog = (state, res) => {
  state.dialogVisibleMandatory = res
}
// 用户列表
const setUserList = (state, res) => {
  state.userListData = res
}
// 黑名单列表
const setBlackList = (state, res) => {
  state.blackListData = res
}
// 黑名单列表
const setCreditList = (state, res) => {
  state.creditListData = res
}
// 产品列表
const setProductList = (state, res) => {
  state.productListData = res
}
// 待放款列表
const setWaitLendingList = (state, res) => {
  state.waitLendingListData = res
}
// 审批人列表
const setAuditorList = (state, res) => {
  state.auditorListData = res
}
// 客服操作人列表
const setHandleList = (state, res) => {
  state.handleListData = res
}
// 财务操作人列表
const setPayHandleList = (state, res) => {
  state.payhandleListData = res
}
// 催收操作人列表
const setOperatorIdList = (state, res) => {
  state.operatorIdList = res
}

// 修改密码弹框
const updateShowDialog = (state, res) => {
  state.showDialogUpdatePassword = res
}
// 放款/还款异常列表
const setErrorList = (state, res) => {
  state.errorList = res
}
// 处理记录列表
const setHandleRecordsList = (state, res) => {
  state.handleRecordsList = res
}
// 处理详情
const setHandleDetail = (state, res) => {
  state.handleDetail = res
}
// 还款录入
const setBreaksEntry = (state, res) => {
  state.breaksEntryListData = res
}
// 还款录入明细，减免明细
const setEntryDetail = (state, res) => {
  state.entryDetail = res
}
// 流水中心
const setWaterCenter = (state, res) => {
  state.waterCenter = res
}
// 案件库列表
const setCaseDataList = (state, res) => {
  state.caseDataList = res
}
// 案件库列表
const setCaseDataOverDueList = (state, res) => {
  state.caseDataOverDueList = res
}
// 案件详情-催收记录列表
const setCollectionRecords = (state, res) => {
  state.collectionRecords = res
}
// 展示案件记录
const showDialogTableVisible = (state, res) => {
  state.showDialogTableVisible = res
}
// 写催记的表单信息
const setFormData = (state, res) => {
  state.ruleFormData = res
}
// 表单信息
const setCollectionType = (state, res) => {
  state.collectionType = res
}
// 案件进度
const setCaseSpeed = (state, res) => {
  state.caseSpeedData = res
}
// 用户权限
const setButtonLimit = (state, res) => {
  state.setButtonLimitData = res
}
// 开户列表
const setOpenAccountList = (state, res) => {
  state.openAccountData = res
}
// 用户详情的基本信息
const setUserDetailBaseInfo = (state, res) => {
  state.userDetailBaseInfoData = res
}
// 用户详情的借款信息
const setUserDetailLendInfo = (state, res) => {
  console.log(res)
  state.userDetailLendData = res
}
// 标的
const setBidListInfoInfo = (state, res) => {
  state.bidListInfoInfoData = res
}
// 支付渠道列表
const setPayChannelList = (state, res) => {
  state.payChannelListData = res
}
// 展示用户详情
const setUserDetailDialogTableVisible = (state, res) => {
  state.userDetailDialogVisible = res
}
// v_0.7.1
// 我的催回
const setMyCaseBackList = (state, res) => {
  state.myCaseBackList = res
}
const setMyAuditListData = (state, res) => {
  state.myAuditListData = res
}
// 案件详情的逾期信息
const setOverDueInfo = (state, res) => {
  state.overTimeInfo = res
}
// 写催记中的useId
const setCaseUserId = (state, res) => {
  state.caseUserId = res
}
// 没词点击写催记都请求接口的判断
const setCaseRecordDialogTableVisible = (state, res) => {
  state.CaseRecordDialogTableVisible = res
}
// 开户行的接口
const setBankList = (state, res) => {
  state.openBankList = res
}
// 短信记录
const setMessageModel = (state, res) => {
  state.messageRecordList = res
}

const setCommonProblemList = (state, res) => {
  state.commonProblemList = res
}
export {
  setCommonProblemList,
  setOperatorIdList,
  setPayHandleList,
  setHandleList,
  setMessageModel,
  setBankList,
  setCaseRecordDialogTableVisible,
  setCaseUserId,
  setOverDueInfo,
  setMyAuditListData,
  setMyCaseBackList,
  setUserDetailLendInfo,
  setUserDetailDialogTableVisible,
  setPayChannelList,
  setBidListInfoInfo,
  setUserDetailBaseInfo,
  changeTopicType,
  getLoanList,
  getLoanDetailInfo,
  refreshLoanDetailInfo,
  getLoanDetailPlan,
  refreshLoanDetailPlan,
  getBackAll,
  getBackOne,
  payOneDetail,
  setSinglePhase,
  getRemitList,
  getLendingList,
  getBreaksList,
  threeChannel,
  signingRecord,
  installmentManage,
  billList,
  billDetailList,
  stickList,
  userLoginInfo,
  getLoanDetail,
  showBackOne,
  setLetterOnList,
  setLetterRecordsList,
  setRemarkRecordsList,
  mandatoryDialog,
  setUserList,
  setBlackList,
  setCreditList,
  setProductList,
  setWaitLendingList,
  setAuditorList,
  updateShowDialog,
  setErrorList,
  setHandleRecordsList,
  setHandleDetail,
  setBreaksEntry,
  setEntryDetail,
  setWaterCenter,
  setCaseDataList,
  setCaseDataOverDueList,
  setCollectionRecords,
  showDialogTableVisible,
  setFormData,
  setCollectionType,
  setCaseSpeed,
  setButtonLimit,
  setOpenAccountList
}
