const express = require("express");
const ejs = require("ejs");
const path = require("path");
const fs = require("fs");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const bodyparser = require("body-parser");
const formidable = require("formidable");
const CryptoJs = require("crypto-js");


const mysq = require("./src/mysq.js");
const auth = require("./src/authenticate.js");
const regutil = require("./src/registerutility.js");
const chat = require("./src/chat");
const media = require("./src/media.js");

const app = new express();
const host = `localhost`;
const multer = require("multer");
const { raw, json } = require("body-parser");
const { getConnect } = require("./src/db.js");
const { getUserProfile } = require("./src/libuserprofile.js");
const { checkCompany } = require("./src/authenticate.js");
const port = 5555;

let viewcx = 0;

app.set("view engine", ejs);
app.set("views", path.join(__dirname, "/views"));

app.use(bodyparser.urlencoded());
app.use(bodyparser.json());
app.use("/static", express.static(path.join(__dirname, "static")));
app.use("/public", express.static(path.join(__dirname, "public")));

//session management
app.use(cookieParser());
app.use(
  session({
    secret: "AX123",
    resave: true,
    saveUninitialized: true,
  })
);

app.get("/", (req, res) => {
  viewcx++;
  res.status(200).render("index.ejs", { data: { viewc: viewcx } });
});

app.get("/cmpreview", (req, res) => {
  res.status(200).send("Umder Devlompment 👻");
});

app.get("/salaryguide", (req, res) => {
  res.status(200).send("Umder Devlompment 👻");
});

app.get("/postresume", (req, res) => {
  res
    .status(200)
    .render("templates/userprofile_uploaderesume.ejs", { data: { msg: "" } });
});

app.get("/cpupdateprofile", (req, res) => {
  res
    .status(200)
    .render("templates/cpprofile_uploadmedia.ejs", { data: { msg: "" } });
});

app.get("/signin", (req, res) => {
  res.status(200).render("signin.ejs", { data: { err: "" } });
});

app.get("/postjob", (req, res) => {
  res.status(200).send("Umder Devlompment 👻");
});

app.get("/forgetpass", (req, res) => {
  res.status(200).send("Umder Devlompment 👻");
});

app.get("/registercmpny", (req, res) => {
  res.status(200).render("companyregistration.ejs", { data: {} });
});

app.get("/startregister", (req, res) => {
  // res.status(200).sendFile(path.join(__dirname, "/template/register.html"));
  res.status(200).render("register.ejs", { result: { exist: "" } });
});

app.get("/userprofile", (req, res) => {
  //   console.log(typeof JSON.parse(req.session.userData));
  let obx = JSON.parse(req.session.userData);
  res.status(200).render("profile.ejs", { res: obx });
});

app.get("/userprofile/appliedjob", (req, res) => {
  let obx = JSON.parse(req.session.userData);
  res.status(200).render("userprofile_appliedjob.ejs", { res: obx });
});

app.get("/userprofile/recievedjob", async (req, res) => {
  try {
    const datax = await mysq.recievedjob(JSON.parse(req.session.userData));
    res.status(201).render('userprofile_recivedjob.ejs', { res: JSON.parse(req.session.userData) });
  } catch (error) {
    res.status(201).json({ msg: 'Got Some Error You ☠' });
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.send("Not Able To Log Out ");
      console.log(err);
    } else {
      console.log("user logged out");
      res.redirect("/signin");
    }
  });
});

app.get("/profile/:ctrl", async (req, res) => {
  if (req.params['ctrl'] === 'userprofile') {
    //console.log(req.session.userData);
    let userData = JSON.parse(req.session.userData);

    let qry = `SELECT * FROM userprofile WHERE email='${userData.email}';`;
    const con = await getConnect();
    let datax, sociallinks, skillsproachiev;
    con.query(qry, (err, data, fields) => {
      try {
        datax = data[0];
        sociallinks = JSON.parse(datax.sociallinks);
        skillsproachiev = JSON.parse(datax.skillsproachiev);
        if (userData.resume === undefined || userData.profile === undefined) {
          userData.resume = '';
          userData.profile = "./static/img/userprofile.webp";
        }
      } catch (error) {
        datax = {};
        sociallinks = {};
        skillsproachiev = {};
      }

      //res.send(userData);
      res.render('templates/userprofile.ejs', { data: datax, res: userData, social: sociallinks, spa: skillsproachiev });

    });
    con.end((e) => { if (e) console.log('can not close connection') });


    //   console.log(userData);
  }
  if(req.params['ctrl']==='cpprofile'){
    console.log(JSON.parse(req.session.cmpny));
  res.render('templates/cpny.ejs',{data:JSON.parse(req.session.cmpny),social:{}});
  }
});


//public profile rout 
app.get("/profile/:type/:id", async (req, res) => {
  if (req.params['type'] === 'usr') {
    let email = req.params['id'];
    if (email === '' || email === undefined) {
      res.status(200).send("no profile found");
    }
    else {
      try {
        const uprfl = await getUserProfile(email);

        const ure = await auth.checkUser(email);
        const umedia = await mysq.getUserMedia(ure[1].email, ure[1].password);
        delete ure['password'];

        let resx = JSON.parse(ure[1].data);
        resx.profile = umedia[1].profile;
        resx.resume = umedia[1].resume;
        resx.data = uprfl;
        delete resx['password'];

        let social = JSON.parse(uprfl.sociallinks);
        let spa = JSON.parse(uprfl.skillsproachiev);

        //     try {
        //       resx.social = JSON.parse(uprfl.sociallinks);
        //       resx.spa = JSON.parse(uprfl.skillsproachiev);
        //       console.log(resx.social);
        //       if(resx.uprfl.fullname===undefined){
        //         res.status(200).send("no profile found");
        //       }
        //     } catch (error) {
        //       resx.social = {}
        //       resx.spa = {};
        //     }
        //     console.log(resx.social);

        res.render('templates/public_userprofile.ejs', { res: resx, data: resx.data, social: social, spa: spa });

      } catch (error) {
        res.status(200).send("no profile found");
      }
    }
  }
  if (req.params['type'] === 'cpn') {
    let email = req.params['id'];
    if (email === '' || email === undefined) {
      res.status(200).send("no profile found");
    }
    else {
      let cpdata = {};
    cpdata = await checkCompany(email);
      console.log(cpdata);
      let mediax  = await media.getCompanyMedia(cpdata[1][0].email,cpdata[1][0].pass);
      cpdata.test = mediax[1][0].profile;
      let obx = {...cpdata[1][0],...mediax[1][0]};
    //  res.send(obx);
    res.render('templates/public_cpny.ejs', {data : obx,social:JSON.parse(cpdata[1][0].social)});
    }
  }
});


