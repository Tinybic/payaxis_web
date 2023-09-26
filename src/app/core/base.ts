export class Base {
  setRole(name) {
    const accessList = JSON.parse(localStorage.getItem('companyAccess'));
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
