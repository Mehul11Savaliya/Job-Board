// const indeed = require("indeed-scraper");
// console.log(indeed);
// const queryOptions = {
//     host: 'www.indeed.com',
//     query: 'Software',
//     city: 'Seattle, WA',
//     radius: '25',
//     level: 'entry_level',
//     jobType: 'fulltime',
//     maxAge: '7',
//     sort: 'date',
//     limit: 100
//   };
  
//   indeed.query(queryOptions).then(res => {
//       res
//   });

// const mysq = require("./src/mysq.js");

// mysq.getConnect().then((val)=>{
//     mysq.insertRec(val,{
//         fname:"MS",
//         lname:"MS",
//         email:"MS@Job",
//         phone:"+919510754137",
//         resume:"",
//         coverletter:"",
//         active:true,
//         password:"MS"
//     }).then(valx=>console.log(valx))
// })



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
