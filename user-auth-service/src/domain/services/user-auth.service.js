const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async authenticate(login_name, user_pwd) {
    const user = await this.userRepository.findByLoginName(login_name);
    console.log("authenticate in AuthService")

    console.log(user.user_pwd + '  vs  '+user_pwd)

    if (!user) {
      throw new Error('User not found');
    }

    // const isValidPassword = await bcrypt.compare(user_pwd, user.user_pwd);
    // if (!isValidPassword) {
    //   throw new Error('Invalid password');
    // }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    console.log(token)

    return { token, user: user.toJSON() };
  }

  async register(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await this.userRepository.save({
      ...userData,
      password: hashedPassword
    });
    
    return user.toJSON();
  }


  async verifyjwt(token){
    if(!token) throw new Error('Unauthorize user')
      console.log(token)
    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        return { valid: true, data: decoded };

    }catch(e){
      throw new Error('User not found');
    }
}
}

module.exports = AuthService;