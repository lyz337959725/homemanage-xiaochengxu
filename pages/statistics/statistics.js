// pages/statistics/statistics.js
import * as echarts from '../../ec-canvas/echarts';
const app = getApp();


var spendData = []
var incomeData = []
var typeData = []
var legendData = []
Page({

  /**
   * 页面的初始数据
   */
  data: {
    book:"",
    ec: {
      lazyLoad: true
    },
    ecPie: {
      lazyLoad: true
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.histogram = this.selectComponent('#histogram');
    this.pie = this.selectComponent('#pie');
    wx.getStorage({
      key: 'book',
      success: res => {
        if (res.data) {
          this.data.book = res.data
          this.getSpendData()
          this.getTypeData()
        }
      }
    })

  },

  initChart:function() {
    this.histogram.init((canvas, width, height) => {
      // 初始化图表
      const Chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      Chart.setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999"
            }
          }
        },
        legend: {
          data: ["收入", "支出"]
        },
        xAxis: [
          {
            type: "category",
            data: [
              "1月",
              "2月",
              "3月",
              "4月",
              "5月",
              "6月",
              "7月",
              "8月",
              "9月",
              "10月",
              "11月",
              "12月"
            ],
            axisPointer: {
              type: "shadow"
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            name: "金额（元）"
          }
        ],
        series: [
          {
            name: "收入",
            type: "bar",
            itemStyle: {
              color: "#67C23A"
            },
            data: incomeData
          },
          {
            name: "支出",
            type: "bar",
            itemStyle: {
              color: "#F56C6C"
            },
            data: spendData
          }
        ]
      });
      return Chart
    });
  },

  getSpendData:function(){
    wx.request({
      url: app.globalData.baseUrl + `/statistics/finace/month/${this.data.book}`,
      success: res => {
        if (res.data.data.length > 0) {
          let spends = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
          let incomes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
          for (let m of res.data.data) {
            let index = parseInt(m.months) - 1;
            spends[index] = m.spendAmount;
            incomes[index] = m.incomeAmount;
            // this.monthTableData[index].spendAmount = m.spendAmount;
            // this.monthTableData[index].incomeAmount = m.incomeAmount;
          }
          spendData = spends
          incomeData = incomes
          this.initChart()
        }
      }
    })
  },

  getTypeData:function(){
    wx.request({
      url: app.globalData.baseUrl + `/statistics/finace/type/${this.data.book}/${0}`,
      success: res => {
        console.log(res)
        typeData = res.data.data
        let titles = []
        for (let t of typeData) {
          titles.push(t.name)
        }
        legendData = titles
        this.initPieChart()
      }
    })
  },

  initPieChart: function () {
    this.pie.init((canvas, width, height) => {
      // 初始化图表
      const pieChart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      pieChart.setOption({
        title: {
          text: '按支出类别（大类）展示',
          x: 'center'
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          left: "1%",
          top: 'middle',
          data: legendData
        },
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: typeData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      });
      return pieChart
    });
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