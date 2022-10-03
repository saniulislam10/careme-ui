import { MenuAdmin } from './../../interfaces/menu-admin';
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'menu',
  pure: true
})
export class MenuPipe implements PipeTransform {

  transform(menuList: MenuAdmin[], type: string, id?:string): any {

    if (type === 'parent') {
      let list = menuList.filter(m => m.hasSubMenu=== true)
      return list;
    }else if (id){
      let list = menuList.filter(m => m.parentId=== id)
      return list;
    }

  }


}
function checkParent(data) {
  return data.hasSubMenu;
}
