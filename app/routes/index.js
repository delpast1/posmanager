const express = require('express');
const router = express.Router();
const controllers = require('../controllers/index');
const requireSession = require('../config/requireSession').requireSession;
const requireSessionAdmin = require('../config/requireSession').requireSessionAdmin;


/* GET home page. */
router.get('/', function(req, res, next) {
  let errors = [];
  if (req.session.token) {
    res.render('pages/dashboard', {page: 'dashboard'});
  } else {
    res.render('pages/index', {
        page: 'login', 
        errors: errors
    });
  }
  
  
});
// /* Admin Router*/
// router.post('/admin/login', controllers.admin.login);
// router.get('/admin/create', controllers.admin.createAdmin);
// router.get('/admin/dashboard', [requireSessionAdmin, controllers.admin.dashboard]);

/* USER router*/
router.post('/user/login', controllers.user.login);
router.post('/user/checkToken', [requireSession, controllers.user.checkToken]);
router.post('/user/update-user', [requireSession, controllers.user.updateUser]);

/* PARTNER router*/
router.post('/partner/get-partner', [requireSession, controllers.partner.getPartner]);
router.post('/partner/get-list-of-partners', [requireSession, controllers.partner.getListOfPartners]);
router.post('/partner/add', [requireSession, controllers.partner.addPartner]);
router.post('/partner/update', [requireSession, controllers.partner.updatePartner]);
router.post('/partner/remove', [requireSession, controllers.partner.removePartner]);

/* PRODUCT router*/
router.post('/product/get-product', [requireSession, controllers.product.getProduct]);
router.post('/product/get-list-of-products', [requireSession, controllers.product.getListOfProducts]);
router.post('/product/get-list-of-categories', [requireSession, controllers.product.getListOfCategories]);
router.post('/product/get-products-of-category', [requireSession, controllers.product.getProductsOfCategory]);
router.post('/product/add', [requireSession, controllers.product.addProduct]);
router.post('/product/update', [requireSession, controllers.product.updateProduct]);
router.post('/product/remove', [requireSession, controllers.product.removeProduct]);
router.post('/product/get-variations', [requireSession, controllers.product.getVariationsOfProduct]);
router.post('/product/all-variations', [requireSession, controllers.product.getListOfVariations]);
router.post('/product/add-variation', [requireSession, controllers.product.addVariation]);
router.post('/product/update-variation', [requireSession, controllers.product.updateVariation]);
router.post('/product/remove-variation', [requireSession, controllers.product.removeVariation]);

/* UNIT router*/
router.post('/unit/get-unit', [requireSession, controllers.unit.getUnit]);
router.post('/unit/get-list-of-units', [requireSession, controllers.unit.getListOfUnits]);
router.post('/unit/add', [requireSession, controllers.unit.addUnit]);
router.post('/unit/update', [requireSession, controllers.unit.updateUnit]);
router.post('/unit/remove', [requireSession, controllers.unit.removeUnit]);

/* ORDER router*/
router.post('/order/add', [requireSession, controllers.order.addOrder]);
router.post('/order/update-status', [requireSession, controllers.order.updateOrderStatus]);
router.post('/order/get-order', [requireSession, controllers.order.getOrder]);
router.post('/order/get-list-of-orders', [requireSession, controllers.order.getListOfOrders]);

/* RECEIPT router*/
router.post('/receipt/get-receipt', [requireSession, controllers.receipt.getReceipt]);
router.post('/receipt/get-list-of-receipts', [requireSession, controllers.receipt.getListOfReceipts]);
router.post('/receipt/add', [requireSession, controllers.receipt.addReceipt]);
router.post('/receipt/finish', [requireSession, controllers.receipt.finishReceipt]);
router.post('/receipt/cancel', [requireSession, controllers.receipt.cancelReceipt]);
router.post('/receipt/check-stock', [requireSession, controllers.receipt.checkStock]);

/* REPORT router*/
router.post('/report/general-report', [requireSession, controllers.report.generalReport]);

module.exports = router;
