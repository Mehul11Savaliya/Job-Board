const mysql = require("mysql");
const path = require("path");
const fs = require("fs");
const { type } = require("os");

const getConnect = async () => {
    return await new Promise((res, rej) => {
    let con = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'jobboarding'
        })
        con.connect((err) => {
            if (err) rej("can not get connnection" + err);
            else res(con);
        });
        
    });

}

const getUser = async (con, email, pass) => {
    return new Promise((res, rej) => {
        const qry = `select * from jobseeker where email='${email}' and password='${pass}'`;
        // console.log(qry);
        con.query(qry, (err, resl, field) => {
            if (err) rej("uer not exist |" + err);
            else res(resl);
              con.end((err)=>{
            if(err) console.log("getUser : cannot destroy");
            else{
                console.log("getUser : con destroyed with db ");
            }
        });
        });
      
    })
}

const updateResumeProfilePath = async(userobj,resumepath,profilepath) =>{
    console.time("qry:updateResumeProfilePath");
    return new Promise(async(res,rej)=>{
        const con = await getConnect();
        const checkqry =`SELECT * FROM usermedia WHERE email='${userobj.email}' and pass='${userobj.password}'`;
        let sresult={email:'nub'};
        con.query(checkqry,(err,data)=>{
            if(err){
                console.log('mysq>updateResumeProfilePath',err);
                rej([false,err])
            }
            else{
                let qry;
                sresult = data[0];
               // console.log(sresult);
                try {
                    fs.unlink(path.join(require.main.path,sresult.resume),(err)=>console.log("mysq>updateResumeProfilePath",err));
                    fs.unlink(path.join(require.main.path,sresult.profile),(err)=>console.log("mysq>updateResumeProfilePath",err));
                    
                    qry = `UPDATE usermedia SET resume='${resumepath}',profile='${profilepath}' WHERE email='${userobj.email}' and pass ='${userobj.password}'`; 
                    con.query(qry,(err,resx)=>{
                        if(err){
                            console.log('mysq>updateResumeProfilePath',err);
                            rej([false,err])
                        }
                        else{
                            con.end((err)=>{
                                if(err) console.log("updateResumeProfilePath : cannot destroy");
                                else{
                                    console.log("updateResumeProfilePath : con destroyed inside updateresume update part");
                                }
                            });

                            res([true,resx])
                        }
                    })
                    
                } catch (error) {
                    qry = `INSERT INTO usermedia(email, pass, resume, profile) VALUES ('${userobj.email}','${userobj.password}','${resumepath}','${profilepath}')`;
                    //    const qry = `UPDATE jobseeker SET resume='${resumepath}',coverletter='${profilepath}' WHERE email='${userobj.email}' and password='${userobj.password}'`;
                    con.query(qry,(err,resx)=>{
                        if(err){
                            console.log('mysq>updateResumeProfilePath',err);
                            rej([false,err])
                        }
                        else{
                            con.end((err)=>{
                                if(err) console.log("updateResumeProfilePath : cannot destroy");
                                else{
                                    console.log("updateResumeProfilePath : con destroyed inside updateresume insert part");
                                }
                            });
                            res([true,resx])
                        }
                    })
                }
            }
        })
        console.timeEnd("qry:updateResumeProfilePath");
    });
}

async function getUserMedia(email,pass){
    console.time('qry:getUserMedia');
    return new Promise(async(res,rej)=>{
          const con = await getConnect();
          const qry = `select resume,profile from usermedia where email='${email}' and pass='${pass}'`;

          con.query(qry,(err,data)=>{
            if(err) rej([false,err]);
            else{
                if(data[0]===undefined) res([false,data[0]]);
                else res([true,data[0]]);
            } 
          });

          con.end((err)=>{
            if(err) console.log("getUserMedia : cannot destroy",err);
            else{
                console.log("getUserMedia : con destroyed with db ");
            }
        });
          console.timeEnd('qry:getUserMedia');
    });
}

