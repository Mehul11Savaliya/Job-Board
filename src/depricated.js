// const DeprideleteJob=  (email,ttl)=>{
//   //  console.log(email, ttl);
// return new Promise(async(res,rej)=>{
//     let resx,con;
// try {
 
//      con = await getConnect();
//      resx = await getJobs(email);
       
// } catch (error) {
//     console.log(error);
// }
//    // console.log(resx);
//     let findobj;
//     let i=0;
//     for(let o of resx[1]){
//         if(o.pjttl==ttl){
//             findobj = o;
//         //   console.table(findobj);
//             break;
//         }
//         i++;
//     }

  
//     if(findobj===undefined) rej([false,"job not exist!"]);
//     else {
//         findobj = JSON.stringify(findobj);
//         resx = JSON.stringify(resx[1]);
//       //  console.table(JSON.parse(resx));
//         resx = resx.replaceAll(","+findobj,"");
//         resx = resx.replaceAll("[","");
//         resx = resx.replaceAll("]","");
//        //console.table(JSON.parse(resx));
//        let con = await getConnect()
//         con.query(`UPDATE company set jobs='{}|' WHERE email='${email}'`,(err,resx)=>{
//             if(err){
//             console.log("err in deleting job LN:149");
//             rej([false,"deleting problem"]);}
//         });
//         con.query(`update company set jobs='${resx+"|"}' WHERE email='${email}'`,(err,resx)=>{
//             if(err){
//             console.log("err in deleting job LN:154");
//             rej([false,"deleting problem"]);}
//         });
//         res([true,"job deleted!"]);
//     }
//      con.end((err)=>{
//             if(err) console.log("deleteJob : cannot destroy");
//             else{
//                 console.log("deleteJob : con destroyed with db ");
//             }
//         });
// });
// }

// const DeprigetJobs = async (email) =>{
//     return new Promise(async (res,rej)=>{
//         const con = await getConnect();
//         const qry = `SELECT jobs FROM company WHERE email ='${email}'`
//         con.query(qry,(err,resx,fields)=>{
//             if(err) rej([false,err]);
//             else{ 
//                 let js= resx[0].jobs;
                
//                 js  = js.replace("|","");
//                     //console.log(hsx);
//                     js = js.replaceAll("\n","\\n");
//                 res([true,JSON.parse("["+js+"]")])
//             }
//             //console.table(JSON.parse((resx[0].jobs).replace("{},","")));
//               con.end((err)=>{
//             if(err) console.log("getJobs : cannot destroy");
//             else{
//                 console.log("getJobs : con destroyed with db ");
//             }
//         });
//         })
//         // con.end((err)=>{
//         //     console.log("connection closed... err : ",err);
//         // })
//     })
// }

// const DepriinsertJob = async (email, data) => {
//     let datax;
//     let qry = `SELECT jobs FROM company WHERE email='${email}'`;
//     const con = await getConnect();
//     con.query(qry, (err, resx) => {
//         if (err) console.log(err);
//         else {
//             datax = resx[0].jobs;
//             datax = datax.replace("|", `,${JSON.stringify(data)}|`);
//             qry = `UPDATE company set jobs='${datax}' WHERE email='${email}'`;
//         //    console.log(qry);
//             con.query(qry, (err, rex2) => {
//                 if (err) {
//                     console.log(err);
//                 }
//                 else {
//                   //  console.log(qry, rex2);
//                 }
//             });
//           con.end((err)=>{
//             if(err) console.log("insertJob : cannot destroy");
//             else{
//                 console.log("insertJob : con destroyed with db ");
//             }
//         });
//         }

//     });
//     // con.end((err)=>{
//     //     console.log("connection closed... err : ",err);
//     // })

//     // UPDATE company set jobs='[value-13]' WHERE 1
// }


// const DeprigetAllJobs = async()=>{
//     console.time("qry:getAllJob : ")
//     return new Promise(async(res,rej)=>{
//         const con = await getConnect();
//         const qry = `SELECT jobs FROM company`;
//         con.query(qry,(err,data)=>{
//             if(err) rej([false,err]);
//             else{
//               let jso ="";
//               jso+="[";
//               data.forEach(val=>{
//                     tmp = JSON.stringify(val).replaceAll("|","");
//                     jso+=","+tmp;
//               })
//               //console.log(jso);
//             jso =jso.replace(",","");
//              jso+="]";
//               let jsn = JSON.parse(jso);
//                res(jsn); 
//             }
//         })
//          con.end((err)=>{
//             if(err) console.log("getAllJobs : cannot destroy");
//             else{
//                 console.log("getAllJobs : con destroyed with db ");
//             }
//         });
//         console.timeEnd("qry:getAllJob : ");
//     });
// }