app.post("/profile/:ctrl", async (req, res) => {

  if (req.params['ctrl'] === 'upprofile') {
    if (req.body.oemail === undefined) {
      res.status(401).send("<h1 style='color:red'>Unauthorized 🐦</h1>");
    } else {
      let qarray = [];

      let { fname, email, phone, address, about, roll, oemail } = req.body;
      if (fname !== '') {

        qarray.push(`UPDATE userprofile SET fullname='${fname}' where email='${oemail}'`);
      }
      if (email !== '') {
        qarray.push(`UPDATE userprofile SET email='${email}' where email='${oemail}'`);
      }
      if (phone !== '') {
        qarray.push(`UPDATE userprofile SET mobile='${phone}' where email='${oemail}'`);
      }
      if (address !== '') {
        qarray.push(`UPDATE userprofile SET address='${address}' where email='${oemail}'`);
      }
      if (about !== '') {
        qarray.push(`UPDATE userprofile SET about='${about}' where email='${oemail}'`);
      }
      if (roll !== '') {
        qarray.push(`UPDATE userprofile SET roll='${roll}' where email='${oemail}'`);
      }
      let qrr = '';
      for (let item of qarray) {
        qrr += item + ";"
      }

      // console.log(qarray,fname,phone, address);
      // res.status(201).json({data:qarray});

      //    let qry = `UPDATE userprofile SET fullname='[value-2]',email='[value-3]',mobile='[value-4]',address='[value-5]',about='[value-6]',roll='' WHERE email='${email}'`;
      const con = await getConnect();
      con.query(qrr, (err, data) => {
        if (err) {
          console.log(err);
          res.status(201).json({ msg: 'Not Able To Update' });
        }
        else {
          res.status(201).json({ msg: 'Updated Successfully' });
        }
      });
      con.end((e) => { if (e) console.log("not able to close connection : ", e) });
    }

  }
  if (req.params['ctrl'] === 'upsocial') {
    if (req.body.oemail === undefined) {
      res.status(401).send("<h1 style='color:red'>Unauthorized 🐦</h1>");
    } else {
      let oemail = req.body.oemail;
      if(req.body.cpn){
        let dtx = {};
        dtx = req.body;
        delete dtx['cpn'];
        delete dtx['oemail'];

        const con = await getConnect();
        const qry = `UPDATE company SET social='${JSON.stringify(dtx)}' WHERE email = '${oemail}'`;
        con.query(qry, (err, data) => {
          if (err) {
            console.log(err);
            res.status(201).json({ msg: 'Not Able To Update' });
          }
          else {
            res.status(201).json({ msg: 'Updated Successfully' });
          }
        });
        con.end((e) => { if (e) console.log("not able to close connection : ", e) });

      }
      else{

    oemail = req.body.oemail;
      let obx = req.body;
      delete obx['oemail'];
      const con = await getConnect();
      const qry = `UPDATE userprofile SET sociallinks='${JSON.stringify(obx)}' WHERE email = '${oemail}';`;
      //   console.log(qry);
      con.query(qry, (err, data) => {
        if (err) {
          console.log(err);
          res.status(201).json({ msg: 'Not Able To Update' });
        }
        else {
          res.status(201).json({ msg: 'Updated Successfully' });
        }
      });
      con.end((e) => { if (e) console.log("not able to close connection : ", e) });
    }
    }
  }
  if (req.params['ctrl'] === 'upskpoach') {
    if (req.body.oemail === undefined) {
      res.status(401).send("<h1 style='color:red'>Unauthorized 🐦</h1>");
    } else {
      let oemail = req.body.oemail;
      let obx = req.body;
      let newobx = {};
      for (let key in obx) {
        // console.log(key.toString().split('_').reverse()[0]);
        if (key.toString().split('_').reverse()[0] === '' || obx[key] === '') {
          continue;
        }
        else {
          newobx[key] = obx[key];
        }
      }
      const con = await getConnect();
      const qry = `UPDATE userprofile SET skillsproachiev='${JSON.stringify(newobx)}' WHERE email = '${oemail}';`;
      //   console.log(qry);
      con.query(qry, (err, data) => {
        if (err) {
          console.log(err);
          res.status(201).json({ msg: 'Not Able To Update' });
        }
        else {
          res.status(201).json({ msg: 'Updated Successfully' });
        }
      });
      con.end((e) => { if (e) console.log("not able to close connection : ", e) });
    }

  }
});

app.post("/register", async (req, res) => {
  let obj = {};
  obj.fname = req.body.regfname;
  obj.lname = req.body.reglname;
  obj.email = req.body.regemail;
  obj.phone = req.body.regphone;
  obj.active = true;
  obj.password = req.body.regpass;
  obj.profile = "./static/img/userprofile.webp";

  const resx = await auth.checkUser(obj.email);

  if (resx[0]) {
    //user exist
    const resp = {};
    resp.exist = "Can not Create Accout User Alredy Exist!";
    res.status(200).render("register.ejs", { result: resp });
  } else {
    const insrtflag = mysq.insertRec(obj);
    // req.session.userDatareg = obj;
    // req.session.save();
    // res.render("profile.ejs", { res: req.session.userDatareg });
    res.redirect('/signin');
  }
});

app.get("/test", async (req, res) => {
  const data = await mysq.getAllJobs();
  // res.status(201).json({
  //   test :'echo1'

  // });
  res.status(200).json(data);
  // res.sendFile(path.join(__dirname, "/template/test.html"));
});
app.post("/test", (req, res) => {
  const form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    console.dir(files);

    var oldPath = files.file.filepath;
    var newPath =
      path.join(__dirname, "public") + "/" + files.file.name + ".jpg";
    var rawData = fs.readFileSync(oldPath);

    fs.writeFile(newPath, rawData, function (err) {
      if (err) console.log(err);
      return res.send("Successfully uploaded");
    });
  });
});