const insertRec = async (obj) => {
    return await new Promise(async (res, rej) => {
        const qry = `INSERT INTO jobseeker(\`firstname\`, \`lastname\`, \`email\`, \`phone\`, \`resume\`, \`coverletter\`, \`data\`, \`active\`,\`password\`) VALUES ('${obj.fname}','${obj.lname}','${obj.email}','${obj.phone}','${obj.resume}','${obj.coverletter}','${JSON.stringify(obj)}',${obj.active},'${obj.password}')`;

        const con = await getConnect();

        con.query(qry, (err, resx) => {
            if (err) {
                rej("Error in Inserting Data");
            }
            else {
                res(`${resx.affectedRows} rows inserted"`);
            }
        })
         con.end((err)=>{
            if(err) console.log("insertRec : cannot destroy");
            else{
                console.log("insertRec : con destroyed with db ");
            }
        });
    });

}

const deleteRecord = async (con, email, pass) => {
    return await new Promise((res, rej) => {
        const qry = `DELETE FROM jobseeker WHERE email='${email}' and password = '${pass}'`;
        con.query(qry, (err, resx) => {
            if (err) rej("Error in Inserting Data");
            else res(`${resx.affectedRows} rows deleted"`);
        })
         con.end((err)=>{
            if(err) console.log("deleteRecord : cannot destroy");
            else{
                console.log("deleteRecord : con destroyed with db ");
            }
        });
    });
}

const registerCompany = async (data) => {
    return new Promise(async (res, rej) => {
        const con = await getConnect();
        const qry = `INSERT INTO company(fname, lname, name, url,addr,size, email, phone, pass, active) VALUES ('${data.cpfname}','${data.cplname}','${data.cpname}','${data.cpurl}','${data.cpaddr}','${data.cpsize}','${data.cpemail}','${data.cpphone}','${data.cppass}',true)`;

        con.query(qry, (err, resx) => {
            if (err) {
                rej([false, err]);
            }
            else {
                res([true, resx]);
            }
        })
         con.end((err)=>{
            if(err) console.log("registerCompany : cannot destroy");
            else{
                console.log("registerCompany : con destroyed with db ");
            }
        });
    });
}



const insertJob = async (cpobj, data,file,pstr,datetime) => {
    console.time('qry:insertJob');
    return new Promise(async(res,rej)=>{
        
   let qry = `INSERT INTO postedjobs(\`cpname\`, \`cpemail\`, \`cppass\`,\`ttl\`, \`job\`,\`file\`,\`pstr\`,\`datetime\`) VALUES ('${cpobj.cpname}','${cpobj.cpemail}','${cpobj.cppass}','${data.pjttl}','${JSON.stringify(data)}','${file}','${pstr}','${datetime}')`;
    const con = await getConnect();
    con.query(qry, (err, resx) => {
     //   console.log(qry);
        if (err) {console.log(err);rej([false,err])}
        else {
            res([true,resx]);
          con.end((err)=>{
            if(err) console.log("insertJob : cannot destroy");
            else{
                console.log("insertJob : con destroyed with db ");
            }
        });
        }

    });
    console.timeEnd('qry:insertJob');
 
    });
     
}



const getJobs = async (email) =>{
    return new Promise(async (res,rej)=>{
        const con = await getConnect();
        const qry = `SELECT \`ttl\`, \`job\`,\`file\`,\`pstr\`,\`datetime\` FROM postedjobs WHERE cpemail='${email}'`
        con.query(qry,(err,resx,fields)=>{
            if(err) rej([false,err]);
            else{ 
             //   console.log(qry);
                let rr = [];
                Array.from(resx).forEach(val=>{
                  //  console.log(val);
                    let job = val.job
                    job['datetime'] = resx.datetime;
                   job = job.replaceAll('\n','\\n');
                   job = job.replaceAll('\r','');
                    
                   let xxx = Object.assign(JSON.parse(job),{pjfile:val.file,pjposter:val.pstr});
                   //console.log(xxx);
                    rr.push(xxx);
                });
                res([true,rr])
            }
            //console.table(JSON.parse((resx[0].jobs).replace("{},","")));
              con.end((err)=>{
            if(err) console.log("getJobs : cannot destroy");
            else{
                console.log("getJobs : con destroyed with db ");
            }
        });
        })
    })
}



