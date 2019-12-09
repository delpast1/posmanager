'use strict';
const mReport = require('../modules/index').report;

var generalReport = (req, res) => {
    let request = {
        userID: req.decoded.userID
    }

    mReport.generalReport(request, (err, response) => {
        let status = {},
            data = {};
        if (!err && response) {
            status = {
                'code': '1',
                'err': ''
            }
            data = response;
            res.json({
                body: data,
                status: status
            });
        } else {
            status = {
                'code': '0',
                'message': err
            }
            res.json({
                status: status
            });
        }
    });
}

exports = module.exports = {
    generalReport: generalReport
}