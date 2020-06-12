import { commoonBR } from './module/common';
import { setSysBR } from './module/setSys';
import { operationConfigurationBR } from './module/operationConfiguration'
import { userInfoBR } from './module/userInfo'
import { notificationBR } from './module/notification'
import { merchantManagementBR } from './module/merchantManagement'
import { reportCenterBR } from './module/reportCenter'



export default {
  home: 'Página inicial',
  ...commoonBR,
  ...setSysBR,
  ...operationConfigurationBR,
  ...userInfoBR,
  ...notificationBR,
  ...merchantManagementBR,
  ...reportCenterBR
}