const deleteJob =  (email,ttl,cpname)=>{
  return new Promise(async(res,rej)=>{
       con = await getConnect();
      
      const qry = `DELETE FROM postedjobs WHERE cpemail = '${email}' and ttl='${ttl}'`;
      const qry2 = `DELETE FROM jobsx where cpname='${cpname}' and jobttl='${ttl}' and cpemail='${email}'`;

        con.query(qry,(err,resx)=>{
                if(err){
                    console.log('err:mysq>deleteJob',err);
                    rej([false,err]);
                }
                else{
                    con.query(qry2,(err,data)=>{
                        if(err){
                            rej([false,err]);            
                        }
                        else{
                            con.end((err)=>{
                                if(err) console.log("deleteJob : cannot destroy");
                                else{
                                    console.log("deleteJob : con destroyed with db ");
                                }
                            });
                            res([true,'job deleted!']);
                        }
                    });
                }
        });

     
  });
  }

const getAllJobs = async()=>{
    console.time("qry:getAllJob : ")
    return new Promise(async(res,rej)=>{
        const con = await getConnect();
        const qry = `SELECT job,file,pstr FROM postedjobs`;
        con.query(qry,(err,data)=>{
            if(err) rej([false,err]);
            else{
                let arr = [];
             Array.from(data).forEach((val)=>{
                let obj = val.job;
                 obj = obj.replaceAll('\n','\\n');
                obj = obj.replaceAll('\r','');
                 obj = JSON.parse(obj);
                
                     obj.pjfile = val.file;
                     obj.pjposter=val.pstr;
                    arr.push(obj);
             });
               res(arr); 
            }
        })
         con.end((err)=>{
            if(err) console.log("getAllJobs : cannot destroy");
            else{
                console.log("getAllJobs : con destroyed with db ");
            }
        });
        console.timeEnd("qry:getAllJob : ");
    });
}

const applyjob = async (cpobj,usrobj,datetime)=>{
    return new Promise(async(res,rej)=>{
      try {
        console.time("applyjobqry")
        const con = await getConnect(); 
        let data="{}|";
        const fqry = `SELECT responses FROM jobsx WHERE cpname='${cpobj.pjcpname}' AND cpemail ='${cpobj.pjemail}' AND jobttl='${cpobj.pjttl}'`;

 
        usrobj = JSON.parse(usrobj);
       // console.table(usrobj);
        delete usrobj['resume'];
        delete usrobj['profile'];
     //   console.table(usrobj);

       const qry=`INSERT INTO jobsx(cpname, jobttl, cpemail,uemail,responses,datetime) VALUES ('${cpobj.pjcpname}','${cpobj.pjttl}','${cpobj.pjemail}','${usrobj.email}','${JSON.stringify(usrobj)}','${datetime}')`;
       // console.log(qry)
    
        con.query(qry,(err,rex)=>{
           if(err){
            rej([false,err]);
           }
           else{
            //console.log(rex);
            res([true,rex]);
           }
             con.end((err)=>{
            if(err) console.log("applyjob : cannot destroy");
            else{
                console.log("applyjob : con destroyed with db ");
            }
        });
          });
          console.timeEnd("applyjobqry");
        } catch (error) {
        console.log("mysq.js>applyjob>promise",error);
      }
    });
}

const checkJobForUser = async (cpjobobj,userob)=>{
    console.time("query:checkjobforuser");
    return new Promise(async(res,rej)=>{
        try {
            const con = await getConnect();
            const qry = `select responses from jobsx where cpname='${cpjobobj.pjcpname}' and jobttl = '${cpjobobj.pjttl}' and cpemail='${cpjobobj.pjemail}'`;
            con.query(qry,(err,resx)=>{
               let datas=[];
                if(err) rej([false,err]);
               else {
             //   console.table(cpjobobj);
                userob = JSON.parse(userob);
              //  console.table(userob);                    
              
                let objs = resx;
                for(let i=0;i<resx.length;i++){
                 // console.log(resx[i].responses.substring(1,resx[i].responses.length));
                    objs = JSON.parse(resx[i].responses);//.substring(1,resx[i].responses.length-1));
                 
                     if(objs.fname===userob.fname&&objs.lname===userob.lname&&objs.email===userob.email&&objs.phone===userob.phone&&objs.password===userob.password){
                      //  console.log(objs);
                        res([true,objs]);
                     }
                  //console.log(objs.responses);
                }
                    res([false,{msg:"not applied!"}]);
                 
               }
                 con.end((err)=>{
            if(err) console.log("checkJobForUser : cannot destroy");
            else{
                console.log("checkJobForUser : con destroyed with db ");
            }
        });
            })

        } catch (error) {
            rej([false,error]);
            console.log("mysq.js>checkjobforuser>",error);
        }
        const con = await getConnect();
        console.timeEnd("query:checkjobforuser");
    });
    
}

