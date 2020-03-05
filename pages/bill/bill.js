// pages/bill/bill.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    queryForm: {
      word: "",
      person: "",
      type: "",
      book: "",
      size: 10,
      page: 0
    },
    books: [],
    bills: [],
    loadingState: true,
    allLoadState: true,
    total: 0,
    totalPage: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getStorage({
      key: 'book',
      success: res => {
        if (res.data) {
          this.data.queryForm.book = res.data
          this.getAllBillsByBook();
        }
      }
    })
    wx.request({
      url: app.globalData.baseUrl + '/bill/book',
      success: res => {
        this.setData({ books: res.data.data })
        app.globalData
      }
    })
  },

  handleBookChange: function (e) {
    this.setData({
      queryForm: {
        word: "",
        person: "",
        type: "",
        book: "",
        size: 10,
        page: 0
      },
      bills: [],
      loadingState: true,
      allLoadState: true,
      total: 0,
      totalPage: 0
    })
    this.data.queryForm.book = this.data.books[e.detail.value].id
    wx.setStorage({
      key: "book",
      data: this.data.books[e.detail.value].id
    })
    this.getAllBillsByBook();
  },

  getAllBillsByBook() {
    wx.request({
      url: app.globalData.baseUrl + '/bill/bills',
      data: this.data.queryForm,
      method: "POST",
      success: res => {
        this.setData({
          bills: this.data.bills.concat(res.data.data.data),
          total: res.data.data.total,
          totalPage: Math.ceil(res.data.data.total / this.data.queryForm.size) - 1,
          loadingState: true
        })
      }
    })
  },

  addBill: function () {
    wx.navigateTo({
      url: 'addbill',
      // events: {
      //   // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
      //   acceptDataFromOpenedPage: function (data) {
      //     console.log(data)
      //   },
      //   someEvent: function (data) {
      //     console.log(data)
      //   }
      // },
      // success: function (res) {
      //   // 通过eventChannel向被打开页面传送数据
      //   res.eventChannel.emit('acceptDataFromOpenerPage', { data: 'test' })
      // }
    })
  },

  /**
 * 页面上拉触底事件的处理函数
 */
  onReachBottom: function () {
    if (this.data.queryForm.page < this.data.totalPage) {
      this.data.queryForm.page += 1
      this.setData({ loadingState: false })
      this.getAllBillsByBook()
    } else {
      this.setData({ allLoadState: false })
    }
  },

  /**
 * 生命周期函数--监听页面显示
 */
  onShow: function () {
    this.onLoad()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})