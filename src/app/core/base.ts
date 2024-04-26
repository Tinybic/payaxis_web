import { LocalStorageService } from "./service/local-storage.service";

export class Base extends LocalStorageService {
  constructor(
  ) {
    super()
  }

  setRole(name) {
    const accessList = JSON.parse(super.getItem('companyAccess'));
    if (accessList) {
      var access = accessList.filter((item) => item.permissionName == name);
      if (access.length > 0) {
        if (access[0].access) {
          return true;
        }
      }
    }
    return false;
  }
}
