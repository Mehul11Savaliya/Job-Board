const mysq = require("./mysq");
const CryptoJS = require("crypto-js");

const insertChat = async (from, to, msg) => {
    return new Promise(async (res, rej) => {
        console.time("qry:insertChat");
        const con = await mysq.getConnect();
        // from = CryptoJS.SHA1(from).toString();
        // to = CryptoJS.SHA1(to).toString();
        const qry = `INSERT INTO chats(\`user\`, \`to\`, \`msg\`,\`sender\`) VALUES ('${from}','${to}','${msg}','${from}')`;

        con.query(qry, (err, resx) => {
            if (err) {
                console.log("err:chat>insertChat ", err)
                rej([false, err]);
            }
            else {
                res([true,resx]);
            }
        });

        con.end((err) => {
            if (err) {
                console.log("insertChat : cannot destroy con");
                console.timeEnd("qry:insertChat");
            }
            else {
                console.log("insertChat : con destroyed with db ");
                console.timeEnd("qry:insertChat");
            }

        });
    })
}

const getChats = (from,to)=>{
    return new Promise(async(res,rej)=>{
        console.time("qry:getChats");
        const con = await mysq.getConnect();

        const qry = `SELECT sender,msg,time FROM chats WHERE user='${from}' AND chats.to='${to}' OR user='${to}' AND chats.to='${from}'`;
        con.query(qry,(err,data)=>{
            if(err){
                console.log("err:chat>getChats");
                console.timeEnd("qry:getChats");
                rej([false,err]);
            }
            else{
                let msg=[];
                Array.from(data).forEach(val=>{
                    if(val.sender===to){
                        msg.push({
                            type:'s',
                            msg:val.msg,
                            time:val.time
                        });
                    }
                    else{
                        msg.push({
                            type:'r',
                            msg:val.msg,
                            time:val.time
                        });
                    }
                })
                console.timeEnd("qry:getChats");
                res([true,msg]);
            }
        });

        con.end((err)=>{
            if(err) {console.log("chat>getChats : can not destroy con",err);
            console.timeEnd("qry:getChats");
        }
        });
    });
}

const getTos = (from)=>{
    return new Promise(async(res,rej)=>{
        console.time("qry:getTos");
        const con = await mysq.getConnect();
        let to = new Set();
        const qry = `SELECT chats.to FROM chats WHERE user='${from}'`;
     //   console.log(qry);
        con.query(qry,(err,data)=>{
            if(err){
                console.timeEnd("qry:getTos");
                console.log("err:chat>getTos",err);
                rej([false,err]);
            }
            else{
               // console.log(data);
                Array.from(data).forEach(async(val)=>{
                    to.add(val.to);
                });
                const qry2 = `SELECT user FROM chats WHERE chats.to='${from}'`;
       //         console.log(qry2);
                con.query(qry2,(err,data)=>{
                    if(err){
                        console.timeEnd("qry:getTos");
                        console.log("err:chat>getTos",err);
                        rej([false,err]);
                    }
                    else{
                    //    console.log(data);
                        Array.from(data).forEach(async(val)=>{
                            to.add(val.user);
                        });
                       // console.log(to);
                        data = [...to];
                      // console.log(data);
                      res([true,data]);
                        con.end((err)=>{
                            if(err) {console.log("chat>getTos : can not destroy con",err);
                            console.timeEnd("qry:getTos");
                        }
                        else{
                            // console.log("con destroyed");
                        }
                        });
                    }
                })
                console.timeEnd("qry:getTos");
                
            }
        });

    });
}

module.exports={getChats,insertChat,getTos};


// (async function () {
//     try {
//         const res = await getTos('svlmehul@gmail.com');
//         console.log(res[1]);
//     } catch (error) {
//         console.log(error);
//     }
    
// })()


// (async function () {
//     try {
//         const res = await getChats('savaliyamehul95@gmail.com','test@gmail.com');
//         console.log(res);
//     } catch (error) {
//         console.log(error);
//     }
    
//  })()

// (async function () {
//     try {
//         const setc = await insertChat('test2','test','henlo wormld!');
//         console.log(setc);
//     } catch (error) {
//         console.log(error);
//     }
    
// })()