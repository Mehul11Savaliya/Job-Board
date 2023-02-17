const multer = require('multer');
const path = require("path");

let storagex = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,path.join(__dirname,'../public/userupload'));
    },
    filename:function (req,file,cb){
        cb(null,file.fieldname+"-"+Date.now()+path.extname(file.originalname));
    }
});

const cvanimgupload = multer({storage:storagex});

module.exports ={cvanimgupload}