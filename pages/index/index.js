//logs.js
const util = require('../../utils/util.js')
const baseUrl = 'http://hilldren.oicp.net:31560/api/MainApi'
Page({
  data: {
    areaCode: '4401',
    showDatePicker: false,
    allMarketing: false,
    baobeiList: [],
    Tel1Prefix3: '', // 用户手机号1前三位
    Tel1Suffix4: '', // 用户手机号1后四位
    Tel2Prefix3: '', // 用户手机号2前三位
    Tel2Prefix3: '', // 用户手机号2后四位
    UName: '', // 用户姓名
    SName: '', // 销售人员姓名
    ArrivalTime: '', // 预计到访时间, 格式 2019 - 10 - 01
    BaoBeiIdCardNum: '', // 报备人员身份证号
    BaoBeiTel: '' // 报备人员手机号
    // ProID(string, optional): 报备项目的GUID ,
    // ArrivalTime(string, optional): 预计到访时间, 格式 2019 - 10 - 01,
    // QuDaoID(string, optional): 渠道的GUID ,
  },
  onLoad() {
    this.getCurLocation();
    this.getBaobeiInfo();
  },
  getCurLocation() {
    wx.getLocation({
      success(res) {
        console.log('----', res);
      }
    });
  },
  getBaobeiInfo() {
    wx.request({
      url: baseUrl + '/QueryBaoBeiProList?AreaCode=' + this.areaCode,
      success(res) {
        if (res.status === 0) {
          this.setData({
            baobeiList: res.data
          });
        }
      },
      fail(err) {

      }
    });
  },
  getQuDaoInfo() {
    wx.request({
      url: baseUrl + '/QueryQuDaoList?ProID=1',
      success() {

      },
      fail() {

      }
    });
  },
  tapShowVisitTime() {
    this.setData({
      showDatePicker: true
    });
  },
  handleCancelDatePicker() {
    this.setData({
      showDatePicker: false
    });
  },
  handlePickDate(e) {
    this.setData({
      showDatePicker: false
    });
    console.log(e);
  },
  tapReset() {
    this.setData({
      baobeiList: [],
      Tel1Prefix3: '', // 用户手机号1前三位
      Tel1Suffix4: '', // 用户手机号1后四位
      Tel2Prefix3: '', // 用户手机号2前三位
      Tel2Prefix3: '', // 用户手机号2后四位
      UName: '', // 用户姓名
      SName: '', // 销售人员姓名
      ArrivalTime: '', // 预计到访时间, 格式 2019 - 10 - 01
      BaoBeiIdCardNum: '', // 报备人员身份证号
      BaoBeiTel: '' // 报备人员手机号
    });
  },
  tapSubmit() {
    const { Tel1Prefix3, Tel1Suffix4, Tel2Prefix3, Tel2Suffix4, UName, SName, ArrivalTime, BaoBeiIdCardNum, BaoBeiTel } = this.data;
    wx.request({
      url: baseUrl + '/AddBaoBei',
      method: 'POST',
      data: {
        Tel1Prefix3,
        Tel1Suffix4,
        Tel2Prefix3,
        Tel2Prefix3,
        UName,
        SName,
        ArrivalTime,
        BaoBeiIdCardNum,
        BaoBeiTel
        // ProID(string, optional): 报备项目的GUID ,
        // Tel1Prefix3(string, optional): 用户手机号1前三位 ,
        // Tel1Suffix4(string, optional): 用户手机号1后四位 ,
        // Tel2Prefix3(string, optional): 用户手机号2前三位 ,
        // Tel2Suffix4(string, optional): 用户手机号2后四位 ,
        // UName(string, optional): 用户姓名 ,
        // SName(string, optional): 销售人员姓名 ,
        // ArrivalTime(string, optional): 预计到访时间, 格式 2019 - 10 - 01,
        // QuDaoID(string, optional): 渠道的GUID ,
        // BaoBeiIdCardNum(string, optional): 报备人员身份证号 ,
        // BaoBeiTel(string, optional): 报备人员手机号  
      },
      success() {

      },
      fail() {

      }
    });
  },
  // 切换全民营销
  tapAllMarketingRadio() {
    this.setData({
      allMarketing: !this.data.allMarketing
    });
  }
})
