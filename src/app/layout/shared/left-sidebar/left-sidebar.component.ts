import { Component, Input, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';

import { EventService } from 'src/app/core/service/event.service';

// utility
import {
  changeBodyAttribute,
  findAllParent,
  findMenuItem,
} from '../helper/utils';

// types
import { User } from 'src/app/core/models/auth.models';
import { MenuItem } from '../models/menu.model';
import { company_list } from 'src/app/core/gql/company';
// data
import { MENU_ITEMS } from '../config/menu-meta';
import { ApolloService } from 'src/app/core/service/apollo.service';

// constants
import { EventType } from 'src/app/core/constants/events';
import {
  LayoutColor,
  LayoutType,
  LayoutWidth,
  MenuPositions,
  SideBarSize,
  SideBarTheme,
  TopbarTheme,
} from '../config/layout.model';
import { ToastrService } from 'ngx-toastr';
import { GlobalFunctionsService } from "src/app/core/service/global-functions.service";

@Component({
  selector: 'app-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.scss'],
})
export class LeftSidebarComponent implements OnInit {
  @Input() includeUserProfile: boolean = false;
  @Input() leftbarSize!: string;

  leftSidebarClass = 'sidebar-enable';
  activeMenuItems: string[] = [];
  loggedInUser: User | null = {};
  menuItems: MenuItem[] = [];
  userAvatar: string = localStorage.getItem('avatar');
  firstName: string = localStorage.getItem('firstName');
  lastName: string = localStorage.getItem('lastName');
  companyList = [];

  constructor(
    private router: Router,
    private eventService: EventService,
    private apolloService: ApolloService,
    private toastrService: ToastrService,
    private globalService: GlobalFunctionsService
  ) {
    router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        this._activateMenu(); //actiavtes menu
        this.hideMenu(); //hides leftbar on change of route
      }
    });
    this.eventService.on(EventType.CHANGE_COMPANY).subscribe(() => {
      this.getCompanyList();
    });
  }


getCompanyList() {
    if (localStorage.getItem('token')) {
      this.apolloService.query(company_list, {}).then((res) => {
        if (!res.company_list.error) {
          this.companyList = res.company_list.data;
          if (
            this.companyList.length > 0 &&
            (localStorage.getItem('idcompany') == '0' ||
              localStorage.getItem('idcompany') == null ||
              localStorage.getItem('idUserOwner') == null)
          ) {
            localStorage.setItem(
              'idcompany',
              this.companyList[0].id.toString()
            );
            localStorage.setItem('companyName', this.companyList[0].txtName);
            localStorage.setItem(
              'idUserOwner',
              this.companyList[0].idUserOwner
            );            
            this.globalService.setCompanyID(parseInt(this.companyList[0].id.toString()));
          } else {
            for (let i = 0; i < this.companyList.length; i++) {
              if (
                this.companyList[i].id.toString() ==
                localStorage.getItem('idcompany')
              ) {
                localStorage.setItem(
                  'companyName',
                  this.companyList[i].txtName
                );
                localStorage.setItem(
                  'idUserOwner',
                  this.companyList[i].idUserOwner
                );
                break;
              }
            }
          }
        }
      });
    }
  }

  ngOnInit(): void {
    this.initMenu();
    this.getCompanyList();
  }

  selectCompanyName(id, name, idUserOwner) {
    localStorage.setItem('idcompany', id);
    localStorage.setItem('companyName', name);
    localStorage.setItem('idUserOwner', idUserOwner);
    this.globalService.setCompanyID(parseInt(id));
    this.toastrService.info('Switch to Company ' + name, 'Successful');
    this.router.navigate(['apps/projects']).then(() => {
      this.router.navigate(['apps/setting']);
    });
  }

  ngOnChanges(): void {
    if (this.includeUserProfile) {
      changeBodyAttribute('data-sidebar-user', 'true');
    } else {
      changeBodyAttribute('data-sidebar-user', 'false');
    }
  }

  /**
   * On view init - activating menuitems
   */
  ngAfterViewInit() {
    setTimeout(() => {
      this._activateMenu();
    });
  }
  /**
   * initialize menuitems
   */
  initMenu(): void {
    this.menuItems = MENU_ITEMS;
  }

  /**
   * Returns true or false if given menu item has child or not
   * @param item menuItem
   */
  hasSubmenu(menu: MenuItem): boolean {
    return menu.children ? true : false;
  }

  /**
   * activates menu
   */
  _activateMenu(): void {
    const div = document.getElementById('side-menu');
    const div1 = document.getElementById('side-menu1');
    let matchingMenuItem = null;

    if (div) {
      let items: any = div.getElementsByClassName('side-nav-link-ref');
      let items1: any = div1.getElementsByClassName('side-nav-link-ref');
      for (let i = 0; i < items.length; ++i) {
        if (window.location.pathname === items[i].pathname) {
          matchingMenuItem = items[i];
          break;
        }
      }
      for (let i = 0; i < items1.length; ++i) {
        if (window.location.pathname === items1[i].pathname) {
          matchingMenuItem = items1[i];
          break;
        }
      }

      if (matchingMenuItem) {
        const mid = matchingMenuItem.getAttribute('data-menu-key');
        const activeMt = findMenuItem(this.menuItems, mid);

        if (activeMt) {
          const matchingObjs = [
            activeMt['key'],
            ...findAllParent(this.menuItems, activeMt),
          ];

          this.activeMenuItems = matchingObjs;

          this.menuItems.forEach((menu: MenuItem) => {
            menu.collapsed = !matchingObjs.includes(menu.key!);
          });
        } else if (mid == 'setting') {
          this.activeMenuItems = ['setting'];
        }
      }
    }
  }

  /**
   * toggles open menu
   * @param menuItem clicked menuitem
   * @param collapse collpase instance
   */
  toggleMenuItem(menuItem: MenuItem, collapse: NgbCollapse): void {
    collapse.toggle();
    let openMenuItems: string[];
    if (!menuItem.collapsed) {
      openMenuItems = [
        menuItem['key'],
        ...findAllParent(this.menuItems, menuItem),
      ];
      this.menuItems.forEach((menu: MenuItem) => {
        if (!openMenuItems.includes(menu.key!)) {
          menu.collapsed = true;
        }
      });
    }
  }

  /**
   * Hides the menubar
   */
  hideMenu() {
    document.body.classList.remove('sidebar-enable');
  }

  /**
   * Change the side bar width
   * @param type type of sidebar
   */
  changeLeftSidebarSize(size: string): void {
    this.leftbarSize = size;
    this.eventService.broadcast(
      EventType.CHANGE_LEFTBAR_SIZE,
      size as SideBarSize
    );
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['auth/login']);
  }

  newCompany() {
    localStorage.setItem('idcompany', '0');
    this.router.navigate(['apps/projects']).then(() => {
      this.router.navigate(['apps/setting']);
    });
  }
}
