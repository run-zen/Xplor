import express from 'express';
import * as ViewCtrl from './../controllers/viewController.js';
import * as AuthCtrl from '../controllers/authControllers.js';

const router = express.Router();

router.get('/me', AuthCtrl.protect, ViewCtrl.getMe);

router.use(AuthCtrl.isLoggedIn); /// it doesn't restrict, just for redering purpose
router.get('/', ViewCtrl.getOverview);
router.get('/tour/:slug', ViewCtrl.getTour);
router.get('/login', ViewCtrl.getLoginForm);
router.get('/signup', ViewCtrl.getSignupForm);
router.get('/resendEmailConfirmationToken', ViewCtrl.resendConfirmationEmail);
router.get('/confirmemail/:token', ViewCtrl.confirmEmail);
router.get('/forgotpassword', ViewCtrl.forgotPassword);
router.get('/resetpassword/:resetToken', ViewCtrl.resetPassword);

export default router;
