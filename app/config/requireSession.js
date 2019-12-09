'use strict';
const jwt = require('jsonwebtoken');
const secretKey = require('../config/config').secret;
const secretKeyAdmin = require('../config/config').adminSecret;

var requireSession = (req,res, next) => {
	var token = req.body.token || req.query.token || req.headers['x-access-token'];

  	if (token) {
		jwt.verify(token, secretKey, (err, decoded) => {
			if (err) {
				res.json({
					result: null,
					error: ['Invalid token']
				});
			} else {
				req.decoded = decoded;
				next();
			}
		});
  	} else {
		res.json({
			result: null,
			error: ['Authorization Required']
		});
	}
};

var requireSessionAdmin = (req,res, next) => {
	var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.session.token;
	let errors = [];
  	if (token) {
		jwt.verify(token, secretKeyAdmin, (err, decoded) => {
			if (err) {
				res.json({
					result: null,
					error: ['Invalid token']
				});
			} else {
				req.decoded = decoded;
				req.session.decoded = decoded;
				next();
			}
		});
  	} else {
		errors.push('Cần đăng nhập.');
		res.render('pages/index', {page: 'login', errors: errors});
	}
};

exports = module.exports = {
	requireSession: requireSession,
	requireSessionAdmin: requireSessionAdmin
};