app.post("/signin", async (req, res) => {
  //  auth.getUserx(req.body['sign-email'],req.body['sign-pass']).then(val=>console.log(val))
  try {
    const us = await auth.getUserx(
      req.body["sign-email"],
      req.body["sign-pass"]
    );
    const cp = await auth.getCompany(
      req.body["sign-email"],
      req.body["sign-pass"]
    );
    if (us[0] !== undefined) {
      console.log("user");
      let o = us[0];
      //  console.log(o);
      let obj = {};
      obj.fname = o.firstname;
      obj.lname = o.lastname;
      obj.email = o.email;
      obj.phone = o.phone;
      obj.password = o.password;

      let omedia;
      try {
        omedia = await mysq.getUserMedia(obj.email, obj.password);
        obj.resume = omedia[1].resume;
        obj.profile = omedia[1].profile;
      } catch (err) {
        console.log(err);
        obj.resume = "";
        obj.profile = "./static/img/userprofile.webp";
      }
      //    console.log(obj);
      req.session.userData = JSON.stringify(obj);
      req.session.save();
      res.redirect("/userprofile");
    } else if (cp[0]) {
      console.log("company");
      cp[1] = cp[1][0];
      let obj = {};
      obj.cpfname = cp[1].fname;
      obj.cplname = cp[1].lname;
      obj.cpname = cp[1].name;
      obj.cpurl = cp[1].url;
      obj.cpaddr = cp[1].addr;
      obj.cpsize = cp[1].size;
      obj.cpemail = cp[1].email;
      obj.cpphone = cp[1].phone;
      obj.cppass = cp[1].pass;
      obj.cpactive = cp[1].active;
      obj.cpjobs = cp[1].jobs;
      obj.cpcanjobs = cp[1].canjobs;
      obj.cpreview = cp[1].review;

      const prof = await media.getCompanyMedia(obj.cpemail, obj.cppass);

      if (prof[1][0] === undefined) {
        obj.profile = ".";
      } else {
        obj.profile = prof[1][0].profile;
      }
      req.session.cmpny = JSON.stringify(obj);
      req.session.save();
      res.redirect("/cpprofile");
    } else {
      res
        .status(200)
        .render("signin.ejs", { data: { err: "Invalid  Id And Pass" } });
    }
  } catch (e) {
    console.log(e);
  }
});

//company role
app.post("/cpregister", async (req, res) => {
  try {
    const exist = await auth.checkCompany(req.body.cpemail);
    // console.log(exist,req.body.cpemail);
    if (exist[0]) {
      let datax = {};
      datax.err = "Company Already Registered!";
      res.status(200).render("companyregistration.ejs", { data: datax });
    } else {
      const rs = await mysq.registerCompany(req.body);
      if (rs[0]) {
        req.session.cmpny = JSON.stringify(req.body);
        req.session.save();
        res.redirect("/cpprofile");
      } else {
        res.status(200).end("We are Facing Some Issue");
      }
    }
  } catch (e) {
    res.status(200).end("We are Facing Some Issue");
    console.log(e);
  }
});

app.get("/cpprofile", (req, res) => {
  let datax = JSON.parse(req.session.cmpny);
  // console.log(datax);
  res.status(200).render("cpprofile.ejs", { data: datax });
});

//job handling
app.post("/setjob", async (req, res) => {
  let obj = JSON.parse(req.session.cmpny);
  //const result = await mysq.insertJob(obj,req.body);
  //if(result[0]){
  // res.status(201).json({msg:"Job Posted!"});
  //}

  let form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, file) => {
    try {
      let raw1 = fs.readFileSync(file.pjfile.filepath);
      let raw2 = fs.readFileSync(file.pjposter.filepath);

      let ext2 = file.pjposter.mimetype.split("/")[1];
      let paths = await media.insertJobMedia(
        raw1,
        raw2,
        "pdf",
        ext2,
        obj.cpemail,
        fields.pjttl
      );
      //   console.log(paths);
      const result = await mysq.insertJob(obj, fields, paths[0], paths[1],
        fields.datetime);
      fields.pjposter = paths[1];
      fields.pjfile = paths[0];
      res.status(201).json({
        msg: 'Job Posted!✔',
        data: fields
      });
    } catch (error) {
      console.log(error);
      res.status(201).json({ msg: "Job Not Posted." });
    }
  });

  // let blob = new Blob(rdt., {type: 'image/png'});

  // const blob = new Blob(Buffer.from(rdt));

  //pjfile
  //pjposter
  //console.log(rdt);
  //const buff =  Buffer.from(rdt);
  //  const blob = new Blob([buff]);
  // //  console.log(buff.toString("binary"));
  //  console.log(rdt);

  //   //   console.log(result);
  //     if(result[0]){
  //       res.status(201).json({msg:"Job Posted!"});
  //       }
  //       else{
  //         res.status(201).json({msg:"Job NOT Posted!"});
  //       }
});

app.post("/getJobs", async (req, res) => {
  let obj = JSON.parse(req.session.cmpny);

  const resx = await mysq.getJobs(obj.cpemail);
  res.status(201).json(resx[1]);
});

app.post("/deletejob", async (req, res) => {

  try {
    const resx = await mysq.deleteJob(
      req.body.cpemail.replaceAll("'", ""),
      req.body.cpttl.replaceAll("'", ""),
      JSON.parse(req.session.cmpny).cpname
    );
    media.deleteJobMedia(req.body.cpemail.replaceAll("'", ""),
      req.body.cpttl.replaceAll("'", ""),
      req.body.extimg.replaceAll("'", ""));
    res.status(201).json({ msg: resx[1] });
  } catch (error) {
    console.log(error);
  }
});

app.post("/getalljobs", async (req, res) => {
  const jobs = await mysq.getAllJobs();
  // console.log(jobs);
  res.status(201).json(jobs);
});

app.post("/appyJob", async (req, res) => {
  try {
    let jobseeker = req.session.userData;
    const validjob = await mysq.checkJobForUser(req.body, jobseeker);
    if (validjob[0]) {
      res.status(201).json({ msg: "Already Applied" });
    } else {
      const resx = await mysq.applyjob(req.body, jobseeker, req.body.datetime);
      res.status(201).json({
        msg: `"Applied Successfully! You Will Reciev Mail From : ${req.body.pjemail}"`,
      });
    }
  } catch (error) {
    console.log(error);
  }
});

app.get("/cpprofile/postedjob", (req, res) => {
  let obx = JSON.parse(req.session.cmpny);
  res.status(201).render("cpprofile_postedjob.ejs", { data: obx });
});

app.get("/cpprofile/:type", async (req, res) => {
  if (req.params['type'] === 'schedules') {
    try {
      let cpn = JSON.parse(req.session.cmpny);
      //   let jbs = await mysq.getJobs(cpn.cpemail);
      //   jbs = jbs[1];
      //   let jbarray = [];
      //  for(let val of jbs) {
      //   jbarray.push(val.pjttl);
      //  }

      //  let applicas = [];
      //   for(let ttls of jbarray) {

      //   const adta = await mysq.getAcceptedApplicatns(cpn.cpname,cpn.cpemail,ttls);
      //     adta[1].ttl = ttls;
      //   applicas.push(adta[1]);
      //   }


      let applic = await mysq.getSchedules(cpn);
      //console.log(applic);

      res.status(200).render('schedules.ejs', { data: cpn, apps: applic });
      //res.status(201).json(applic);
    } catch (error) {
      console.log(error);
      res.status(200).send("<h1>Login First! sir🐦</h1>");
    }
    // if(cpn===undefined){
    //     res.status(200).send("<h1>Login First! sir🐦</h1>");
    // }
    // else{
    //   res.status(201).json(cpn);
    // }
  }
});

