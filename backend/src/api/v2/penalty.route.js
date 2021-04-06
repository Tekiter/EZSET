import express from 'express';
var router = express.Router();
import { PenaltyController } from '../controller/penalty.controller';
import authMiddleware from './../middleware/auth.middleware';


module.exports = router;
