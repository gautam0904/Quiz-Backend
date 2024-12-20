import { Container } from 'inversify';
import { Types } from '../types/types';
import * as service from '../service';
import * as controller from '../controller';
import { Auth } from '../middleware/auth.middleware';
import { Role } from '../middleware/role.middleware';

const container = new Container();

// controllers

container.bind<controller.UserController>(Types.UserController).to(controller.UserController);
container.bind<controller.QuestionController>(Types.QuestionController).to(controller.QuestionController);
container.bind<controller.PaperController>(Types.PaperController).to(controller.PaperController);
container.bind<controller.ResultController>(Types.ResultController).to(controller.ResultController);

// services 
container.bind<service.UserService>(Types.UserService).to(service.UserService);
container.bind<service.QuestionService>(Types.QuestionService).to(service.QuestionService);
container.bind<service.QuizService>(Types.QuizService).to(service.QuizService);
container.bind<service.PaperService>(Types.PaperService).to(service.PaperService);
container.bind<service.ResultService>(Types.ResultService).to(service.ResultService);

//middleware
container.bind<Auth>(Types.Auth).to(Auth)
container.bind<Role>(Types.Role).to(Role)

export default container;