//job related
app.get("/job/:type", async (req, res) => {
  if (req.params["type"] === "getAppliedJobs") {
    const result = await mysq.checkAllAppliedJobForUser(JSON.parse(req.session.userData));
    // console.log(result);
    res.status(201).send(result[1]);
  }
  if (req.params['type'] === 'schedule') {
    if (req.session.cmpny === undefined) {
      res.status(201).send('<h1>u dont hab permisson sir 🤡</h1>');
    }
    else {
      let cp = JSON.parse(req.session.cmpny);
      //  console.log(req.query);
      const adta = await mysq.getAcceptedApplicatns(cp.cpname, req.query.jobemail, req.query.jobttl);
      res.status(201).render('cp_schedule.ejs', { data: cp, apldata: adta[1] });
      // res.status(201).json({data:JSON.parse(req.session.cmpny)});
    }
  }
});

app.post("/job/:type", async (req, res) => {
  if (req.params["type"] === "getApplicants") {
    //   console.log(req.body);
    let da = req.body;
    let data = await mysq.getApplicantDetails(
      JSON.parse(req.session.cmpny).cpname,
      da.jbttl,
      da.jbemail
    );


    if (data[1].count > 0) {
      let i = 0;
      for (let item of data[1]['application']) {
        data[1]['application'][i].apprfl = await getUserProfile(item.email);
        i++;
      }
      res.status(201).json(data[1]);
    } else {
      res.status(201).json({ ack: "not found" });
    }
  }
  if (req.params["type"] === "deleteJobUser") {
    if (req.body === undefined) {
      res.status(201).json({ msg: "Job Not Deleted" });
      console.log("req body part");
    } else {
      const resx = await mysq.deleteJobUser(
        req.body,
        JSON.parse(req.session.userData)
      );
      if (resx[0]) {
        res.status(201).json({ msg: "Job Removed(☞ﾟヮﾟ)☞!" });
        console.log("else 1");
      } else {
        console.log("else 2");
        res.status(201).json({ msg: "Job Not Deleted" });
      }
    }
  }
  if (req.params['type'] === 'acceptJob') {
    try {
      const data = await mysq.acceptJob(req.body.cemail, req.body.ttl, req.body.uemail);
      res.status(201).json({ msg: "Accepted ✔" });
    } catch (error) {
      res.status(201).json({ msg: "Cannot Acept Now Try Again Some Time " });
    }
  }
  if (req.params['type'] === 'recievedjob') {
    console.time("incoming req for recv job usr");
    try {
      let data = await mysq.recievedjob(JSON.parse(req.session.userData));
      res.status(201).json(data);
    } catch (error) {
      res.status(201).json({ msg: "Got Some Error ☠" });
    }
    console.timeEnd("incoming req for recv job usr");

  }
  if (req.params['type'] === 'setInterview') {
    let cmpn = JSON.parse(req.session.cmpny);
    if (cmpn === undefined) {
      res.status(201).json({ msg: "Login First🤡" });
    }
    else {
      try {
        // console.log(req,req.body);
        const data = await mysq.scheduleInterview(cmpn, req.body);
        res.status(201).json({ msg: "Interview Scheduled!" });
      } catch (error) {
        console.log("err : app>job/scheduleinterview", error);
        res.status(201).json({ err: `Error 🐦:${error.message}` });
      }
    }
  }
  if (req.params['type'] === 'getInterviewDetails') {
    try {
      //  console.log(req.body);
      const interview = await mysq.getInterviewDetails(JSON.parse(req.session.userData), req.body.ttl);
      // console.log(interview);
      res.status(201).json({
        data: interview
      });
    } catch (error) {
      req.status(500).json({
        'msg': 'try again'
      });
      console.log(error);
    }
  }
});

app.post("/upload/:type", async (req, res) => {
  if (req.params["type"] === "resume_profile") {
    const form = new formidable.IncomingForm();
    let userob = JSON.parse(req.session.userData);


    if (!(userob.fname === undefined || userob.phone === undefined)) {
      form.parse(req, async function (err, fields, files) {
        // console.dir(files);

        var oldPathResume = files.resume.filepath;
        var oldPathProfile = files.profilepic.filepath;

        let resume_ext = `.${files.resume.mimetype.split("/")[1]}`;
        let profilepic_ext = `.${files.profilepic.mimetype.split("/")[1]}`;

        if (
          files.resume.mimetype.split("/")[1] ===
          "vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {
          resume_ext = ".docx";
        }

        let resumename =
          "resm_" +
          new Date().getTime().toString() +
          "_" +
          userob.lname +
          "_" +
          userob.phone +
          resume_ext;
        let profilepicname =
          "pp_" +
          new Date().getTime() +
          "_" +
          userob.lname +
          "_" +
          userob.phone +
          profilepic_ext;

        var newResumePath = path.join(
          __dirname,
          "./public/userupload/resume/" + resumename
        );
        var newProfilePath = path.join(
          __dirname,
          "./public/userupload/pp/" + profilepicname
        );

        let rawresume = fs.readFileSync(oldPathResume);
        let rawProfile = fs.readFileSync(oldPathProfile);

        let allgood = true;

        let updatedb = await mysq.updateResumeProfilePath(
          userob,
          "./public/userupload/resume/" + resumename,
          "./public/userupload/pp/" + profilepicname
        );

        if (!updatedb[0]) {
          allgood = false;
        } else {
          fs.writeFileSync(newResumePath, rawresume, function (err) {
            if (err) allgood = false;
          });

          fs.writeFileSync(newProfilePath, rawProfile, function (err) {
            if (err) allgood = false;
          });
        }
        if (allgood) {
          userob.resume = newResumePath;
          userob.profile = newProfilePath;

          req.session.usrresume = "./public/userupload/resume/" + resumename;
          req.session.save();

          req.session.userprofile = "./public/userupload/pp/" + profilepicname;
          req.session.save();

          res.status(200).render("templates/userprofile_uploaderesume.ejs", {
            data: { msg: "Successfully Uploaded" },
          });
        } else {
          res.status(200).render("templates/userprofile_uploaderesume.ejs", {
            data: { msg: "Error in uploading" },
          });
        }
      });
    } else {
      res.status(200).render("templates/userprofile_uploaderesume.ejs", {
        data: { msg: "You Have To Login First" },
      });
    }
  }
  if (req.params["type"] === "cpupdatemedia") {
    let cmpny = JSON.parse(req.session.cmpny);
    // console.log(cmpny);
    if (cmpny.cpname === undefined || cmpny.cpphone === undefined) {
      res.send("login first");
    } else {
      const form = new formidable.IncomingForm();
      form.parse(req, async function (err, fields, files) {
        //  console.dir(files);

        var oldPathProfile = files.profilepic.filepath;

        let profilepic_ext = `.${files.profilepic.mimetype.split("/")[1]}`;
        let profilepicname =
          "pp_" +
          new Date().getTime() +
          "_" +
          cmpny.cpname +
          "_" +
          cmpny.cpphone +
          profilepic_ext;

        var newProfilePath = path.join(
          __dirname,
          "./public/cpupload/pp/" + profilepicname
        );

        let rawProfile = fs.readFileSync(oldPathProfile);

        let allgood = true;

        let updatedb = await media.updateCPProfilePath(
          cmpny,
          "./public/cpupload/pp/" + profilepicname
        );

        if (!updatedb[0]) {
          allgood = false;
        } else {
          fs.writeFileSync(newProfilePath, rawProfile, function (err) {
            if (err) allgood = false;
          });
        }
        if (allgood) {
          cmpny.cpprofile = newProfilePath;

          req.session.cpprf = "./public/userupload/resume/" + profilepicname;
          req.session.save();

          res.status(200).render("templates/cpprofile_uploadmedia.ejs", {
            data: { msg: "Successfully Uploaded" },
          });
        } else {
          res.status(200).render("templates/cpprofile_uploadmedia.ejs", {
            data: { msg: "Error in uploading" },
          });
        }
      });
    }
  }
});




