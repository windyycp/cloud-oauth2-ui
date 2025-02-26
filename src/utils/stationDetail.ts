// import { useI18n } from 'vue-i18n';

// const { t } = useI18n();

// //电站详情下 字典
// // 创建一个工具文件，例如 utils.js
// export function formatChargeDischargeStatus(status: number) {
//     switch (status) {
//       case 0: return t('message.stationStatus.waiting');
//       case 1: return t('message.stationStatus.charging');
//       case 2: return t('message.stationStatus.discharging');
//       case 3: return t('message.stationStatus.stopping');
//       default: return t('message.stationStatus.fault');
//     }
//   }
  
//   export function formatRemainWorkTime(status, time) {
//     switch (status) {
//       case 0: return `${t('message.remainWorkTime.Waiting')} ${time} ${t('message.stationCurrency.second')}`;
//       case 1: return `${t('message.remainWorkTime.Charge')} ${time} 秒`;
//       case 2: return `${t('message.remainWorkTime.Discharge')} ${time} 秒`;
//       case 3: return '';
//       default: return '';
//     }
//   }
  
//   export function formatApplicationScenarios(scenarios) {
//     switch (scenarios) {
//       case 1: return '工商业储能';
//       case 2: return '台区';
//       default: return '未知';
//     }
//   }
  
//   export function formatWorkingMode(mode) {
//     switch (mode) {
//       case 1: return t('message.workingMode.peakShift');
//       case 2: return t('message.workingMode.demandManagement');
//       case 3: return t('message.workingMode.antiReflux');
//       case 4: return t('message.workingMode.antiOverload');
//       case 5: return t('message.workingMode.emergencyBackup');
//       case 6: return t('message.workingMode.threePhaseUnbalancedGovernance');
//       case 7: return t('message.workingMode.reactiveCompensation');
//       case 8: return t('message.workingMode.dynamicCapacityIncrease');
//       case 9: return t('message.workingMode.newEnergyConsumption');
//       default: return t('message.workingMode.unknown');
//     }
//   }
  
//   export function formatControlMode(controlMode) {
//     switch (controlMode) {
//       case 1: return t('message.controlMode.local');
//       case 2: return t('message.controlMode.remote');
//       default: return t('message.controlMode.unknown');
//     }
//   }


//电站详情下 字典
// 创建一个工具文件，例如 utils.js
export function formatChargeDischargeStatus(status: number) {
    switch (status) {
      case 0: return "待机";
      case 1: return "充电";
      case 2: return "放电";
      case 3: return "停机";
      default: return "";
    }
  }
  
  export function formatRemainWorkTime(status, time) {
    switch (status) {
      case 0: return `距离下次充放电时间 ${time} 秒`;
      case 1: return `预计剩余充电时间 ${time} 秒`;
      case 2: return `预计剩余放电时间 ${time} 秒`;
      case 3: return '';
      default: return '';
    }
  }
  
  export function formatApplicationScenarios(scenarios) {
    switch (scenarios) {
      case 1: return '工商业储能';
      case 2: return '台区';
      default: return '未知';
    }
  }
  
  export function formatWorkingMode(mode) {
    switch (mode) {
      case 1: return "削峰填谷";
      case 2: return "需量管理";
      case 3: return "防逆流";
      case 4: return "防过载";
      case 5: return "应急备电";
      case 6: return "三相不平衡治理";
      case 7: return "无功补偿";
      case 8: return "动态增容";
      case 9: return "新能源消纳";
      default: return "未知";
    }
  }
  
  export function formatControlMode(controlMode) {
    switch (controlMode) {
      case 1: return "本地";
      case 2: return "远程";
      default: return "未知";
    }
  }

  export function formatEquipmentType (type) {
    switch (type) {
      case 10: return "电池堆";
      case 20: return "电池簇";
      case 21: return "PACK";
      case 22: return "电芯";
      case 30: return "PCS主控";
      case 40: return "PCS模块";
      case 50: return "电表";
      case 60: return "除湿机";
      case 70: return "消防主机";
      case 71: return "消防簇监控器";
      case 72: return "消防探测器";
      case 80: return "配电系统";
      case 90: return "空调";
      case 91: return "格力空调主机";
      case 92: return "格力空调内机";
      case 93: return "冷水机组DL";
      case 94: return "冷水机组YLJ&WX";
      case 95: return "冷水机组GaoLand";
      case 96: return "冷水机组YWK";
      case 100: return "温湿度采集系统";
      case 110: return "UPS电源";
      case 115: return "SCR";
      case 120: return "Emu能量管理单元";
      case 130: return "EMS";
      case 140: return "BMS";
      default: return "未知";
    }
  }

  // export function formatFireProberStateType (type) {
  //   switch (type) {
  //     case 1: return "掉线";
  //     case 2: return "在线";
  //     case 3: return "告警";
  //     default: return "未知";
  //   }
  // }

  /** 消防系统簇控制器状态 */
