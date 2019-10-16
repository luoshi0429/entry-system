// components/date-picker/date-picker.js

// 限制在往后1年
const limitMonth = 12;

const ymds = [];
const limitDays = 365;
const now = new Date();
const nowTime = now.getTime();
for (let i = 0; i <= 365; i++) {
  const next = new Date(nowTime + 1000*60*60*24*i);
  const year = next.getFullYear();
  const month = next.getMonth() + 1;
  const day = next.getDate();
  ymds.push(`${year}-${appendZero(month)}-${appendZero(day)}`);
}

// 30min
const hms = [];
for (let i = 0; i < 24; i++) {
 hms.push(`${appendZero(i)}:00`);
  hms.push(`${appendZero(i)}:30`);
}

// console.log(ymds, hms);

// 是否为闰年
function isLeapYear(year) {
  return (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0);
}

// 获取某月的天数
const daysOfMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
function getDaysOfMonth(y, m) {
  if (m === 2 && isLeapYear(y)) {
    return 29;
  }
  return [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m];
}

function appendZero(num) {
  return num >= 10 ? num : ('0' + num);
}

const hour = now.getHours();
const minute = now.getMinutes();
const index = hour * 2 + (minute >= 30 ? 2 : 1);
const firstHm = hms.slice(index);

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    // 年月日
    ymds: ymds,
    // 时分
    hms: hms,
    value: [0, 0]
  },

  attached: function () { }, // 此处attached的声明会被lifetimes字段中的声明覆盖
  // ready: function () {
  //   const now = new Date();
  //   const year = now.getFullYear();
  //   const month = now.getMonth() + 1;
  //   const day = now.getDate();
  //   const hour = now.getHours();
  //   const minite = now.getMinutes();

  //   // 计算两年内
  //   this.setData({
  //     now
  //   });
  // },

  // pageLifetimes: {
  //   // 组件所在页面的生命周期函数
  //   show: function () { },
  //   hide: function () { },
  //   resize: function () { },
  // },

  /**
   * 组件的方法列表
   */
  methods: {
    // 点击取消
    tapCancel() {
      this.triggerEvent('cancel');
    },
    // 点击确认
    tapConfirm() {
      // 判断是否在现在之前
      const ymd = this.data.value[0];
      let hm = this.data.value[1];
      const timeStr = `${this.data.ymds[ymd]} ${this.data.hms[hm]}`;
      // TODO: 分钟数 00:00 -> 不能补零。 否则报错
      const selectedDate = new Date(timeStr).getTime();
      if (selectedDate <= Date.now()) {
        wx.showToast({
          title: '不能早于现在',
          icon: 'none',
          duration: 1500
        });
        return;
      }
      console.log(selectedDate);
      this.triggerEvent('confirm', timeStr);
    },
    bindChange(e) {
      const val = e.detail.value;
      const ymd = val[0];
      let hm = val[1];
      const currentYmd = this.data.value[0];
      if (ymd !== currentYmd) {
        hm = 0;
      }
      this.setData({
        value: [ymd, hm]
      });
      console.log(e);
    }
  }
})
