const mysq = require("./mysq.js");

const checkUser = async(emai)=>{
    let p;
try{
    const con = await mysq.getConnect();

    p = new Promise((res,rej)=>{
        const qry = `select * from jobseeker where email='${emai}'`;
        con.query(qry,(err,data)=>{
            if(err){ rej(false);}
            else
            {
                if(data[0]!==undefined){
               let email = data[0].email;
               if(emai==email){
                 res([true,data[0]]);
               }
               else{
                res(false);
               }
            }else{
                res(false);
            }
            }
        });
    })

}catch(e){
    console.log(e);
}
return await p;
}

const getUserx = async(emai,pass)=>{
    return await new Promise(async(res,rej)=>{
        const con = await mysq.getConnect();
        mysq.getUser(con,emai,pass).then(val=>res(val)).catch(err=>rej("notexist"))
    })
}

const checkCompany = async (email) => {
    console.time("qry:checkCompany : ");
    return new Promise(async (res, rej) => {
        const con = await mysq.getConnect();
        const qry = `SELECT * FROM company WHERE email='${email}'`;
        con.query(qry, (err, resx) => {
            if (err) {
                rej([false, err]);
            }
            else {
                if (resx[0] !== undefined) {
                    if (email === resx[0].email) {
                        res([true, resx]);

                    }
                    else {
                        res([false, resx]);
                    }
                }
                else {
                    res([false, resx]);
                }
            }
        });
        console.timeEnd("qry:checkCompany : ");
    })
}

const getCompany = async (email,pass) => {
    return new Promise(async (res, rej) => {
        const con = await mysq.getConnect();
        const qry = `SELECT * FROM company WHERE email='${email}' and pass='${pass}'`;
        con.query(qry, (err, resx) => {
            if (err) {
                rej([false, err]);
            }
            else {
                if (resx[0] !== undefined) {
                    if (email === resx[0].email) {
                        res([true, resx]);

                    }
                    else {
                        res([false, resx]);
                    }
                }
                else {
                    res([false, resx]);
                }
            }
        });
    })
}



module.exports={checkUser,getUserx,checkCompany,getCompany}
// let test = async ()=>{
//     let a = await checkUser('A@sA');
//     console.log(typeof a);
// }

// test()
// const user = await getUser("1","1");

//console.log(getUserx("1","1"));

