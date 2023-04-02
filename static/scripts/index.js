
let data;
fetch("/getalljobs",{
  method:"post",
  headers:{
    'Accept': 'application/json',
    'Content-type': "application/json; charset=UTF-8"
  }
}).then(res=>{
  return res.json();
}).then(val=>{
  data = val;
  for(let x of val){
    console.table(x);
    updateJobBoard(x);
  }
})
const updateJobBoard = (data) =>{
let dv = document.createElement("div");
dv.setAttribute("data-email",`${data.pjemail}`);
dv.setAttribute("data-ttl",`${data.pjttl}`);
dv.setAttribute("class","job");
dv.setAttribute("onclick",`handleCclickEvt('${data.pjemail}','${data.pjttl}')`);
dv.innerHTML=`
<div class="card mb-3" style="max-width: 540px;">
    <div  class="row g-0">
      <div class="col-md-4">
        <img src='${data.pjfile}'  onerror='this.src="/static/img/download.jfif"' class="img-fluid rounded-start" alt="...">
      </div>
      <div class="col-md-8">
        <div class="card-body">
          <h5 class="card-title">${data.pjcpname}</h5>
          <h5 class="card-title">${data.pjttl}</h5>
          <p class="card-text">${data.pjdisc.replaceAll("\\n","\n")}</p>
          <p class="card-text"><small class="text-muted">${new Date(Number.parseInt(data.datetime)).toString()}</small></p>
        </div>
      </div>
    </div>
  </div>  
`;
document.getElementsByClassName("jobholder")[0].appendChild(dv);}
//  document.querySelectorAll(`[data-email="${data.pjemail}"][data-ttl="${data.pjttl}"]`)[0].addEventListener("click",(evt)=>{
//     handleEvt(evt);
//  })
//  }

const handleCclickEvt = (a,b)=>{
   for(let tmp of data){
   
    if(tmp.pjemail===a&&tmp.pjttl===b){
      document.getElementsByClassName("job-content")[0].innerHTML="";
      document.getElementsByClassName("job-content")[0].innerHTML=`<table class="table">
<thead>
<tr>
  <th scope="col">#</th>
  <th scope="col">Title</th>
  <th scope="col">Value</th>
</tr>
</thead>
<tbody>
<tr>
  <th scope="row">1</th>
  <td>Company Name</td>
  <td>${tmp.pjcpname}</td>
</tr>
<tr>
  <th scope="row">2</th>
  <td>Job Position</td>
  <td>${tmp.pjttl}</td>
</tr>
<tr>
  <th scope="row">3</th>
  <td>Salary</td>
  <td>${tmp.pjsalary}</td>
</tr>
<tr>
  <th scope="row">4</th>
  <td>Who can Apply</td>
  <td>${tmp.gender}</td>
</tr><tr>
  <th scope="row">5</th>
  <td>Job Discription</td>
  <td>${tmp.pjdisc}</td>
</tr>
<tr>
  <th scope="row">6</th>
  <td>Job Discription File</td>
  <td><a class="btn btn-outline-success" href='${tmp.pjposter}'>Discription</a></td>
</tr>
</tbody>
</table>`;
      
    }
  }

}