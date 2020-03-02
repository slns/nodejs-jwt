const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const mongoose = require("mongoose");
const redisClient = require("./redis");

const User = mongoose.model("User");

const auth = {};

auth.authorization = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send({ error: "No token provided" });
  }

  const [scheme, token] = authHeader.split(" ");

  try {
    const decoded = await promisify(jwt.verify)(token, process.env.TOKEN_KEY);

    req.userId = decoded.id;

    return next();
  } catch (err) {
    return res.status(401).send({ error: "Token invalid" });
  }
};

auth.logout = async (req, res) => {
  // logout user
  // save token in redis
  const token = req.headers.authorization.split(' ')[1];
  try {
      await redisClient.LPUSH('token', token);
      return res.status(200).json({
        'status': 200,
        'data': 'You are logged out',
      });
  } catch (error) {
    return res.status(400).json({
      'status': 400,
      'error': error.toString(),
    });
  }
};

auth.checkToken = async  (req,res,next) => {
  console.log('auth.checkToken');
  
  const token = req.headers.authorization;

  if(!token) {
      return res.status(400).json({ 
        'message': 'You need to Login'
       });
  }
 
  try {
    console.log('auth.checkToken TRY');

    redisClient.set('my_test_key', 'my test value');
    redisClient.get('my_test_key', function (error, result) {
       if (error) {
           console.log('ERROR',error);
           throw error;
        }
        console.log('GET result ->' + result);
    });

    //const length = await redisClient.llen('my_test_key');
  redisClient.type('my_test_key', function (error, result1) {
    if (error) {
        console.log('ERROR',error);
        throw error;
     }
     console.log('GET result3333333 ->' + result1);
 });


    redisClient.llen('my_test_key', function (error) {
     
      // console.log('GET result222222222 ->' + result1);
       console.log('GET resultEEEEEEEEEEEEEEEEEEEEEEEE ->' + error);
   });

    //console.log('length', length);

    const result = await redisClient.lrange('token',0,99999999);

    console.log('result', result.indexOf(token));

       if(result.indexOf(token) > -1) {
          return res.status(400).json({
            status: 400,
            error: 'Invalid Token'
         });
       }

      const decrypt = await jwt.verify(token, process.env.ENV);

      console.log('decrypt ', decrypt);

      const { email } = req.body;

      const getUser = await User.findOne({ email });

      console.log('getUser ', getUser)
      
      const {rows} = await client.query(getUser,[decrypt.userId]);
      if (!rows[0]){
          return res.status(400).json({
              'message':'Not accessible'
          })
      }
      req.user = { 
          userId: decrypt.userId,
          isAdmin: decrypt.isAdmin};
      next();
  } catch(error) {
      return res.status(400).send(error);
  }
};


module.exports = auth;