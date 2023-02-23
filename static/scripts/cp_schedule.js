let applidta = document.getElementById('applidta');
let datas = JSON.parse(document.getElementById('applidta').value).application;
let i =1;
let model = document.getElementById('schedule_interview_model');

const closeModel = ()=>{
  model.classList.add('modal');
  model.classList.add('fade');
  model.style="display : none;";
  let forr = document.getElementById('headmsg');
  forr.innerText="Schedule For : ";
}

function postInterview(event){
 event.preventDefault();
 const formdata = new FormData(event.target);
  for(let item of formdata.entries()) {
    console.log(item);
  }
  
}

const updaterow = (obj)=>{
let tr = document.createElement('tr');
tr.innerHTML=`<th scope="row">${i++}  <img src="${obj.profile.replace(".","")}"  onerror="this.src='/static/img/userprofile.webp'"  alt="ProfileImage" width="30" height="24"
class="d-inline-block align-text-top"></th>
<td>${obj.fname}</td>
<td>${obj.lname}</td>
<td>${'address remaining'}</td>
<td>${obj.email}</td>
<td>${obj.phone}</td>
<td><a href="${obj.resume.replace(".","")}">Link</a></td>
<td><button class="btn btn-success" onclick='setInterView(${JSON.stringify(obj)})'>Schedule</button></td>
`;

document.getElementById('applidtaxx').appendChild(tr);
}

for(let item of datas) {
  updaterow(item);
}

const setInterView = (obj)=>{
    prepareModel(obj);
}


const prepareModel = (obj)=>{
let forr = document.getElementById('headmsg');
forr.innerText += `${obj.fname+" "+obj.lname}`;
model.classList.add('model');
model.classList.add('fade');
model.classList.add('show');
model.style="display:block";
}