const checkAllAppliedJobForUser = async (userob)=>{
    console.time("qry:checkAllAppliedJobForUser");
    return new Promise(async (res,rej)=>{
        try {
            const con = await getConnect();
            // console.log(userob);
            // userob = JSON.parse(userob);
            delete userob['resume'];
            delete userob['profile'];
          //  console.log(userob);
            const qry = `select * from jobsx where responses='${JSON.stringify(userob).replaceAll("\\","")}'`;
          //  console.log(qry);
            con.query(qry,async(err,resx)=>{
                if(err){ rej([false,err]);
                    console.log(error);
                }
                else{
                
                    for (let item of resx) {

                        let data = await getJobDetails(item.cpname,item.cpemail,item.jobttl);
                      //  console.log(data);
                        item.details=data[1];
                        item['datetime'] = item.datetime;
                     
                    }
                   
                    res([true,resx]);
                }
                  con.end((err)=>{
            if(err) console.log("checkAllAppliedJobForUser : cannot destroy");
            else{
                console.log("checkAllAppliedJobForUser : con destroyed with db ");
            }
        });
            });
        } catch (error) {
            console.log(error);
            rej([false,error]);
        }
       

        console.timeEnd("qry:checkAllAppliedJobForUser");
 });
}

const getJobDetails = async (cpname,email,ttl)=>{
   // console.log(cpname,email,ttl);
    console.time("qry:getJobDetails: ");
    return new Promise(async(res,rej)=>{
        let resx,con,cmpny;
try {
 
     con = await getConnect();
     resx = await getJobs(email);
     cmpny = await checkCompanyx(email);
    cmpny = cmpny[1];
// console.log(cmpny);
 // console.log(resx);
 let findobj;
   
 for(let o of resx[1]){
     // o = o.replaceAll('\n','\\n');
     // o = o.replaceAll('\r','');
     // o = JSON.parse(o);

     if(o.pjttl==ttl){
         findobj = o;
         findobj.pjurl=cmpny[0].url;
       // console.log(findobj);
         res([true,findobj]);
     break;
     }
 }
 console.timeEnd("qry:getJobDetails: ");
} catch (error) {
    console.log(error);
    rej([false,error]);
}

    })
}

const checkCompanyx = async (email) => {
    console.time("qry:checkCompanyx : ");
    return new Promise(async (res, rej) => {
        const con = await getConnect();
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
              con.end((err)=>{
            if(err) console.log("checkCompanyx : cannot destroy");
            else{
                console.log("checkCompanyx : con destroyed with db ");
            }
        });
        });
        console.timeEnd("qry:checkCompanyx : ");
    })
}

const getApplicantDetails = async (cpname,jbttl,jbemail) =>{
     console.log(cpname,jbttl,jbemail)
    console.time("qry : getApplicantDetails");
    return new Promise(async(res,rej)=>{
        try {
            const con = await getConnect();

            const qry = `SELECT responses FROM jobsx WHERE cpname='${cpname}' and jobttl = '${jbttl}' and cpemail='${jbemail}'`;
            console.log(qry);
            con.query(qry,async(err,resx)=>{
                if(err) {
                    res([false,err]);
                    console.log("err : getApplicantDetails : ",err);
                }
                else{
                    let appliArray=[],count=0;
                    for (let item of resx) {
                        //item = JSON.parse(item.responses.substring(1,item.responses.length()));
                        // console.log(item);
                        item = JSON.parse(item.responses)//.substring(1,item.responses.length-1);
                       // console.table(item);
                        //item = JSON.parse(item);
                        try{
                            omedia = await getUserMedia(item.email,item.password);
                            item['resume'] = omedia[1].resume;
                            item['profile'] = omedia[1].profile;
                            }
                            catch(err){
                                console.log(err);
                                item.resume="";
                                item.profile="./static/img/userprofile.webp";
                            }
                        item.password = '';
                        count++;
                        appliArray.push(item);
                    }
                    let obj ={};
                    obj.count = count;
                    obj.application = appliArray;
               //   console.log(obj);
                    res([true,obj]);
                }
            });
    
            con.end((err)=>{
                if(err) {
                    console.log("getApplicantDetails : cannot destroy");
            }
                else{
                    console.log("getApplicantDetails : con destroyed with db ");
                    console.timeEnd("qry : getApplicantDetails");
                } 
                     
             });
        } catch (error) {
            rej([false,error]);
            console.log("err:mysq>getApplicantDetails",err);
        }
        
       
});
}

