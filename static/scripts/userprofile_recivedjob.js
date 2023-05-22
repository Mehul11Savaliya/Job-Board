const fetJob = ()=>{
    fetch("/job/recievedjob",{
        method:'post',
        headers:{
            'content-type':'application/json'
        }
    }).then((res)=>{return res.json()}).then((data)=>{
        let i =1;
       for(let item of data) {
         let tr = document.createElement('tr');
         tr.innerHTML=`<th scope="row">${i}</th>
         <td>${item.pjcpname}</td>
         <td>${item.pjemail}</td>
         <td>${"not implemented"}</td>
         <td>${item.pjttl}</td>
         <td>${item.pjurl}</td>
         <td><button class='btn btn-info' onclick='showSchedule("${item.pjttl}",event)'>VIEW</button></td>
         `;
         i++;
         document.getElementById('recievedjob').appendChild(tr);
       }
       
    })
}

function showSchedule(data,event){
    let meta = {
        method:'post',
        headers:{
            'content-type':'application/json'
        }
        ,
        body:JSON.stringify({
            ttl:data
        })
    };

    fetch("/job/getInterviewDetails",meta).then((res)=>{
            return res.json();
    }).then(val=>{
        let dialog = document.getElementById("noob");
         let viewbtn = event.target;
    if(viewbtn.classList.contains('btn-outline-primary')){
        viewbtn.classList.toggle('btn-outline-danger');
        viewbtn.innerHTML="Close";
        viewbtn.classList.remove('btn-outline-primary');
        let obj = val.data;       
      
        dialog.innerHTML =` <div>
        <div>
        <div>Title : ${obj.ttl}</div>
        <div>Comapny Email :${obj.cpemail} </div>
        </div>
        <div>
        <div>Hr Name : ${obj.hr}</div>
        <div>Hr Email : ${obj['hr_email']}</div>
        <div>HR Phone : ${obj['hr_phone']}</div>
        </div>
        <div>
        <div>Date : ${obj.date}</div>
        <div>Time : ${obj.time}</div>
        <div>Extra Details : ${obj.extradetails}</div>
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
    });
}

fetJob();