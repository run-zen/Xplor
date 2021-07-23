import express from 'express';
import * as ViewCtrl from './../controllers/viewController.js';
import * as AuthCtrl from '../controllers/authControllers.js';

const router = express.Router();

router.use(AuthCtrl.isLoggedIn);
router.get('/', ViewCtrl.getOverview);
router.get('/tour/:slug', ViewCtrl.getTour);
router.get('/login', ViewCtrl.getLoginForm);
router.get('/signup', ViewCtrl.getSignupForm);

export default router;