const getAcceptedApplicatns = async (cpname,jbemail,jbttl)=>{
    jbttl = jbttl.replaceAll("\'","");
    jbemail = jbemail.replaceAll("\'","");
    return new Promise(async(res,rej)=>{
        const con = await getConnect();
      const qry = `SELECT responses FROM jobsx WHERE cpname='${cpname}' and jobttl = '${jbttl}' and cpemail='${jbemail}' and accepted=true`;
      con.query(qry,async(err,resx)=>{
        if(err) {
            console.log("err : getAcceptedApplicatns : ",err);
            rej(err);
        }
        else{
            let appliArray=[],count=0;
            for (let item of resx) {
                //item = JSON.parse(item.responses.substring(1,item.responses.length()));
                // console.log(item);
                item = JSON.parse(item.responses)//.substring(1,item.responses.length-1);
               // console.table(item);
                //item = JSON.parse(item);
                try{
                    omedia = await getUserMedia(item.email,item.password);
                    item['resume'] = omedia[1].resume;
                    item['profile'] = omedia[1].profile;
                    }
                    catch(err){
                        console.log(err);
                        item.resume="";
                        item.profile="./static/img/userprofile.webp";
                    }
                item.password = '';
                count++;
                appliArray.push(item);
            }
            let obj ={};
            obj.count = count;
            obj.application = appliArray;
       //   console.log(obj);
          res([true,obj]);
        }});
        con.end((err)=>{
            if(err) {
                console.log("getAcceptedApplicatns : cannot destroy");
        }                 
         });      
  
    });
}

const deleteJobUser = async(obj,userob) =>{
    return new Promise(async(res,rej)=>{
        console.time('qry:deleteJobUser');
        const con = await getConnect();

        delete userob['resume'];
        delete userob['profile'];

        const qry = `DELETE FROM jobsx WHERE cpname='${obj.cpname}' AND jobttl='${obj.jobttl}' AND responses='${JSON.stringify(userob)}'`;
      //  console.log(qry);
        con.query(qry,(err,data)=>{
            if(err){
                console.log("err:mysq>deleteJobUser",err);
                rej([false,err]);
            }
            else{
               // console.log(data);
                res([true,data]);
            }
        });

        con.end((err)=>{
            if(err) {
                console.log("deleteJobUser : cannot destroy");
                console.timeEnd("qry:deleteJobUser");
        }
            else{
                console.log("deleteJobUser : con destroyed with db ");
                console.timeEnd("qry:deleteJobUser");
            } 
                 
         });

    });
}

const acceptJob =async (cpemail,jbttl,uemail)=>{
    return new Promise(async(res,rej)=>{
        const con = await getConnect();

        const qry=`UPDATE jobsx SET accepted=true WHERE cpemail='${cpemail}' AND jobttl='${jbttl}' AND uemail='${uemail}'`;

        con.query(qry,(err,data)=>{
            if(err){
                rej([false,err]);
            }
            else{
                res([true,data]);
            }
        });

        con.end((err)=>{
            if(err) {
                console.log("acceptJob : cannot destroy");
        }
            else{
                console.log("deleteJobUser : con destroyed with db ");
            }  
         });
    });
}

const recievedjob = async (userob)=>{
    return new Promise(async(res,rej)=>{
        const con = await getConnect();
        const qry=`SELECT  cpname,cpemail,jobttl,uemail,datetime FROM jobsx WHERE accepted=true AND uemail ='${userob.email}'`;

        con.query(qry,async(err,data)=>{
            if(err){
                rej(err);
            }
            else{
                let jobs =new Array();
                // data.forEach(async(job) => {
                //  //   console.table(job);
                //     let jx = await getJobDetails(job['cpname'],job['cpemail'],job['jobttl']);
                //     console.log(typeof jx[1],jx);
                //   //  jobs.push(JSON.stringify(jx[1]));
                // });

                for(let item of data) {
                    let jx = await getJobDetails(item['cpname'],item['cpemail'],item['jobttl']);
                    jobs.push(jx[1]);
                }
                
               
                res(jobs);
            }
        });

        con.end((err)=>{
            if(err){
                console.log("recivedjob : canot destroy con",err);
            }
        });
        
    });
}

