let dialog = document.querySelector("#noob");
let viewscheduleevent = (id)=>{
    
    dialog.setAttribute("open","");
}

let closescheduleevent = (id)=>{
    dialog.removeAttribute("open");
}

let viewSchedule=(event,id,cpemail,cpphone,email,ttl) =>{
    let viewbtn = event.target;
    if(viewbtn.classList.contains('btn-outline-primary')){
        viewbtn.classList.toggle('btn-outline-danger');
        viewbtn.innerHTML="Close";
        viewbtn.classList.remove('btn-outline-primary');
        let obj = JSON.parse(viewbtn.getAttribute("data-schedule"));
       
       
        dialog.innerHTML =` <div>
        <div>
        <div>Title : ${obj.ttl}</div>
        <div>Image : <img src="${obj.profile.replace('.','')}" style="height:100px;width:100px;" alt="" /> </div>
        <div>Name :${obj.firstname+" "+obj.lastname} </div>
        <div>Email :${obj.email} </div>
        <div>Phone : ${obj.phone}</div>
        <div>Resume : <a href="${obj.resume.replace('.','')}">View</a> </div>
        </div>
        <div>
        <div>Hr Name : ${obj.hr}</div>
        <div>Hr Email : ${obj['hr-email']}</div>
        <div>HR Phone : ${obj['hr-phone']}</div>
        </div>
        <div>
        <div>Date : ${obj.date}</div>
        <div>Time : ${obj.time}</div>
        <div>Require Docs : ${obj.req_doc}</div>

        </div>
    </div>` ;
            dialog.setAttribute("open","");
       }
       else{
        viewbtn.classList.toggle('btn-outline-primary');
        viewbtn.innerHTML="View";
        viewbtn.classList.remove('btn-outline-danger');
        dialog.innerHTML = "";
        dialog.removeAttribute("open");
        
       }
}

let prepareDialog = (data)=>{
  document.querySelector("#noob").innerHTML = data;
}