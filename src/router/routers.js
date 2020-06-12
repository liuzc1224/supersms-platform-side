import homeRouter from './homeRouter';
import setSysRouter from './setSysRouter';
import operationConfiguration from './operationConfiguration';
import merchantManagement from './merchantManagement';
import reportCenter from './reportCenter';
import notification from './notification';

export default [
  ...homeRouter,
  ...setSysRouter,
  ...operationConfiguration,
  ...merchantManagement,
  ...reportCenter,
  ...notification
]