module.exports = { getConnect, insertRec, deleteRecord, getUser, registerCompany,insertJob,getJobs,deleteJob,getAllJobs,applyjob,checkJobForUser,checkAllAppliedJobForUser,getJobDetails,getApplicantDetails,updateResumeProfilePath,getUserMedia,deleteJobUser,acceptJob
,recievedjob,getAcceptedApplicatns};


// (
//     async function (){
//         const data = await getAcceptedApplicatns('MS Corp','Software Engineer','svlmehul@gmail.com');
//         console.log(data);
//     }
// )()

// (
//     async function(){
//         const dt = await recievedjob({email:'savaliyamehul95@gmail.com'});
//        console.log(dt);
//     }
// )()

// (async function(){



//     const con = await getConnect();
//     con.query('select pstr from postedjobs where ttl="3"',(err,data)=>{
//         console.log(data[0].pstr.toString("hex"));
//         fs.writeFile("./test.jpg",data[0].pstr.toString("binary"),(err)=>console.log(err));
//     });
// })()

// (async function(){
//     const data = await getUserMedia('1234@123','1234');
//     console.log(data);
// })()

// (async function(){
//     const data = await getApplicantDetails('MS Corp','Devops ','svlmehul@gmail.com');
//     console.log(data);
// })()

// (async function(){
//     const data = await getJobDetails('123456','123456@123456','Dancer');
//     console.log(data[1]);
// })()

// (async function(){
//     try {
     
//     const responses = await checkAllAppliedJobForUser({"fname":"Mehul","lname":"Savaliya","email":"savaliyamehul95@gmail.com","phone":"9510754137","password":"savaliyamehul95@gmail.com"});
//     console.log(responses[1]);   
//     } catch (error) {
//         console.log(error);
//     }
// })()

// (async function(){
//     const responses = await checkJobForUser({
//         pjcpname:"123456",
//         pjemail:"123456@123456",
//         pjttl:"Dancer"
//     },{"fname":"1","lname":"2","email":"123@123","phone":"123","password":"123"});
//    // console.log(responses);
// })()

// (async function(){
//     const rex = await applyjob({
//         pjemail:"1",pjttl:"1",pjcpname:"1"
//     },{"fname":"Test","lname":"Test","email":"A@A","phone":"Test","active":true,"password":"teee"})

//     console.log(rex);
// })()


// (async function(){
//     const emails = await getAllJobs();
    
//           console.log(emails);
            
// })()


// (async function(){
//     try {
//         const resx = await deleteJob('123456@123456','44');
//         console.log(resx);
             
//     } catch (error) {
//     console.log(error);     
//     }
//         })()

// (async function(){
//     try {
//         const data = await getJobs("svlmehul@gmail.com");
//         // let jsn = JSON.parse("["+data[1]+"]")
//             // for(let x of data){
//             //     console.log(x);
//             // }
//             //console.log(data[1]);
//     } catch (error) {
//         console.log(error);
//     }

//     })()

//getJobs("123456@123456");
// const resx = await mysq.getJobs(obj.cpemail);
// console.table(resx[1]);

 //insertJob("123456@123456",{test:123});

// let f = async()=>{
//     let cp ={
//         "ROLE": "CP",
//         "cpfname": "ss",
//         "cplname": "ss",
//         "cpname": "ss",
//         "cpurl": "http:/test.com",
//         "cpbshr": "",
//         "cpaddr": "ss",
//         "cpsize": "600",
//         "cpemail": "ss@ss",
//         "cpphone": "ss",
//         "cppass": "ss"
//         };
//     const res = await registerCompany(cp);
//     console.table(res[1]);
// }
// f();
// getConnect().then((con)=>{
//     insertRec(con,{
//         fname:"MS",
//         lname:"MS",
//         email:"MS@Job",
//         phone:"+919510754137",
//         resume:"",
//         coverletter:"",
//         active:true,
//         password:"MS"
//     }).then((val)=>console.log(val))
//     deleteRecord(con,"MS@Job","MS").then(val=>console.log(val))
// })

// console.log("start");
// getConnect().then((con=>{
//      getUser(con,'AA@AA','44').then(val=>console.log(val[0]))
//      .catch(err=>console.log(err));
// }))

// console.log('end');
