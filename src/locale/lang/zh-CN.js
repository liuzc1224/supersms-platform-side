import { commoonCN } from './module/common';
import { setSysCN } from './module/setSys';
import { operationConfigurationCN } from './module/operationConfiguration'
import { userInfoCN } from './module/userInfo'
import { notificationCN } from './module/notification'
import { merchantManagementCN } from './module/merchantManagement'
import { reportCenterCN } from './module/reportCenter'



export default {
  home: '首页',
  ...commoonCN,
  ...setSysCN,
  ...operationConfigurationCN,
  ...userInfoCN,
  ...notificationCN,
  ...merchantManagementCN,
  ...reportCenterCN
}
