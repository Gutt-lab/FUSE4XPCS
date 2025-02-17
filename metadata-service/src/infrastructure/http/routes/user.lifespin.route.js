import express from 'express';
import { UserLifespinController } from '../controllers/user.lifespin.controller.js';
import { UserLifespinRepository } from "../../repositories/user.lifespin.repository.js";
import { UserLifespinService } from "../../../domain/service/user.lifespin.service.js";

export class UserLifespinRouter {
    constructor(db) {
        this.userRepo =  new UserLifespinRepository(db)
        this.userService = new UserLifespinService(this.userRepo)
        this.controller = new UserLifespinController(this.userService);
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        // Get all users
        //this.router.get('/', this.controller.getAllUsers.bind(this.controller));

        // Get user by ID
        this.router.get('/get-by-userid/:id', this.controller.getUserById.bind(this.controller));

        // Get user by email
        //this.router.get('/email/:email', this.controller.getUserByEmail.bind(this.controller));

        // Create new user
        //this.router.post('/', this.controller.createUser.bind(this.controller));

        // Update user
        //this.router.put('/:id', this.controller.updateUser.bind(this.controller));

        // Delete user
        //this.router.delete('/:id', this.controller.deleteUser.bind(this.controller));

        // Get user's experiments
        //this.router.get('/:id/experiments', this.controller.getUserExperiments.bind(this.controller));
    }

    getRouter() {
        return this.router;
    }
}

// Factory function to create router instance
export const createUserLifespinRouter = (db) => {
    const userRouter = new UserLifespinRouter(db);
    return userRouter.getRouter();
}; 