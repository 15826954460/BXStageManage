const state = {
  tabType: 1, // 数据跟新之后显示第一个tab标签
  changeTabTypeInsert: 1,
  refreshAgain: false,
  fetchContact: false,
  resetCirculationType: false,
  showBtn: true,
  rightWidth: false, // 铺满全屏
  smsShow: false, // 显示发送短信
  remarkShow: false, // 显示备注
  passShow: false, // 显示通过
  showContacts: true, // 显示联系人,
  circulationShow: false, // 显示流转
  codeTypeOptions: null, // 流转码的类型
  codeType: null // // 获取流转码的类型 （五个按钮对应的不同流转码的类型）
}
const getters = {}
const actions = {}
const mutations = {
  // 更改 changeTabTypeInsert
  changeTabTypeInsert(state, val) {
    state.changeTabTypeInsert = val
  },
  // 更改tab
  changeTabType(state, val) {
    state.tabType = val
  },
  // 是否重新刷新页面
  refreshAgain(state, val) {
    state.refreshAgain = val
  },
  // 点击通讯录接口
  fetchContact(state, val) {
    state.fetchContact = val
  },
  // 不现实按钮
  isShowBtn(state, val) {
    state.showBtn = val
  },
  // 是否全部展开
  changeRightWidth(state, val) {
    state.rightWidth = val
  },
  // 显示联系人
  showContacts(state, val) {
    state.remarkShow = val
    state.passShow = val
    state.circulationShow = val
    state.smsShow = val
    state.showContacts = !val
  },
  // 关闭所有流转弹框
  closeCirculation(state, val) {
    state.remarkShow = val
    state.passShow = val
    state.circulationShow = val
    state.smsShow = val
    state.showContacts = val
  },
  // 发送短信
  clickSms(state, val) {
    state.remarkShow = !val
    state.passShow = !val
    state.circulationShow = !val
    state.smsShow = val
    state.showContacts = !val
  },
  // 备注
  clickRemark(state, val) {
    state.smsShow = !val
    state.remarkShow = val
    state.passShow = !val
    state.circulationShow = !val
    state.showContacts = !val
  },
  // 通过
  clickPass(state, val) {
    state.smsShow = !val
    state.remarkShow = !val
    state.passShow = val
    state.circulationShow = !val
    state.showContacts = !val
  },
  // 流转
  clickCirculation(state, val) {
    state.smsShow = !val
    state.remarkShow = !val
    state.passShow = !val
    state.circulationShow = val
    state.showContacts = !val
  },
  // 初始化流转码的类型
  initCodeTypeOptions(state, val) {
    state.codeTypeOptions = val
  },
  // 设置流转码的类型
  setCodeType(state, val) {
    if (val) {
      state.codeType = val
    }
  },
  // 每次打开流转页面重置流转原因类型
  resetCirculationTypeStatus(state, val) {
    state.resetCirculationType = val
  }
}
export default {
  state,
  getters,
  actions,
  mutations
}