//chatting
app.get("/chat/:id", async (req, res) => {
  let datax = JSON.parse(req.session.userData);
  let tos = {};
  let to = await chat.getTos(datax.email);
  to = to[1];
  //    console.log(to);
  res.render("chats.ejs", { data: datax });
});

app.post("/chat/:bhot", async (req, res) => {
  let user = JSON.parse(req.session.userData);
  // console.log(user);
  if (req.params["bhot"] === "sendMsg") {
    let bod = req.body;
    try {
      const result = await chat.insertChat(user.email, bod.to, bod.msg);
      res.status(201).json({ res: "Msg Sended!", ack: true });
    } catch (error) {
      res.status(201).json({ res: "Cannot Send Msg Right now!", ack: false });
    }
  }
  if (req.params["bhot"] === "getTos") {
    try {
      let user = JSON.parse(req.session.userData);
      const tos = await chat.getTos(user.email);
      //  console.log(tos);
      res.status(201).json(tos[1]);
    } catch (error) {
      res.status(201).send(error[1]);
    }
  }
  if (req.params["bhot"] === "getMsgs") {
    try {
      let user = JSON.parse(req.session.userData);
      let to = req.body.to;
      const msgs = await chat.getChats(user.email, to);
      res.status(201).json(msgs[1]);
    } catch (error) {
      res.status(201).send(msgs[1]);
    }
  }
});

app.get("/cpchat/:id", async (req, res) => {
  let datax = JSON.parse(req.session.cmpny);
  let tos = {};
  // let to = await chat.getTos(datax.cpemail);
  // console.log(to);

  // to = to[1];
  //  console.log("noob",to);
  res.render("cpchats.ejs", { data: datax });
});

app.post("/cpchat/:bhot", async (req, res) => {
  let user = JSON.parse(req.session.cmpny);
  // console.log(user);
  if (req.params["bhot"] === "sendMsg") {
    let bod = req.body;
    try {
      const result = await chat.insertChat(user.cpemail, bod.to, bod.msg);
      res.status(201).json({ res: "Msg Sended!", ack: true });
    } catch (error) {
      res.status(201).json({ res: "Cannot Send Msg Right now!", ack: false });
    }
  }
  if (req.params["bhot"] === "getTos") {
    try {
      let user = JSON.parse(req.session.cmpny);
      const tos = await chat.getTos(user.cpemail);
      //  console.log("noob",tos);
      res.status(201).json(tos[1]);
    } catch (error) {
      res.status(201).send(error[1]);
    }
  }
  if (req.params["bhot"] === "getMsgs") {
    try {
      let user = JSON.parse(req.session.cmpny);
      let to = req.body.to;
      const msgs = await chat.getChats(user.cpemail, to);
      res.status(201).json(msgs[1]);
    } catch (error) {
      res.status(201).send(msgs[1]);
    }
  }
});

