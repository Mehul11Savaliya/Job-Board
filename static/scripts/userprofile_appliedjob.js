// let appliedjobs
const getj = () => {
  fetch("/job/getAppliedJobs").then(res => { return res.json() }).then(val => {
 
    updateAppliedJob(val);
  })
}

getj();

const generateModel = (email, ttl) => {
  let modal = document.getElementById("sendMail");
  let html = modal.innerHTML;
  // #subject
  // #recp
  html = html.replaceAll("#subject", `About ${ttl} Application`);
  html = html.replace("#recp", email);
  modal.innerHTML = html;
  // alert(html);
}

const updateAppliedJob = (obj) => {
  for (const item of obj) {
    let card = document.createElement("div");
    card.setAttribute("class", "shadow card text-center my-2");
    card.innerHTML = `
        <div class="card-header">
                              <ul class="nav nav-pills card-header-pills">
                                <li class="nav-item">
                                  <button class="btn btn-outline-danger" onclick="handleAppldJobEvent('remove','${item.cpname}','${item.cpemail}','${item.jobttl}',event)">Remove</button>
                                </li>
                                <li class="nav-item">
                                  <button class="btn btn-outline-warning mx-2" >Request Review</button>
                                </li>
                                <li class="nav-item btn btn-info"><b>${item.cpname}</b></li>
                               <!-- <li class="nav-item">
                                  <button class="btn btn-outline-success" onclick="generateModel('${item.details.pjemail}','${item.jobttl}')" data-bs-toggle="modal" data-bs-target="#sendMail" data-bs-whatever="@getbootstrap">Send Mail</button>
                                </li> -->
                              </ul>
                            </div>
                            <div class="card-body">
                              <h5 class="card-title">${item.jobttl}</h5>
                              <p class="card-text">${item.details.pjdisc.replaceAll("\n","<br>")}</p>
                              <h5 class="card-title">Contacts</h5>
                              <p class="card-text">${item.details.pjemail}</p>
                              <h5 class="card-title">Salary</h5>
                              <p class="card-text">${item.details.pjsalary}</p>
                              <!-- <a href="#" onclick="sendMessage('${item.details.pjemail}')" class="btn btn-primary">Message!</a>-->
                              <button type="button" class="btn btn-primary" onclick="preparemodal('${item.details.pjemail}')" >Send Message</button> <a href="${item.details.pjurl}" class="btn btn-primary">Vist Website</a>
                            </div>`;

    //document.getElementsByClassName("jobcards")[0].innerHTML="";
    document.getElementsByClassName("jobcards")[0].appendChild(card);
  }
}

const handleAppldJobEvent = (type, cpny, email, ttl, evt) => {
  //  console.log(type,cpny,email,ttl,evt.target);
  if (type === 'remove') {
    let obj = {
      cpname: cpny,
      cpemail: email,
      jobttl: ttl
    }
    handlereq(type, obj).then(data=>{
      //console.log(data);
      if(data){
      let jobc = document.getElementsByClassName("jobcards")[0];
      jobc.removeChild(evt.target.parentNode.parentNode.parentNode.parentNode);
      }
    })
  }
}


const handlereq = async (type, obj) => {
  return new Promise((res, rej) => {
    if (type === 'remove') {
      fetch("/job/deleteJobUser", {
        method: "post",
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify(obj)
      }).then(resp => { return resp.json() }).then(data => {
        if (data.msg === 'Job Not Deleted') {
          alert(data.msg);
          res(false);
        }
        else {
          alert(data.msg);
          res(true);
        }
      });
    }
  });
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
  })

  let sendmsgbtn = document.getElementById("sndmsgbtn");
  sendmsgbtn.addEventListener('click',(evt)=>{
        fetch("/chat/sendMsg",{
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