export class UserLifespinController {
    constructor(userService) {
        this.userService = userService;
    }

    async getAllUsers(req, res, next) {
        try {
            const users = await this.userService.findAll();
            res.json(users);
        } catch (error) {
            next(error);
        }
    }

    async getUserById(req, res, next) {
        try {
            console.log(req.params.id)
            const user = await this.userService.findByUserId(req.params.id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(user);
        } catch (error) {
            next(error);
        }
    }
} 