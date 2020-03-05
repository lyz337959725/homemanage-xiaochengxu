// pages/bill/addbill.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    income: "false",
    typeId: "",
    spend: "",
    spendDate: "",
    content: "",
    personId: "",
    bookId: 0,
    personList:[],
    personTip: "请点击选择",
    types:"",
    typeTip:"请点击选择",
    typeSelector: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({spendDate : this.getDate()})
    wx.request({
      url: app.globalData.baseUrl + '/bill/type',
      success: res => {
        if(res.data.success){
          this.data.types = res.data.data
          this.setData({ typeSelector: [this.data.types, (this.data.types[0].children != null ? this.data.types[0].children:[])] })
        }
      }
    })
    wx.request({
      url: app.globalData.baseUrl + '/bill/person',
      success: res => {
        if (res.data.success) {
          this.setData({personList:res.data.data})
        }
      }
    })
    wx.getStorage({
      key: 'book',
      success: res => {
        if (res.data) {
          this.data.bookId = res.data
        }
      }
    })
  },

  changeType: function (e) {
    this.setData({
      typeTip: (this.data.types[e.detail.value[0]].children ? this.data.types[e.detail.value[0]].children[e.detail.value[1]].name : this.data.types[e.detail.value[0]].name),
      typeId: (this.data.types[e.detail.value[0]].children ? this.data.types[e.detail.value[0]].children[e.detail.value[1]].id : this.data.types[e.detail.value[0]].id)
    })
  },

  changeTypeColumn: function (e) {
    if (e.detail.column == 0){
      this.setData({ typeSelector: [this.data.types, (this.data.types[e.detail.value].children != null ? this.data.types[e.detail.value].children : [])] })
    }
  },

  changeDate:function(e){
    this.setData({ spendDate: e.detail.value})
  },

  changePerson:function(e){
    this.setData({
      personId:this.data.personList[e.detail.value].id,
      personTip: this.data.personList[e.detail.value].name,
    })
  },

  spendChange:function(e){
    this.setData({
      spend: e.detail.value
    })
  },

  contentChange: function (e) {
    this.setData({
      content: e.detail.value
    })
  },

  getDate:function(){
    var date = new Date();
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    return y + '-' + m + '-' + d;
  },

  submit: function () {
    if(this.data.typeId == "" || this.data.spend == "" || this.data.content == ""){
      wx.showToast({
        title: '请完善信息',
        icon: 'none',
        duration: 2000
      })
      return
    }
    wx.request({
      url: app.globalData.baseUrl + '/bill',
      method: "POST",
      data:{
        "income": this.data.income,
        "typeId": this.data.typeId,
        "spend": this.data.spend,
        "spendDate": this.data.spendDate,
        "content": this.data.content,
        "personId": this.data.personId,
        "creator": app.globalData.userName,
        "bookId": this.data.bookId
      },
      success: res => {
        wx.showToast({
          title: '添加成功',
          icon: 'success',
          duration: 2000
        })
        this.setData({
          spend: "",
          content: "",
        })
      },
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})