// Port (Interface) for User Repository
class UserRepository {
    async save(user) {
      throw new Error('Method not implemented');
    }
  
    async findByLoginName(login_name) {
      throw new Error('Method not implemented');
    }
  
    async findById(id) {
      throw new Error('Method not implemented');
    }
  }
  
  module.exports = UserRepository;