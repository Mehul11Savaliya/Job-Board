
const fetJobs = async () => {
  fetch("/getJobs", {
    method: "post",
    headers: {
      'Accept': 'application/json',
      "Content-type": "application/json; charset=UTF-8"
    },
    body: JSON.stringify({ 'email': `'${document.getElementById("CPNAME").value}'` })
  }).then((res) => {
    return res.json()
  }).then((data) => {
   
    for (let obj of data) {
      obj = JSON.stringify(obj);
        obj = obj.replaceAll('\n','\\n');
        obj = obj.replaceAll('\r','');
        obj = JSON.parse(obj);
      if (obj.pjttl === undefined) continue;
      else updateJobs(obj)
    }
  })
}

const getApplicant = async (jbttl, jbemail,event) => {
 let dtailbtn = event.target;

 if(dtailbtn.classList.contains('btn-outline-info')){
  dtailbtn.classList.toggle('btn-outline-danger');
  dtailbtn.innerHTML="Close";
  fetch("/job/getApplicants", {
    method: "post",
    headers: {
      'Accept': 'application/json',
      'Content-type': 'application/json; charset=UTF-8'
    },
    body: JSON.stringify({
      jbttl: jbttl,
      jbemail: jbemail
    })
  }).then(res => {
    //
    return res.json()
  }).then(val => {
    // console.log(val);
    generateUserCards(val.application, jbttl);
  })
  dtailbtn.classList.remove('btn-outline-info');
  
 }
 else{
  dtailbtn.classList.toggle('btn-outline-info');
  dtailbtn.innerHTML="Details";
  let dv = "requested" + jbttl.split(" ").join("-") + "";
  dv = document.querySelector(`#${dv}`);//.appendChild(profile);
   dv.innerHTML="";
  dtailbtn.classList.remove('btn-outline-danger');
  
 }
}

(async function () {
  await fetJobs();
})()

const updateJobs = (obj) => {

  let job = document.createElement("div");
  job.setAttribute("class", "job card mb-3 my-3");
  job.setAttribute("style", "max-width: 95vw;");
  job.setAttribute("data-email", obj.pjemail);
  job.setAttribute("data-ttl", obj.pjttl);

  job.innerHTML = `
    <div class="row g-0">
        <div class="col-md-4">
          <img  src='${obj.pjfile}' loading='lazy' onerror='this.src="/static/img/download.jfif"' class="img-fluid rounded-start" alt="...">
        </div>
        <div class="col-md-8">
          <div class="card-body d-flex">
            <div class="content">
              <h5 class="card-title">${obj.pjttl}</h5>
              <p class="card-text"><b>JOB Discription : </b>${obj.pjdisc}</p>
              <p class="card-text"><b>Email : </b>${obj.pjemail}</p>
              <p class="card-text"><b>For : </b>${obj.gender}</p>
              <p class="card-text"><b>Salary : </b>${obj.pjsalary}</p>
              <p class="card-text"><small class="text-muted">${new Date(Number.parseInt(obj.datetime)).toString()}</small></p>

            </div>
            <div class="vr"></div>
            <div class="content">
              <p class="card-text"><b>Img File</b>
                <a href="${obj.pjfile}" class="btn mx-2 btn-outline-success">See</a>
              </p>
              <p class="card-text"><b>Discription File</b>
                <a href="${obj.pjposter}" class="btn mx-2 btn-outline-success">See</a>
              </p>
              <span><button class="btn btn-outline-info" onclick="getApplicant('${obj.pjttl}','${obj.pjemail}',event)">Details</button></span>
              
            </div>
          </div>
            
        </div>
        <div id="requested${obj.pjttl.split(" ").join("-")}" style="display: flex; flex-wrap: wrap; flex-direction: row; max-height: 95vh; overflow-y: scroll;"></div>
      </div>
    `;
  document.getElementsByClassName("jobs")[0].appendChild(job);

}

const generateUserCards = (data, jbttl) => {
  let dv = "requested" + jbttl.split(" ").join("-") + "";
  dv = document.querySelector(`#${dv}`);//.appendChild(profile);
   dv.innerHTML="";
   
  for (const obj of data) {
    let profile = document.createElement('div');
    profile.setAttribute("class", "m-2");
    profile.innerHTML = `
    <div class="card" style="width: 20rem;">
  <img  src="${obj.profile.replace('.',"")}" onerror="this.src='/static/img/userprofile.webp'" class="card-img-top" alt="...">
  <div class="card-body">
    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
    <ul class="list-group list-group-flush">
    <li class="list-group-item"><b>${obj.fname +" "+obj.lname}</b></li>
    <li class="list-group-item"><b>Email : </b>${obj.email}</li>
    <li class="list-group-item"><b>Phone : </b>${obj.phone}</li>
    <li class="list-group-item"><b>Resume : </b><a class='btn btn-outline-info' target='_blank' href='${obj.resume.replace(".","")}'>Download</a></li>
  </ul>
  <div class="card-footer">
  <a href="#" onclick="preparemodal('${obj.email}')" class="btn btn-info card-link">Message</a>
  <a href="#" class="btn btn-success card-link">Accept</a>
  </div>

    </div>
</div>
    `;
    dv.appendChild(profile);
  }
}


const preparemodal = (email)=>{
  let to = email;
  let msg = document.getElementById('msgdt');
  let msgdt;
 
  let recp = document.getElementById("recipient-name");
  recp.value=email;
  document.getElementById("sendMessage").classList.add("show");
  document.getElementById("sendMessage").setAttribute("style","display:block");
     
  msg.addEventListener('input',(evt)=>{
    msgdt = evt.target.value;
  });

  let sendmsgbtn = document.getElementById("sndmsgbtn");
  sendmsgbtn.addEventListener('click',(evt)=>{
        fetch("/cpchat/sendMsg",{
          method:"post",
          headers:{
            'content-type': 'application/json'
          },
          body:JSON.stringify({
            to:email,
            msg:msgdt
          })
        }).then(res=>{
          return res.json();
        }).then(val=>{
          alert(val.res);
          msg.value='';
          recp.value='';
          closemodal();
        });
  });
}

const closemodal = ()=>{
  document.getElementById("sendMessage").classList.remove("show");
  document.getElementById("sendMessage").setAttribute("style","display:none");
  
}