export enum EFireProberStateType {
  /** 掉线 */
  OffLine = 1,
  /** 在线 */
  OnLine = 2,
  /** 告警 */
  Alarm = 3,
}

/** 消防系统簇控制器状态 */
export namespace EFireProberStateType {
  const base = {
    [EFireProberStateType.OffLine]: '掉线',
    [EFireProberStateType.OnLine]: '在线',
    [EFireProberStateType.Alarm]: '告警',
  };

  const color = {
    [EFireProberStateType.OffLine]: '#FFCB0A',
    [EFireProberStateType.OnLine]: '#19B632FF',
    [EFireProberStateType.Alarm]: '#D7000FFF',
  };

  export function toDescription(type: EFireProberStateType) {
    return base[type] || '未定义';
  }

  export function getColor(type: EFireProberStateType) {
    return color[type] || '';
  }
}

/** 消防系统簇控制器设备类型 */
export enum EFireProberType {
  /** 无 */
  Default = 0,
  /** 复合探测器 */
  CompoundProber = 1,
  /** 烟雾探测器 */
  SmogProber = 2,
  /** 火焰探测器 */
  FlameProber = 3,
  /** 氢气探测器 */
  HydrogenProber = 4,
  /** 分区阀 */
  PartGateProber = 5,
  /** 中间舱烟雾探测器 */
  MiddleCabinSmogProber = 6,
  /** 警铃 */
  AlarmBell = 7,
  /** 瓶头阀 */
  BottleHeadValve = 8,
  /** 手报 */
  ManualAlarm = 9,
  /** 声光报警器 */
  SoundAlarm = 10,
  /** 放气指示 */
  GassTip = 11,
  /** 压力传感器 */
  PressureSensor = 12,
  /** 吸气式传感器 */
  AspiratedSensor = 13,
}

export namespace EFireProberType {
  const base = {
    [EFireProberType.Default]: '无',
    [EFireProberType.CompoundProber]: '复合探测器',
    [EFireProberType.SmogProber]: '烟雾探测器',
    [EFireProberType.FlameProber]: '火焰探测器',
    [EFireProberType.HydrogenProber]: '氢气探测器',
    [EFireProberType.PartGateProber]: '分区阀',
    [EFireProberType.MiddleCabinSmogProber]: '中间舱烟雾探测器',
    [EFireProberType.AlarmBell]: '警铃',
    [EFireProberType.BottleHeadValve]: '瓶头阀',
    [EFireProberType.ManualAlarm]: '手报',
    [EFireProberType.SoundAlarm]: '声光报警器',
    [EFireProberType.GassTip]: '放气指示',
    [EFireProberType.PressureSensor]: '压力传感器',
    [EFireProberType.AspiratedSensor]: '吸气式传感器',
  };

  export function toDescription(type: EFireProberType) {
    return base[type] || '未定义';
  }
}