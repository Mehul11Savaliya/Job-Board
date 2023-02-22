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
         <td><button class='btn btn-info'>VIEW</button></td>
         `;
         i++;
         document.getElementById('recievedjob').appendChild(tr);
       }
       
    })
}

fetJob();