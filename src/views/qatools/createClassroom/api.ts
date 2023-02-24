import { defHttp } from '/@/utils/http/axios';
import { Modal } from 'ant-design-vue';

enum Api {
  getOrg = '/qatools/inner/create/classroom/org',
  createClass = '/qatools/inner/create/classroom',
  addUser = '/qatools/inner/create/classroom/addUser',
  getUser = '/qatools/inner/create/classroom/frequently/account',
}

export const orgList = (params) => defHttp.get({ url: Api.getOrg, params });

export const createClassroom = (params) => defHttp.post({ url: Api.createClass, params });

export const addUsers = (params) => defHttp.post({ url: Api.addUser, params });
/**
 * 删除角色
 */
export const deleteRole = (params, handleSuccess) => {
  return defHttp.delete({ url: Api.getOrg, params }, { joinParamsToUrl: true }).then(() => {
    handleSuccess();
  });
};

/**
 * 保存角色权限
 */
export const saveRolePermission = (params) => defHttp.post({ url: '', params });
/**
 * 批量删除角色
 * @param params
 */
export const batchDeleteRole = (params, handleSuccess) => {
  Modal.confirm({
    title: '确认删除',
    content: '是否删除选中数据',
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      return defHttp.delete({ url: Api.getOrg, data: params }, { joinParamsToUrl: true }).then(() => {
        handleSuccess();
      });
    },
  });
};
