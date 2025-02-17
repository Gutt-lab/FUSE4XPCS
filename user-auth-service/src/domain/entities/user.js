class User {
    constructor(id, user_pwd, login_name) {
      this.id = id;
      this.user_pwd = user_pwd;
      this.login_name = login_name;
    }
  
    toJSON() {
      return {
        id: this.id,
        login_name: this.login_name
      };
    }
  }
  
  module.exports = User;