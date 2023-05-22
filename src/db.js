const mysql = require('mysql');
const getConnect = async () => {
    return await new Promise((res, rej) => {
    let con = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'jobboarding',
            multipleStatements:true
        })
        con.connect((err) => {
            if (err) rej("can not get connnection" + err);
            else res(con);
        });
        
    });

}

module.exports = {getConnect};