const {getConnect} = require('./db.js');

const initialize = async(email)=>{
    return new Promise(async(rej,res)=>{
        const con = await getConnect();
        const qry  = `INSERT INTO userprofile(email) VALUES ('${email}')`;
        con.query(qry,(err,data)=>{
            if(err) res(err);
            else res(true);
        });
        con.end((errx)=>{
            console.log('con not closed',errx);
        });
    });
}

const getUserProfile = async (email)=>{
    return new Promise(async(res,rej)=>{
        const con = await getConnect();
        const qry  = `SELECT * FROM userprofile WHERE email = '${email}';`;
        con.query(qry,(err,data)=>{
            if(err) res(err);
            else {
                res(data[0]);
            }
        });
        con.end((errx)=>{
            if(errx)
            console.log('con not closed',errx);
        });
    });
    
}
// (async()=>{
//     const d = await getUserProfile('bear@gmail.com');
//     console.log(d);
// })()

module.exports = {initialize,getUserProfile};