//定义内容
export default {
    worktablehome: {
        pendingOrder: 'Pending Work Order',
        pendingAlarm: 'Pending Alarm',
        stationOverview: 'Station Overview',
        more: 'More',
        stationName: 'Station Name',
        alarmNum: 'Alarm Count',
        malfunctionNum: 'Malfunction Count',
        stationTotalNum: 'Station Count',
        stationAlarmNUm: 'Station Alarm Count',
        profitStatistics: 'Profit Statistics',
        revenue: 'Revenue',
        targetRevenue: 'Target Revenue',
        totalRevenue: 'Total Revenue',
        yesterdayRevenue: "Yesterday's Revenue",
        stationRevenueRanking: 'Station Revenue Ranking',
        electricityStatistics: 'Electricity Statistics',
        totalCharge: 'Total Charge',
        totalDischarge: 'Total Discharge',
        stationSystemEfficiencyRanking: 'Station System Efficiency Ranking',
        teamManagerment: 'Team Managerment',
    },

    role: {
        administrator: 'Administrator',
    }, 
    
    greeting: {
        weehours: 'Hello',
        zaoshang: 'Good Morning',
        morning: 'Good Morning',
        zhongwu: 'Good Afternoon',
        afternoon: 'Good Afternoon',
        evening: 'Good Evening',
        wanshang: 'Good Evening',
        night: 'Good Night',
    },

    profitCurve: {
        title: "Last Month's Revenue Trend",
        
        xAxis: {
            name: 'Date',
        },
        yAxis: {
            revenue: 'Revenue',
            targetRevenue: 'Target Revenue',
            CNY: 'CNY',
        },
        legend: {
            revenue: 'Profit',
            targetRevenue: 'Target Profit',
        },
    },

    quantityCurve: {
        title: "Last Month's Charge or Discharge Electricity Trend",
        tooltip: {
            valueFormatter: function (value) {
              return value + ' kWh';
            },
          },
          xAxis: {
            name: 'Date',
          },
          yAxis: {
            chargeQuantity: 'Charge Capacity',
            dischargeQuantity: 'Discharge Capacity',
            targetChargeQuantity: 'Target Charge Capacity',
            targetDischargeQuantity: 'Target DIsCharge Capacity',
          },
          legend: {
            chargeQuantity: 'Charge Capacity',
            dischargeQuantity: 'Discharge Capacity',
            targetChargeQuantity: 'Target Charge Capacity',
            targetDischargeQuantity: 'Target DIsCharge Capacity',
          },
    },

    teammanagement : {
        name: 'Name',
        status: 'Current Status',
        pendingOrder: 'Pending Work Order',
        activeWorkOrder: 'Active Work Order',
        location: 'Location',
      },

    currency: {
        CNY: 'CNY',
    }
};
