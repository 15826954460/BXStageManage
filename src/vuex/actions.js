import api from '../untils/interception'
// 借款管理-借款列表
const getLoanList = ({commit}, data) => {
  api.post('loan/list', data).then((res) => {
    commit('getLoanList', res)
  })
}
// 借款管理--借款详情-借款信息
const getLoanDetailInfo = ({commit}, data) => {
  api.post('loan/info', data).then((res) => {
    commit('getLoanDetailInfo', res)
    commit('refreshLoanDetailInfo', true)
  })
}
// 借款管理--借款详情-还款计划表
const getLoanDetailPlan = ({commit}, data) => {
  api.post('loan/phase', data).then((res) => {
    commit('getLoanDetailPlan', res)
    commit('refreshLoanDetailPlan', true)
  })
}
// 借款管理--借款详情-还款计划表--获取全部还款数据
const getBackAll = ({commit}, data) => {
  api.post('loan/phase/repayAllInfo', data).then((res) => {
    commit('getBackAll', res)
  })
}
// 单期还款
const getBackOne = ({commit}, data) => {
  api.post('loan/phase/repayInfo', data).then((res) => {
    commit('getBackOne', res)
    commit('showBackOne', true)
  })
}
// 单期支付记录明细接口
const payOneDetail = ({commit}, data) => {
  api.post('loan/phase/detail', data).then((res) => {
    commit('payOneDetail', res)
  })
}
// 交易记录--减免
const getRemitList = ({commit}, data) => {
  api.post('chargeRecord/remitList', data).then((res) => {
    commit('getRemitList', res)
  })
}
// 交易记录--放款
const getLendingList = ({commit}, data) => {
  api.post('release/releaseList', data).then((res) => {
    commit('getLendingList', res)
  })
}
// 交易记录--还款
const getBreaksList = ({commit}, data) => {
  api.post('/chargeRecord/chargeList', data).then((res) => {
    commit('getBreaksList', res)
  })
}
// 借款详情--交易信息
const getRecordInfo = ({commit}, data) => {
  api.post('chargeRecord/chargeInfo', data).then((res) => {
    commit('getLoanDetail', res)
  })
}
// 支付中心-三大渠道接口
const threeChannel = ({commit}, data) => {
  api.post('payRouter/listPayRouter', data).then((res) => {
    commit('threeChannel', res)
  })
}
// 期次管理列表
const installmentManage = ({commit}, data) => {
  api.post('phase/list', data).then((res) => {
    commit('installmentManage', res)
  })
}
// 签约记录
const getSigningRecord = ({commit}, data) => {
  api.post('signRecord/signRecordList', data).then((res) => {
    commit('signingRecord', res)
  })
}
// 账单列表
const getBillList = ({commit}, data) => {
  api.post('bill/list', data).then((res) => {
    commit('billList', res)
  })
}
// 账单列表
const getBillDetailList = ({commit}, data) => {
  api.post('bill/detail', data).then((res) => {
    commit('billDetailList', res)
  })
}
// 邦卡列表
const getStickList = ({commit}, data) => {
  api.post('userBank/userBankList', data).then((res) => {
    commit('stickList', res)
  })
}
// v_0.2
// 审批订单池
const getLetterOnList = ({commit}, data) => {
  api.post('auditOrder/auditOrderList', data).then((res) => {
    commit('setLetterOnList', res)
  })
}
// 审批记录
const getLetterRecordsList = ({commit}, data) => {
  api.post('auditOrder/orderAuditRecord', data).then((res) => {
    commit('setLetterRecordsList', res)
  })
}
// 备注记录
const getRemarkRecordsList = ({commit}, data) => {
  api.post('auditOrder/orderRemarkRecord', data).then((res) => {
    commit('setRemarkRecordsList', res)
  })
}
// 用户列表
const getUserList = ({commit}, data) => {
  api.post('user/list', data).then((res) => {
    commit('setUserList', res)
  })
}
// 黑名单列表
const getBlackList = ({commit}, data) => {
  api.post('blackList/list', data).then((res) => {
    commit('setBlackList', res)
  })
}
// 授信列表
const getCreditList = ({commit}, data) => {
  api.post('credit/list', data).then((res) => {
    commit('setCreditList', res)
  })
}
// 产品列表
const getProductList = ({commit}, data) => {
  api.post('loanProduct/list', data).then((res) => {
    commit('setProductList', res)
  })
}
// 贷放款列表
const getWaitLendingList = ({commit}, data) => {
  api.post('release/waitReleaseList', data).then((res) => {
    commit('setWaitLendingList', res)
  })
}
// 审批人接口
const getAuditorList = ({commit}, data) => {
  api.post('audit/listAuditors', data).then((res) => {
    // 初始化全局公用的审批人列表
    res.unshift({id: null, name: '全部'})
    commit('setAuditorList', res)
  })
}
// 处理人接口
const getHandleList = ({commit}, data) => {
  api.post('cs/listAuditors', data).then((res) => {
    // 初始化全局公用的审批人列表
    res.unshift({id: null, name: '全部'})
    commit('setHandleList', res)
  })
}
// 财务操作人接口
const getPayHandleList = ({commit}, data) => {
  api.post('pay/listAuditors', data).then((res) => {
    // 初始化全局公用的审批人列表
    res.unshift({id: null, name: '全部'})
    commit('setPayHandleList', res)
  })
}
// 放款/还款异常列表接口
const getErrorList = ({commit}, data) => {
  api.post('cs/pageAbnormalOrder', data).then((res) => {
    commit('setErrorList', res)
  })
}
// 催收员操作列表
const getOperatorIdList = ({commit}, data) => {
  api.post('dun/listDunOperator', data).then((res) => {
    res.unshift({operatorId: null, operator: '全部'})
    commit('setOperatorIdList', res)
  })
}
// 处理记录接口
const getHandleRecordsList = ({commit}, data) => {
  api.post('cs/getCSOperatorRecordList', data).then((res) => {
    commit('setHandleRecordsList', res)
  })
}
// 处理详情
const getHandleDetail = ({commit}, data) => {
  api.post('cs/csOperator', data).then((res) => {
    commit('setHandleDetail', res)
  })
}
// 还款录入
const getBreaksEntry = ({commit}, data) => {
  api.post('charge/transferList', data).then((res) => {
    commit('setBreaksEntry', res)
  })
}
// 还款录入明细，减免明细
const getEntryDetail = ({commit}, data) => {
  api.post('chargeRecord/chargeDetail', data).then((res) => {
    commit('setEntryDetail', res)
  })
}
// 流水中心
const getWaterCenter = ({commit}, data) => {
  api.post('funds/listFundsRecord', data).then((res) => {
    commit('setWaterCenter', res)
  })
}
// 案件列表
const getCaseDataList = ({commit}, data) => {
  api.post('dun/dunCaseList', data).then((res) => {
    commit('setCaseDataList', res)
  })
}
// 案件详情 中的期次列表
const getCaseDataOverDueList = ({commit}, data) => {
  api.post('dun/overDueList', data).then((res) => {
    commit('setCaseDataOverDueList', res)
  })
}
// 案件详情中催收记录 /api/dun/listDunRecord
const getCollectionRecords = ({commit}, data) => {
  api.post('dun/listDunRecord', data).then((res) => {
    commit('setCollectionRecords', res)
  })
}
// 案件进度
const caseSpeed = ({commit}, data) => {
  api.post('dun/overDueProgressInfo', data).then((res) => {
    commit('setCaseSpeed', res)
  })
}
// 0.6.1  权限接口
const buttonLimit = ({commit}) => {
  api.post('security/userButton').then((res) => {
    commit('setButtonLimit', res)
  })
}
// 0.7.0
const OpenAccount = ({commit}, data) => {
  api.post('user/accountRecord', data).then((res) => {
    commit('setOpenAccountList', res)
  })
}
// 用户详情的基本信息
const userDetailBaseInfo = ({commit}, data) => {
  api.post('user/userBaseInfo', data).then((res) => {
    commit('setUserDetailBaseInfo', res)
  })
}
// 用户详情的借款信息
const userDetailLendInfo = ({commit}, data) => {
  api.post('loan/loanInfos', data).then((res) => {
    commit('setUserDetailLendInfo', res)
  })
}
// 标的
const bidListInfo = ({commit}, data) => {
  api.post('bid/listPageBidInfo', data).then((res) => {
    commit('setBidListInfoInfo', res)
  })
}
// 支付渠道列标接口
const payChannelList = ({commit}, data) => {
  api.post('payRouter/pagePayRouter', data).then((res) => {
    commit('setPayChannelList', res)
  })
}
// v_0.7.1
// 我的催回
const myCaseBack = ({commit}, data) => {
  api.post('dun/dunCasePhasePage', data).then((res) => {
    commit('setMyCaseBackList', res)
  })
}
// 我的审批
const getMyAuditList = ({commit}, data) => {
  api.post('auditOrder/listPageAuditOrderOfLoginUser ', data).then((res) => {
    commit('setMyAuditListData', res)
  })
}
// 案件详情的逾期信息
const getOverTimeInfo = ({commit}, data) => {
  api.post('dun/overDueInfo', data).then((res) => {
    commit('setOverDueInfo', res)
  })
}
// 获取银行列表接口
const getBankList = ({commit}, data) => {
  api.post('bankWay/list', data).then((res) => {
    res.unshift({
      bankWay: null,
      bankName: '全部',
      visible: true,
      remark: ''
    })
    commit('setBankList', res)
  })
}
// 短信记录 （用户 => 短信 => 短信记录  用户详情 tab => 短信记录）
const getMessageModel = ({commit}, data) => {
  api.post('sms/smsRecordPage', data).then((res) => {
    commit('setMessageModel', res)
  })
}
// 获取常见问题列表
const getCommonProblemList = ({commit}, data) => {
  api.post('common/commonProblemList', data).then((res) => {
    commit('setCommonProblemList', res)
  })
}
export {
  getCommonProblemList,
  getOperatorIdList,
  getPayHandleList,
  getHandleList,
  getMessageModel,
  getBankList,
  getOverTimeInfo,
  getMyAuditList,
  myCaseBack,
  payChannelList,
  bidListInfo,
  userDetailLendInfo,
  userDetailBaseInfo,
  getLoanList,
  getLoanDetailInfo,
  getLoanDetailPlan,
  getBackAll,
  getBackOne,
  payOneDetail,
  getRemitList,
  getLendingList,
  getBreaksList,
  getRecordInfo,
  threeChannel,
  installmentManage,
  getSigningRecord,
  getBillList,
  getBillDetailList,
  getStickList,
  getLetterOnList,
  getRemarkRecordsList,
  getLetterRecordsList,
  getUserList,
  getBlackList,
  getCreditList,
  getProductList,
  getWaitLendingList,
  getAuditorList,
  getErrorList,
  getHandleRecordsList,
  getHandleDetail,
  getBreaksEntry,
  getEntryDetail,
  getWaterCenter,
  getCaseDataList,
  getCaseDataOverDueList,
  getCollectionRecords,
  caseSpeed,
  buttonLimit,
  OpenAccount
}
