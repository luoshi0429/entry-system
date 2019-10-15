// components/date-picker/date-picker.js

// const now = new Date();
// const year = now.getFullYear();
// const month = now.getMonth() + 1;
// const day = now.getDate();
// const hour = now.getHours();
// const minite = now.getMinutes();

// 限制在往后1年
const limitMonth = 12;
// 一个月30天
const m30 = [4, 6, 9, 11];
// 一个月31天
const m31 = [1, 3, 5, 7, 8, 10, 12];

const ymds = [];
const limitDays = 365;
const nowTime = Date.now();
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

console.log(ymds, hms);

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
  return num >= 10 ? num : '0' + num;
}

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
    current: {}
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
      this.triggerEvent('confirm');
    },
    bindChange(e) {
      console.log(e);
    }
  }
})
