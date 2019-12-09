const express = require('express');
const router = express.Router();
const controllers = require('../controllers/index');
const requireSessionAdmin = require('../config/requireSession').requireSessionAdmin;

/* Admin Router*/
router.get('/create', controllers.admin.createAdmin);

/* --------------ADMIN-------------- */
// Đăng nhập
router.post('/login', controllers.admin.login);
// Đăng xuất
router.get('/logout', [requireSessionAdmin, controllers.admin.logOut]);
// Hiển thị trang quản lý
router.get('/dashboard', [requireSessionAdmin, controllers.admin.dashboard]);
// Hiển thị danh sách toàn bộ sản phẩm
router.get('/all-products', [requireSessionAdmin, controllers.admin.allProducts]);
router.get('/all-products/:page', [requireSessionAdmin, controllers.admin.allProducts]);


/* --------------USER-------------- */
// Phân trang Users
router.get('/all-users/', [requireSessionAdmin, controllers.admin.usersPage]);
router.get('/all-users/:page', [requireSessionAdmin, controllers.admin.usersPage]);
// Khóa tài khoản user
router.get('/user-suspended/:id', [requireSessionAdmin, controllers.admin.userSuspended]);
// Active tài khoản user
router.get('/user-active/:id', [requireSessionAdmin, controllers.admin.userActive]);
// Chọn user
router.get('/chose-user/:id', [requireSessionAdmin, controllers.admin.choseUser]);
// Hiện thông tin chung của người dùng
router.get('/user/general-info', [requireSessionAdmin, controllers.admin.showUserGeneralInfo]);

// /* -----------UNIT------------- */
// // Phân trang danh sách đơn vị tính của user
// router.get('/unit/all-units/', [requireSessionAdmin, controllers.admin.unitsPage]);
// router.get('/unit/all-units/:page', [requireSessionAdmin, controllers.admin.unitsPage]);
// // Lấy 1 đơn vị
// router.get('/unit/get-unit/:id', [requireSessionAdmin, controllers.admin.getUnit]);
// // Update 1 đơn vị
// router.post('/unit/update-unit/', [requireSessionAdmin, controllers.admin.updateUnit]);
// // Delete 1 đơn vị
// router.get('/unit/delete-unit/:id', [requireSessionAdmin, controllers.admin.deleteUnit]);

/* --------------PRODUCT-------------- */
// Phân trang danh sách sản phẩm của user
router.get('/product/all-products/', [requireSessionAdmin, controllers.admin.productsPage]);
router.get('/product/all-products/:page', [requireSessionAdmin, controllers.admin.productsPage]);
// Lấy 1 sản phẩm
router.get('/product/get-product/:id', [requireSessionAdmin, controllers.admin.getProduct]);
// Update 1 sản phẩm
router.post('/product/update-product/', [requireSessionAdmin, controllers.admin.updateProduct]);
// Xóa 1 sản phẩm
router.get('/product/delete-product/:id', [requireSessionAdmin, controllers.admin.deleteProduct]);

/* --------------ORDER-------------- */
// Phân trang danh sách sản phẩm của user
router.get('/order/all-orders/', [requireSessionAdmin, controllers.admin.ordersPage]);
router.get('/order/all-orders/:page', [requireSessionAdmin, controllers.admin.ordersPage]);
// Lấy 1 đơn hàng
router.get('/order/get-order/:id', [requireSessionAdmin, controllers.admin.getOrder]);
// Update đơn hàng
router.post('/order/update-order/', [requireSessionAdmin, controllers.admin.updateOrder]);

/* --------------RECEIPT-------------- */
// Phân trang danh sách đơn nhập hàng của user
router.get('/receipt/all-receipts/', [requireSessionAdmin, controllers.admin.receiptPage]);
router.get('/receipt/all-receipts/:page', [requireSessionAdmin, controllers.admin.receiptPage]);
// Lấy 1 đơn nhập hàng
router.get('/receipt/get-receipt/:id', [requireSessionAdmin, controllers.admin.getReceipt]);
// Update đơn hàng
router.post('/receipt/update-receipt/', [requireSessionAdmin, controllers.admin.updateReceipt]);

/* --------------PARTNER-------------- */
// Phân trang danh sách đối tác của user
router.get('/partner/all-partners/', [requireSessionAdmin, controllers.admin.partnerPage]);
router.get('/partner/all-partners/:page', [requireSessionAdmin, controllers.admin.partnerPage]);
// Lấy 1 đối tác
router.get('/partner/get-partner/:id', [requireSessionAdmin, controllers.admin.getPartner]);
// Update thông tin đối tác
router.post('/partner/update-partner/', [requireSessionAdmin, controllers.admin.updatePartner]);
// Xóa 1 đối tác
router.get('/partner/delete-partner/:id', [requireSessionAdmin, controllers.admin.deletePartner]);

module.exports = router;