app.post("/api/:what", async (req, res) => {
  if (req.params['what'] === "uregister") {
    let obj = {};
    obj.fname = req.body.regfname;
    obj.lname = req.body.reglname;
    obj.email = req.body.regemail;
    obj.phone = req.body.regphone;
    obj.active = true;
    obj.password = req.body.regpass;
    obj.profile = "./static/img/userprofile.webp";

    //  console.log(obj);

    const resx = await auth.checkUser(obj.email);

    if (resx[0]) {
      //user exist
      const resp = {};
      resp.exist = "Can not Create Accout User Alredy Exist!";
      res.status(200).json(resx);
    } else {
      const insrtflag = await mysq.insertRec(obj);
      console.log(insrtflag);
      req.session.userDatareg = obj;
      req.session.save();
      res.status(200).json(obj);
    }
  }
  if (req.params['what'] === 'cpregister') {
    try {
      const exist = await auth.checkCompany(req.body.cpemail);
      // console.log(exist,req.body.cpemail);
      if (exist[0]) {
        let datax = {};
        datax.err = "Company Already Registered!";
        res.status(201).json(exist[0]);
      } else {
        const rs = await mysq.registerCompany(req.body);
        if (rs[0]) {
          req.session.cmpny = JSON.stringify(req.body);
          req.session.save();
          res.status(201).json(req.session.cmpny);
        } else {
          res.status(500).end("We are Facing Some Issue");
        }
      }
    } catch (e) {
      res.status(500).end("We are Facing Some Issue");
      console.log(e);
    }
  }
  if (req.params['what'] === 'accept') {
    try {
      const us = await auth.getUserx(
        req.body["sign-email"],
        req.body["sign-pass"]
      );
      const cp = await auth.getCompany(
        req.body["sign-email"],
        req.body["sign-pass"]
      );

      //console.log(us);
      // console.log(cp);

      if (us[0] !== undefined) {
        console.log("user");
        let o = us[0];
        // console.log(o);
        let obj = {};
        obj.fname = o.firstname;
        obj.lname = o.lastname;
        obj.email = o.email;
        obj.phone = o.phone;
        obj.password = o.password;

        let omedia;
        try {
          omedia = await mysq.getUserMedia(obj.email, obj.password);
          obj.resume = omedia[1].resume;
          obj.profile = omedia[1].profile;
        } catch (err) {
          console.log(err);
          obj.resume = "";
          obj.profile = "./static/img/userprofile.webp";
        }
        //    console.log(obj);
        // req.session.userData = JSON.stringify(obj);
        // req.session.save();
        res.status(201).json(obj);
      }
      else if (cp[1][0] !== undefined) {
        console.log("company");
        cp[1] = cp[1][0];
        let obj = {};
        obj.cpfname = cp[1].fname;
        obj.cplname = cp[1].lname;
        obj.cpname = cp[1].name;
        obj.cpurl = cp[1].url;
        obj.cpaddr = cp[1].addr;
        obj.cpsize = cp[1].size;
        obj.cpemail = cp[1].email;
        obj.cpphone = cp[1].phone;
        obj.cppass = cp[1].pass;
        obj.cpactive = cp[1].active;
        obj.cpjobs = cp[1].jobs;
        obj.cpcanjobs = cp[1].canjobs;
        obj.cpreview = cp[1].review;

        const prof = await media.getCompanyMedia(obj.cpemail, obj.cppass);

        if (prof[1][0] === undefined) {
          obj.profile = "./static/img/userprofile.jpg";
        } else {
          obj.profile = prof[1][0].profile;
        }
        // req.session.cmpny = JSON.stringify(obj);
        // req.session.save();

        res.status(201).json(obj);
      } else {
        res
          .status(200)
          .json({ msg: 'Invalid Id Pass 🐦' });
      }
    } catch (e) {
      console.log(e);
    }
  }
  if (req.params['what'] === 'getAllJobs') {
    const data = await mysq.getAllJobs();
    //console.log(data);
    res.status(200).json(data);
  }
  if (req.params['what'] === 'applyJob') {
    try {


      let jobseeker = await auth.getUserx(
        req.body.uemail,
        req.body.upass
      );

      jobseeker = jobseeker[0];
      //  console.log(jobseeker,req.body);



      let jobseekernew = {};
      jobseekernew.fname = jobseeker.firstname;
      jobseekernew.lname = jobseeker.lastname;
      jobseekernew.email = jobseeker.email;
      jobseekernew.phone = jobseeker.phone;
      jobseekernew.password = jobseeker.password;

      let omedia;
      try {
        omedia = await mysq.getUserMedia(jobseekernew.email, jobseekernew.password);
        jobseekernew.resume = omedia[1].resume;
        jobseekernew.profile = omedia[1].profile;
      } catch (err) {
        console.log(err);
        jobseekernew.resume = "";
        jobseekernew.profile = "./static/img/userprofile.webp";
      }


      const validjob = await mysq.checkJobForUser(req.body, jobseekernew);
      if (validjob[0]) {
        res.status(201).json({ msg: "Already Applied" });
      } else {
        const resx = await mysq.applyjob(req.body, jobseekernew, req.body.datetime);
        res.status(201).json({
          msg: `"Applied Successfully! You Will Reciev Mail From : ${req.body.pjemail}"`,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
  if (req.params['what'] === 'getAppliedJob') {
    // console.log(req.body);
    let jobseeker = await auth.getUserx(
      req.body.uemail,
      req.body.upass
    );

    jobseeker = jobseeker[0];

    let jobseekernew = {};
    jobseekernew.fname = jobseeker.firstname;
    jobseekernew.lname = jobseeker.lastname;
    jobseekernew.email = jobseeker.email;
    jobseekernew.phone = jobseeker.phone;
    jobseekernew.password = jobseeker.password;

    let omedia;
    try {
      omedia = await mysq.getUserMedia(jobseekernew.email, jobseekernew.password);
      jobseekernew.resume = omedia[1].resume;
      jobseekernew.profile = omedia[1].profile;
    } catch (err) {
      console.log(err);
      jobseekernew.resume = "";
      jobseekernew.profile = "./static/img/userprofile.webp";
    }

    const result = await mysq.checkAllAppliedJobForUser(jobseekernew);
    //   console.log(result);
    res.status(201).send(result[1]);
  }
  if (req.params['what'] === 'deleteJobUser') {
    if (req.body === undefined) {
      res.status(201).json({ msg: "Job Not Deleted" });
      console.log("req body part");
    } else {

      let jobseeker = await auth.getUserx(
        req.body.uemail,
        req.body.upass
      );

      jobseeker = jobseeker[0];

      let jobseekernew = {};
      jobseekernew.fname = jobseeker.firstname;
      jobseekernew.lname = jobseeker.lastname;
      jobseekernew.email = jobseeker.email;
      jobseekernew.phone = jobseeker.phone;
      jobseekernew.password = jobseeker.password;

      let omedia;
      try {
        omedia = await mysq.getUserMedia(jobseekernew.email, jobseekernew.password);
        jobseekernew.resume = omedia[1].resume;
        jobseekernew.profile = omedia[1].profile;
      } catch (err) {
        console.log(err);
        jobseekernew.resume = "";
        jobseekernew.profile = "./static/img/userprofile.webp";
      }

      const resx = await mysq.deleteJobUser(
        req.body,
        jobseekernew
      );
      if (resx[0]) {
        res.status(201).json({ msg: "Job Removed(☞ﾟヮﾟ)☞!" });
        console.log("else 1");
      } else {
        console.log("else 2");
        res.status(201).json({ msg: "Job Not Deleted" });
      }
    }
  }
  if (req.params['what'] === 'receivedJobUser') {
    try {

      let jobseeker = await auth.getUserx(
        req.body.uemail,
        req.body.upass
      );

      jobseeker = jobseeker[0];

      let jobseekernew = {};
      jobseekernew.fname = jobseeker.firstname;
      jobseekernew.lname = jobseeker.lastname;
      jobseekernew.email = jobseeker.email;
      jobseekernew.phone = jobseeker.phone;
      jobseekernew.password = jobseeker.password;

      let omedia;
      try {
        omedia = await mysq.getUserMedia(jobseekernew.email, jobseekernew.password);
        jobseekernew.resume = omedia[1].resume;
        jobseekernew.profile = omedia[1].profile;
      } catch (err) {
        console.log(err);
        jobseekernew.resume = "";
        jobseekernew.profile = "./static/img/userprofile.webp";
      }


      let data = await mysq.recievedjob(jobseekernew);
      res.status(201).json(data);
    } catch (error) {
      res.status(201).json({ msg: "Got Some Error ☠", error: error.message });
    }
  }
  if (req.params['what'] === 'getPostedJobs') {
    //  console.log(req.body);
    const cp = await auth.getCompany(
      req.body.cpemail,
      req.body.cppass
    );

    let obj = {};

    cp[1] = cp[1][0];
    if (cp[1] === undefined) {
    }
    else {
      obj.cpfname = cp[1].fname;
      obj.cplname = cp[1].lname;
      obj.cpname = cp[1].name;
      obj.cpurl = cp[1].url;
      obj.cpaddr = cp[1].addr;
      obj.cpsize = cp[1].size;
      obj.cpemail = cp[1].email;
      obj.cpphone = cp[1].phone;
      obj.cppass = cp[1].pass;
      obj.cpactive = cp[1].active;
      obj.cpjobs = cp[1].jobs;
      obj.cpcanjobs = cp[1].canjobs;
      obj.cpreview = cp[1].review;

      const prof = await media.getCompanyMedia(obj.cpemail, obj.cppass);
      if (prof[1][0] === undefined) {
        obj.profile = "./static/img/userprofile.jpg";
      } else {
        obj.profile = prof[1][0].profile;
      }

      const resx = await mysq.getJobs(obj.cpemail);

      res.status(201).json(resx[1]);
    }
  }
  if (req.params['what'] === 'deleteJob') {

    try {
      // console.table(req.body);
      const resx = await mysq.deleteJob(
        req.body.cpemail.replaceAll("'", ""),
        req.body.cpttl.replaceAll("'", ""),
        req.body.cpname
      );
      media.deleteJobMedia(req.body.cpemail.replaceAll("'", ""),
        req.body.cpttl.replaceAll("'", ""),
        req.body.extimg.replaceAll("'", ""));
      res.status(201).json({ msg: resx[1] });

    } catch (error) {
      res.status(201).json({ msg: 'try again later' });
      console.log(error);
    }
  }

  if (req.params['what'] === 'getApplicants') {
    let da = req.body;
    try {
      const data = await mysq.getApplicantDetails(
        da.cpname,
        da.cpttl,
        da.cpemail
      );
      res.status(201).json(data);
    } catch (error) {
      res.status(201).json({
        msg: 'can retrive info 🐦 '
      });
      console.log(error);
    }

  }
  if (req.params['what'] === 'acceptJob') {
    try {
      const data = await mysq.acceptJob(req.body.cemail, req.body.ttl, req.body.uemail);
      res.status(201).json({ msg: "Accepted ✔" });
    } catch (error) {
      res.status(201).json({ msg: "Cannot Acept Now Try Again Some Time " });
    }
  }
  if (req.params['what'] === 'setInterview') {
    console.table(req.body);
    let cmpn = {};
    cmpn.cpemail = req.body.cpemail;
    cmpn.cpphone = req.body.cpphone;

    if (cmpn === undefined) {
      res.status(201).json({ msg: "Can Not Set Interview Right Now Try Again Later If Possible 🐦" });
    }
    else {
      try {
        //console.log(req,req.body);
        const data = await mysq.scheduleInterview(cmpn, req.body);
        res.status(201).json({ msg: "Interview Scheduled!" });
      } catch (error) {
        console.log("err : app>job/scheduleinterview", error);
        res.status(201).json({ err: `Error 🐦:${error.message}` });
      }
    }
  }
  if (req.params['what'] === 'getSchedules') {
    try {
      const cp = await auth.getCompany(
        req.body.cpemail,
        req.body.cppass
      );

      let obj = {};

      cp[1] = cp[1][0];
      if (cp[1] === undefined) {
      }
      else {
        obj.cpfname = cp[1].fname;
        obj.cplname = cp[1].lname;
        obj.cpname = cp[1].name;
        obj.cpurl = cp[1].url;
        obj.cpaddr = cp[1].addr;
        obj.cpsize = cp[1].size;
        obj.cpemail = cp[1].email;
        obj.cpphone = cp[1].phone;
        obj.cppass = cp[1].pass;
        obj.cpactive = cp[1].active;
        obj.cpjobs = cp[1].jobs;
        obj.cpcanjobs = cp[1].canjobs;
        obj.cpreview = cp[1].review;

        const prof = await media.getCompanyMedia(obj.cpemail, obj.cppass);
        if (prof[1][0] === undefined) {
          obj.profile = "./static/img/userprofile.jpg";
        } else {
          obj.profile = prof[1][0].profile;
        }
      }
      let applic = await mysq.getSchedules(obj);

      res.status(201).json(applic);
    } catch (error) {
      console.log(error);
      res.status(20).json({
        msg: "Login First! sir🐦"
      });
    }
  }
  if (req.params['what'] === 'deleteSChedule') {
    console.log("req for delete schedule started");
    // console.table(req.body);
    try {
      const result = mysq.deleteSchedule(req.body.jsemail, req.body.ttl, req.body.cpemail, req.body.cpphone);
      res.status(201).json({
        msg: "Schedule Removed!"
      });
      console.log("req for schedule ended");

    } catch (error) {
      res.status(201).json({
        msg: "Not Able To Remove Schedule!"
      });
      console.log(error);
    }
  }
  if (req.params['what'] === 'getInterviewDetails') {
    let jobseeker = await auth.getUserx(
      req.body.jsemail,
      req.body.password
    );

    jobseeker = jobseeker[0];

    let jobseekernew = {};
    jobseekernew.fname = jobseeker.firstname;
    jobseekernew.lname = jobseeker.lastname;
    jobseekernew.email = jobseeker.email;
    jobseekernew.phone = jobseeker.phone;
    jobseekernew.password = jobseeker.password;

    let omedia;
    try {
      omedia = await mysq.getUserMedia(jobseekernew.email, jobseekernew.password);
      jobseekernew.resume = omedia[1].resume;
      jobseekernew.profile = omedia[1].profile;
    } catch (err) {
      console.log(err);
      jobseekernew.resume = "";
      jobseekernew.profile = "./static/img/userprofile.webp";
    }

    //  console.table(jobseekernew);
    try {
      const result = await mysq.getInterviewDetails(jobseekernew, req.body.ttl);
      console.log(result);
      res.status(201).json(result);
    } catch (error) {
      console.log(error);
      res.status(503).json({
        msg: "server error try again"
      });  //503 => service not available
    }

  }
});
app.post("/upload2/:type", async (req, res) => {
  if (req.params["type"] === "resume_profile") {
    const form = new formidable.IncomingForm();

    form.parse(req, async function (err, fields, files) {
      let jobseeker = await auth.getUserx(
        fields.email,
        fields.pass
      );

      jobseeker = jobseeker[0];

      let jobseekernew = {};
      jobseekernew.fname = jobseeker.firstname;
      jobseekernew.lname = jobseeker.lastname;
      jobseekernew.email = jobseeker.email;
      jobseekernew.phone = jobseeker.phone;
      jobseekernew.password = jobseeker.password;

      let omedia;
      try {
        omedia = await mysq.getUserMedia(jobseekernew.email, jobseekernew.password);
        jobseekernew.resume = omedia[1].resume;
        jobseekernew.profile = omedia[1].profile;
      } catch (err) {
        console.log(err);
        jobseekernew.resume = "";
        jobseekernew.profile = "./static/img/userprofile.webp";
      }


      if (!(jobseekernew.fname === undefined || jobseekernew.phone === undefined)) {

        // console.dir(files);

        var oldPathResume = files.resume.filepath;
        var oldPathProfile = files.profilepic.filepath;

        let resume_ext = `.${files.resume.mimetype.split("/")[1]}`;
        let profilepic_ext = `.${files.profilepic.mimetype.split("/")[1]}`;

        if (
          files.resume.mimetype.split("/")[1] ===
          "vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {
          resume_ext = ".docx";
        }

        let resumename =
          "resm_" +
          new Date().getTime().toString() +
          "_" +
          jobseekernew.lname +
          "_" +
          jobseekernew.phone +
          resume_ext;
        let profilepicname =
          "pp_" +
          new Date().getTime() +
          "_" +
          jobseekernew.lname +
          "_" +
          jobseekernew.phone +
          profilepic_ext;

        var newResumePath = path.join(
          __dirname,
          "./public/userupload/resume/" + resumename
        );
        var newProfilePath = path.join(
          __dirname,
          "./public/userupload/pp/" + profilepicname
        );

        let rawresume = fs.readFileSync(oldPathResume);
        let rawProfile = fs.readFileSync(oldPathProfile);

        let allgood = true;

        let updatedb = await mysq.updateResumeProfilePath(
          jobseekernew,
          "./public/userupload/resume/" + resumename,
          "./public/userupload/pp/" + profilepicname
        );

        if (!updatedb[0]) {
          allgood = false;
        } else {
          fs.writeFileSync(newResumePath, rawresume, function (err) {
            if (err) allgood = false;
          });

          fs.writeFileSync(newProfilePath, rawProfile, function (err) {
            if (err) allgood = false;
          });
        }
        if (allgood) {
          jobseekernew.resume = newResumePath;
          jobseekernew.profile = newProfilePath;

          req.session.usrresume = "./public/userupload/resume/" + resumename;
          req.session.save();

          req.session.userprofile = "./public/userupload/pp/" + profilepicname;
          req.session.save();

          res.status(200).render("templates/userprofile_uploaderesume.ejs", {
            data: { msg: "Successfully Uploaded" },
          });
        } else {
          res.status(200).render("templates/userprofile_uploaderesume.ejs", {
            data: { msg: "Error in uploading" },
          });
        }

      } else {
        res.status(200).render("templates/userprofile_uploaderesume.ejs", {
          data: { msg: "You Have To Login First" },
        });

      }
    });

  }
  if (req.params["type"] === "cpupdatemedia") {

    // console.log(cmpny);

    const form = new formidable.IncomingForm();
    form.parse(req, async function (err, fields, files) {
      let cmpny = await auth.getCompany(fields.cpemail, fields.cppass);
      cmpny = cmpny[1][0];
      //  console.dir(fields,files);
      // console.dir(cp);
      if (cmpny.fname === undefined) {

        res.status(201).send("<h1>Server Error Try again.</h1>");
      }
      else {

        var oldPathProfile = files.profilepic.filepath;

        let profilepic_ext = `.${files.profilepic.mimetype.split("/")[1]}`;
        let profilepicname =
          "pp_" +
          new Date().getTime() +
          "_" +
          cmpny.name +
          "_" +
          cmpny.phone +
          profilepic_ext;

        var newProfilePath = path.join(
          __dirname,
          "./public/cpupload/pp/" + profilepicname
        );

        let rawProfile = fs.readFileSync(oldPathProfile);

        let allgood = true;

        let updatedb = await media.updateCPProfilePath(
          cmpny,
          "./public/cpupload/pp/" + profilepicname
        );

        if (!updatedb[0]) {
          allgood = false;
          // console.log("db not good");
        } else {
          fs.writeFileSync(newProfilePath, rawProfile, function (err) {
            if (err) allgood = false;
          });
        }
        if (allgood) {
          cmpny.cpprofile = newProfilePath;

          req.session.cpprf = "./public/userupload/resume/" + profilepicname;
          req.session.save();

          res.status(200).render("templates/cpprofile_uploadmedia.ejs", {
            data: { msg: "Successfully Uploaded" },
          });
        } else {
          res.status(200).render("templates/cpprofile_uploadmedia.ejs", {
            data: { msg: "Error in uploading" },
          });
        }
      }

    });

  }
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/cpupload/jobmedia')
  },
  filename: function (req, file, cb) {
    let obj = JSON.parse(req.body.data);

    let hs = CryptoJs.SHA1(obj.pjemail + obj.pjttl);
    let hex = hs.toString();
    ext1 = file.originalname.split('.')[1];
    let name = hex + "." + ext1;

    file.originalname = name;
    cb(null, file.originalname)
  }
});
const upload = multer({ storage: storage, limits: { fileSize: 100000000 } });

app.post('/tesxt', upload.fields([{ name: 'file1', maxCount: 1 }, { name: 'file2', maxCount: 1 }]), async function (req, res, next) {

  try {
    let obj2 = JSON.parse(req.body.data);

    const cp = await auth.getCompany(
      obj2['sign-email'],
      obj2['sign-pass']
    );



    let obj = {};

    cp[1] = cp[1][0];
    if (cp[1] === undefined) {
    }
    else {
      obj.cpfname = cp[1].fname;
      obj.cplname = cp[1].lname;
      obj.cpname = cp[1].name;
      obj.cpurl = cp[1].url;
      obj.cpaddr = cp[1].addr;
      obj.cpsize = cp[1].size;
      obj.cpemail = cp[1].email;
      obj.cpphone = cp[1].phone;
      obj.cppass = cp[1].pass;
      obj.cpactive = cp[1].active;
      obj.cpjobs = cp[1].jobs;
      obj.cpcanjobs = cp[1].canjobs;
      obj.cpreview = cp[1].review;

      const prof = await media.getCompanyMedia(obj.cpemail, obj.cppass);
      if (prof[1][0] === undefined) {
        obj.profile = "./static/img/userprofile.jpg";
      } else {
        obj.profile = prof[1][0].profile;
      }



      let hs = CryptoJs.SHA1(obj2.pjemail + obj2.pjttl);
      let hex = hs.toString();

      ext1 = obj2.pjposter.split('.')[1];
      let pjpostername = hex + "." + ext1;
      ext2 = obj2.pjfile.split('.')[1];
      let pjfilename = hex + "." + ext2;

      let pathx = "/public/cpupload/jobmedia/";


      delete obj2['CPNAME'];
      delete obj2['sign-email'];
      delete obj2['sign-pass'];
      delete obj2['pjfile'];
      delete obj2['pjposter'];

      const result = await mysq.insertJob(obj, obj2, pathx + pjpostername, pathx + pjfilename, Date.now());

      obj2.pjposter = pathx + pjpostername;
      obj2.pjfile = pathx + pjfilename;

      res.status(201).json({
        msg: 'Job Posted!✔',
        data: obj2
      });
    }
  } catch (error) {
    console.log(error);
    res.status(201).json({ msg: "Job Not Posted." });
  }
});


const fileserver = express();
fileserver.use("/public", express.static(path.join(__dirname, "/public")));
fileserver.listen(80, () => {
  console.log(`file server started at : http://${host}:${80}`);
});

app.listen(port, () => {
  console.log(`server started at : http://${host}:${port}`);
});
