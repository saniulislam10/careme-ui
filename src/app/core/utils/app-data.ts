
import {Select} from '../../interfaces/select';
import {AdminRoleEnum} from '../../enum/admin-role.enum';

export const ADMIN_ROLES: Select[] = [
  {value: AdminRoleEnum.SUPER_ADMIN, viewValue: 'Super Admin'},
  {value: AdminRoleEnum.ADMIN, viewValue: 'Admin'},
  {value: AdminRoleEnum.EDITOR, viewValue: 'Editor'}
];

export const GENDERS: Select[] = [
  {value: 'Male', viewValue: 'Male'},
  {value: 'Female', viewValue: 'Female'},
  {value: 'Others', viewValue: 'Others'}
];

export const REPORT_FILTER: Select[] = [
  {value: 'today', viewValue: 'Today'},
  {value: 'yesterday', viewValue: 'Yesterday'},
  {value: 'last-7-days', viewValue: 'Last 7 days'},
  {value: 'last-15-days', viewValue: 'Last 15 days'},
  {value: 'last-30-days', viewValue: 'Last 30 days'},
  {value: 'last-60-days', viewValue: 'Last 60 days'},
  {value: 'last-90-days', viewValue: 'Last 90 days'}
];

