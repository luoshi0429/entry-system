let QQMapWX = require('../../utils/qqmap-wx-jssdk1.2/qqmap-wx-jssdk.js');
let qqmapsdk;

const baseUrl = 'http://hilldren.oicp.net:31560/api/MainApi'
Page({
  data: {
    hideBaobeiList: true,
    hideQudaoList: true,
    areaCode: '4401',
    province: '',
    city: '',
    showDatePicker: false,
    allMarketing: false,
    baobeiList: [],
    qudaoList: [],
    selectedBaobei: {},
    selectedQudao: {},
    Tel1Prefix3: '', // 用户手机号1前三位
    Tel1Suffix4: '', // 用户手机号1后四位
    Tel2Prefix3: '', // 用户手机号2前三位
    Tel2Suffix4: '', // 用户手机号2后四位
    UName: '', // 用户姓名
    SName: '', // 销售人员姓名
    ArrivalTime: '', // 预计到访时间, 格式 2019 - 10 - 01
    BaoBeiIdCardNum: '', // 报备人员身份证号
    BaoBeiTel: '' // 报备人员手机号
  },
  onLoad() {
    qqmapsdk = new QQMapWX({
      key: 'D73BZ-Z4UC4-EK7U5-XY6O5-BB36S-5CFZY'
    });
    this.getUserLocation();
  },
  getUserLocation() {
    const that = this;
    wx.getSetting({
      success: (res) => {
        // res.authSetting['scope.userLocation'] == undefined    表示 初始化进入该页面
        // res.authSetting['scope.userLocation'] == false    表示 非初始化进入该页面,且未授权
        // res.authSetting['scope.userLocation'] == true    表示 地理位置授权
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          that.showLocationModal();
        } else if (res.authSetting['scope.userLocation'] == undefined) {
          //调用wx.getLocation的API
          that.getLocation();
        }
        else {
          //调用wx.getLocation的API
          that.getLocation();
        }
      }
    })
  },
  // 微信获得经纬度
  getLocation() {
    const that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        const latitude = res.latitude;
        const longitude = res.longitude;
        that.getLocal(latitude, longitude)
      },
      fail: function (res) {
        that.showLocationModal();
      }
    })
  },
  // 获取当前地理位置
  getLocal(latitude, longitude) {
    const that = this;
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      success: function (res) {
        const city = res.result.ad_info.city;
        that.getBaobeiInfo(city);
      },
      fail: function (err) {
        wx.showToast({
          title: '获取城市失败',
          icon: 'none',
          duration: 1000
        });
      }
    });
  },
  showLocationModal() {
    const that = this;
    wx.showModal({
      title: '请求授权当前位置',
      content: '需要获取您的地理位置，请确认授权',
      showCancel: false,
      success: function (res) {
        if (res.cancel) {
          wx.showToast({
            title: '拒绝授权',
            icon: 'none',
            duration: 1000
          });
        } else if (res.confirm) {
          wx.openSetting({
            success(dataAu) {
              if (dataAu.authSetting["scope.userLocation"] == true) {
                wx.showToast({
                  title: '授权成功',
                  icon: 'none',
                  duration: 1000
                });
                //再次授权，调用wx.getLocation的API
                that.getLocation();
              } else {
                wx.showToast({
                  title: '授权失败',
                  icon: 'none',
                  duration: 1000
                });
                that.showLocationModal();
              }
            }
          })
        }
      }
    });
  },

  getBaobeiInfo(city) {
    const that = this;
    wx.request({
      url: baseUrl + '/QueryBaoBeiProList?CityName=' + city,
      success(res) {
        res = res.data;
        if (res.status === 0) {
          // // TODO: test
          // const test = Object.assign({}, res.data[0]);
          // test.IsMarketing = false;
          // test.ProName = '测试项目';
          // res.data.push(test)
          // // TODO: test
          that.setData({
            baobeiList: res.data
          });
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none',
            duration: 1000
          });
        }
      },
      fail(err) {
        wx.showToast({
          title: '获取报备项目失败',
          icon: 'none',
          duration: 1000
        });
      }
    });
  },
  getQuDaoInfo(ProCode) {
    const that = this;
    wx.request({
      url: baseUrl + '/QueryQuDaoList?ProID=' + ProCode,
      success(res) {
        res = res.data;
        if (res.status === 0) {
          that.setData({
            qudaoList: res.data
          });
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none',
            duration: 1000
          });
        }
      },
      fail() {
        wx.showToast({
          title: '获取渠道信息失败',
          icon: 'none',
          duration: 1000
        });
      }
    });
  },
  // 选择报备项目
  handleBaobeiChanged(e) {
    const baobei = e.detail;
    this.setData({
      selectedBaobei: baobei,
      selectedQudao: {},
      allMarketing: false,
      SName: '',
      BaoBeiIdCardNum: '',
    });
    this.getQuDaoInfo(baobei.ProCode);
  },
  // 选择渠道
  handleQudaoChanged(e) {
    this.setData({
      selectedQudao: e.detail
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
    const time = e.detail;
    this.setData({
      showDatePicker: false,
      ArrivalTime: e.detail
    });
  },
  handleInput(e) {
    const id = e.target.id;
    const val = e.detail.value;
    this.setData({
      [id]: val
    });
  },
  checkPhone(num) {
    return /^1[3456789]\d{9}$/.test(num);
  },
  tapReset() {
    this.setData({
      allMarketing: false,
      baobeiList: this.data.baobeiList,
      qudaoList: [],
      selectedBaobei: {},
      selectedQudao: {},
      Tel1Prefix3: '', // 用户手机号1前三位
      Tel1Suffix4: '', // 用户手机号1后四位
      Tel2Prefix3: '', // 用户手机号2前三位
      Tel2Suffix4: '', // 用户手机号2后四位
      UName: '', // 用户姓名
      SName: '', // 销售人员姓名
      ArrivalTime: '', // 预计到访时间, 格式 2019 - 10 - 01
      BaoBeiIdCardNum: '', // 报备人员身份证号
      BaoBeiTel: '' // 报备人员手机号
    });
  },
  tapSubmit() {
    const { Tel1Prefix3, Tel1Suffix4, Tel2Prefix3, Tel2Suffix4, UName, SName, ArrivalTime, BaoBeiIdCardNum, BaoBeiTel, selectedBaobei, selectedQudao, allMarketing } = this.data;
    // 非空判断
    let error = '';
    if (allMarketing) {
      if (!BaoBeiIdCardNum) {
        error = '请输入报备人员身份证号码';
      }
      if (!/(^\d{15}$)|(^\d{17}(\d|X)$)/.test(BaoBeiIdCardNum)) {
        error = '请输入正确的身份证号码';
      }
      if (!SName) {
        error = '请输入报备人员姓名';
      }
    }
    if (!BaoBeiTel) {
      error = '请输入报备人员手机号';
    }
    if (!this.checkPhone(BaoBeiTel)) {
      error = '请输入正确的报备手机号';
    }
    // 渠道QuDaoID
    if (!allMarketing && !selectedQudao.Guid) {
      error = '请选择渠道公司';
    }
    if (!ArrivalTime) {
      error = '请选择预计到访时间';
    }
    if (!UName) {
      error = '请输入用户姓名';
    }
    if (!Tel1Prefix3 || !Tel1Suffix4) {
      error = '请输入手机号码1';
    }
    if (!selectedBaobei.Guid) {
      // ProID
      error = '请选择报备项目';
    }

    if (error) {
      wx.showToast({
        title: error,
        icon: 'none',
        duration: 2000
      });
      return;
    }

    // 判断
    const other = {};
    if (allMarketing) {
      other.SName = SName;
      other.BaoBeiIdCardNum = BaoBeiIdCardNum; 
    } else {
      other.QuDaoID = selectedQudao.Guid;
    }

    this.requestSubmit({
      ProID: selectedBaobei.Guid, // 报备项目的GUID
      Tel1Prefix3, // 用户手机号1前三位
      Tel1Suffix4, // 用户手机号1后四位
      Tel2Prefix3, // 用户手机号2前三位
      Tel2Suffix4, // 用户手机号2后四位
      UName, // 用户姓名
      ArrivalTime, // 预计到访时间, 格式 2019 - 10 - 01
      BaoBeiTel, // 报备人员手机号
      ...other
      // QuDaoID: selectedQudao.Guid, // 渠道的GUID
      // SName, // 销售人员姓名
      // BaoBeiIdCardNum, // 报备人员身份证号
    });
  },
  requestSubmit(data) {
    const that = this;
    wx.request({
      url: baseUrl + '/AddBaoBei',
      method: 'POST',
      data,
      success(res) {
        res = res.data;
        if (res.status === 0) {
          wx.showModal({
            title: '报备成功',
            showCancel: false,
            success(res) {
              if (res.confirm) {
                that.tapReset();
              }
            }
          });
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none',
            duration: 1000
          });
        }
      },
      fail() {
        wx.showToast({
          title: '报备失败',
          icon: 'none',
          duration: 1000
        });
      }
    });
  },
  // 切换全民营销
  tapAllMarketingRadio() {
    this.setData({
      allMarketing: !this.data.allMarketing
    });
  },
  // 点击界面
  tapHomepage() {
    this.setData({
      hideBaobeiList: true,
      hideQudaoList: true,
    });
  },
  handleBaobeiExpand(e) {
    this.setData({
      hideBaobeiList: !e.detail,
      hideQudaoList: true
    });
  },
  handleQudaoiExpand(e) {
    this.setData({
      hideQudaoList: !e.detail,
      hideBaobeiList: true
    });
  }
})
