import express from 'express';
import { AddUser, deleteUser, getUser, updateUser, uploads } from '../Controller/UserController.js';

const route = express.Router()

route.post('/user-add',uploads.single('image'),AddUser);
route.get('/user-get',getUser);
route.delete('/user-delete/:id',deleteUser);
route.post('/user-update/:id',uploads.single('image'),updateUser);
export default route;
