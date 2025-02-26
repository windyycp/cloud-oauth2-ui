//定义内容
export default {
    worktablehome: {
      pendingOrder: '待处理工单',
      pendingAlarm: '待处理告警',
      stationOverview: '站点概览',
      more: '更多',
      stationName: '站点名称',
      alarmNum: '告警数',
      malfunctionNum: '故障数',
      stationTotalNum: '电站总数',
      stationAlarmNUm: '电站总告警数',
      profitStatistics: '收益统计',
      CNY: '元',
      revenue: '收益',
      targetRevenue: '目标收益',
      totalRevenue: '总收益',
      yesterdayRevenue: "昨日收益",
      stationRevenueRanking: '电站收益排名',
      electricityStatistics: '电量统计',
      totalCharge: '总充电量',
      totalDischarge: '总放电量',
      stationSystemEfficiencyRanking: '电站系统效率排名',
      teamManagerment: '团队管理',
    },

    role: {
        administrator: '系统管理员',
    },  

    greeting: {
        weehours: '凌晨好',
        zaoshang: '早上好',
        morning: '上午好',
        zhongwu: '中午好',
        afternoon: '下午好',
        evening: '傍晚好',
        wanshang: '晚上好',
        night: '夜里好',
    },
    
    profitCurve: {
        title: '近一月收益趋势',
        tooltip: {
            valueFormatter: function (value) {
              return value + ' 元';
            },
          },
          xAxis: {
            name: '日期',
          },
          yAxis: {
            revenue: '收益',
            targetRevenue: '目标收益',
          },
          legend: {
            revenue: '收益',
            targetRevenue: '目标收益',
          },
    },

    quantityCurve: {
        title: '近一月充放电量趋势',
        tooltip: {
            valueFormatter: function (value) {
              return value + ' kWh';
            },
          },
          xAxis: {
            name: '日期',
          },
          yAxis: {
            chargeQuantity: '充电量',
            dischargeQuantity: '放电量',
            targetChargeQuantity: '目标充电量',
            targetDischargeQuantity: '目标放电量',
          },
          legend: {
            chargeQuantity: '充电量',
            dischargeQuantity: '放电量',
            targetChargeQuantity: '目标充电量',
            targetDischargeQuantity: '目标放电量',
          },
    },

    teammanagement : {
      name: '姓名',
      status: '当前状态',
      pendingOrder: '待处理工单',
      activeWorkOrder: '处理中工单',
      location: '所在位置',
    },

    currency: {
        CNY: '元',
    }
};