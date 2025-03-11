class User {
    constructor(id, user_pwd, login_name, first_name, last_name) {
      this.id = id;
      this.user_pwd = user_pwd;
      this.login_name = login_name;
      this.first_name = first_name;
      this.last_name = last_name;
    }
  
    toJSON() {
      return {
        id: this.id,
        login_name: this.login_name,
        first_name: this.first_name,
        last_name: this.last_name

      };
    }
  }
  
  module.exports = User;