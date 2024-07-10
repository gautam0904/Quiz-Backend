import { Container } from 'inversify';
import { Types } from '../types/types';
// import * as service from '../service';
// import * as controller from '../controller';

const container = new Container();

// controllers

// container.bind<controller.UserController>(Types.UserController).to(controller.UserController);

// services 

// container.bind<service.UserService>(Types.UserService).to(service.UserService);

export default container;