const express = require('express'),
      router = express.Router(),
      jwt = require('jsonwebtoken'),
      jwtMiddleware = require('../middleware/routeProtected'),
      {check, validationResult } = require('express-validator'),
      User = require('../models/users');



router.get('/', function(req, res){
    res.send('Inicio').status(200);
})
//'password','fullname' 
router.post('/users/register',
            check('fullname').isLength({ min: 5 }).withMessage('Fullname debe ser mayor a 5'),
            check('password').isLength({ min: 5 }).withMessage('Password debe ser mayor a 5'),
            check('email').isEmail().withMessage('Debe ser un email valido'),
            async (req, res) =>{

                const { fullname, password, email, age, weight } = req.body;

                const errors = validationResult(req);

                if (!errors.isEmpty()) {

                    return res.status(422).json({ errors: errors.array() });

                }else{

                   const emailUser  = await User.findOne({email: email});

                   if(emailUser){

                       res.status(400).json({ message: 'Email ya en uso'});

                   }else {

                    const newUser = new User({fullname,email,password, age, weight});

                    newUser.password = await newUser.encryptPassword(password);

                    await newUser.save();

                    return res.status(200).json({message: 'Usuario creado'});

                    }
                }


});

router.post('/users/auth', async (req, res)=>{

    const { email, password} = req.body;


    const user = await User.findOne({email: email});
    if(!user){

        return res.status(400).json({
            message: 'Usuario no encontrado.'
        });

    }else{
       const match = await user.matchPassword(password);

       if(match){

        const payload = {
            check: true,
            user: user
        };

        const token = jwt.sign(payload, process.env.MASTER_KEY, { expiresIn: 1440 },{ algorithm: 'HS256'});

        res.json({
            message: 'Autenticacion correcta',
            token: token
        });

       }else {

        res.json({
            message: "Password incorrecta.",
        })

        }

    }
    
})

router.put('/users/', jwtMiddleware, (req, res)=>{

    const token = req.headers['access-token'];
    const { fullname, password, email, age, weight } = req.body;
    jwt.verify(token, process.env.MASTER_KEY,  async (err, decoded) =>{
            
        if(!err){

            const user = await User.findById(decoded.user._id);
            var Weight = user.weight;
            var Fullname = user.fullname;
            var Password = user.password;
            var Email = user.email;
            var Age = user.age;

            (weight != user.weight || weight != null) ? Weight.push(weight) : Weight ;
            (fullname != user.fullname) ? Fullname=fullname : Fullname;
            (password != user.password) ? Password= await user.encryptPassword(password) : Password;
            (email != user.email) ? Email=email : Email;
            (age != user.age || age != null) ? Age=age : Age;

            var newDate = Date.now();
                newDate = new Date(newDate);

            await User.findByIdAndUpdate(user._id, { fullname: Fullname,
                                                     email: Email,
                                                     password: Password,
                                                     age: Age,  
                                                     weight: Weight, 
                                                     update_at: newDate
                                                    }, function(err, result){
                if(err){
                    console.log(err);
                }
    
                res.json({ message: 'Actualizado correctamente'})
                console.log(result);
                
            }); 
        }

    });

})
router.get('/users', jwtMiddleware, (req, res)=>{

    const token = req.headers['access-token'];
    jwt.verify(token, process.env.MASTER_KEY,  async (err, decoded) =>{
            
        if(!err){

            const user = await User.find({ email: decoded.user.email});
        
            res.json({ user: user})
       

        }
    })

})
router.delete('/users', jwtMiddleware, (req, res)=>{

    const token = req.headers['access-token'];
    jwt.verify(token, process.env.MASTER_KEY,  async (err, decoded) =>{
            
        if(!err){

            const user = await User.findByIdAndDelete({ _id: decoded.user._id});
        
            if(user){
                res.status(200).json({ message: 'borrado correctamente'})
            }
       

        }
    })

})

module.exports = router;

