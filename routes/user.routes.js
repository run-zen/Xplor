import express from 'express';
import * as UserCtrl from '../controllers/user.controllers.js';
import * as AuthCtrl from '../controllers/authControllers.js';

const router = express.Router();

// Available for everyone
router.post('/signup', AuthCtrl.signup, AuthCtrl.sendConfirmationEmail);
router.post('/resendemailconfirmationToken', AuthCtrl.sendConfirmationEmail);
router.patch('/confirmemail/:token', AuthCtrl.confirmEmail);
router.post('/login', AuthCtrl.login);
router.get('/logout', AuthCtrl.logout);
router.post('/forgotpassword', AuthCtrl.forgotPassword);
router.patch('/resetpassword/:token', AuthCtrl.resetPassword);

// Authenticated user only
// Protect All Routes After this middleware
router.use(AuthCtrl.protect);

router.patch('/updatepassword', AuthCtrl.updatePassword);
router.patch('/updateme', UserCtrl.updateMe);
router.delete('/deleteme', UserCtrl.deleteMe);

router.get('/me', UserCtrl.getMe, UserCtrl.getUser);

//Accessible by Administer only Routes Below this middleware
router.use(AuthCtrl.restrictTo('admin'));

router.route('/').get(UserCtrl.getAllUsers).post(UserCtrl.createUser);
router
    .route('/:id')
    .get(UserCtrl.getUser)
    .patch(UserCtrl.updateUser)
    .delete(UserCtrl.deleteUser);

export default router;
