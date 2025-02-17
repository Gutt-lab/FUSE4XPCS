export class UserLifespinService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async findAll() {
        try {
            return await this.userRepository.findAll();
        } catch (error) {
            console.error('Error in UserService.findAll:', error);
            throw error;
        }
    }


    async findByUserId(id) {
        try {
            console.log("UserService.findByUserId")
            const user = await this.userRepository.findByUserId(id);
            if (!user) {
                throw new Error('User not found');
            }
            return user;
        } catch (error) {
            console.error('Error in UserService.findByUserId:', error);
            throw error;
        }
    }

} 