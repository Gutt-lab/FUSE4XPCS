const { validationResult } = require('express-validator');

class AuthController {
  constructor(authService) {
    this.authService = authService;
  }

  async login(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { login_name, user_pwd } = req.body;
      const result = await this.authService.authenticate(login_name, user_pwd);
      res.json(result);
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  }

  async validateToken(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { token } = req.headers;
      const result = await this.authService.verifyjwt(token);
      res.json(result);
    } catch (error) {

      res.status(401).json({ message: error.message });
    }
  }
//   async register(req, res) {
//     try {
//       const errors = validationResult(req);
//       if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//       }

//       const user = await this.authService.register(req.body);
//       res.status(201).json(user);
//     } catch (error) {
//       res.status(400).json({ message: error.message });
//     }
//   }
}

module.exports = AuthController;