const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
router.use( (req, res, next)=> {


const token = req.headers['access-token'];
    
    if(token) {
        jwt.verify(token, process.env.MASTER_KEY, (err) =>{
            
            if(err){

                return res.json({
                    message: 'Token invalido.'
                })

            } else {
                
                next();
            }

        });

    } else {
        res.send({
            message: 'Token no proveída.'
        });
    }

})

module.exports = router;