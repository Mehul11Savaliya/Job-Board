    let conversations = document.getElementById('tos');
    fetch('/chat/getTos',{
        method:"post",
        headers:{
            'content-type': 'application/json'
        }
    }).then(res=>{return res.json()}).then(val=>{
        let i=1;
        Array.from(val).forEach(valx=>{

            let to = document.createElement('button');
            to.setAttribute('class','nav-link align-middle px-0 border border-primary');
            to.setAttribute('onclick',`loadMsg(event,'${valx}')`);
            //to.setAttribute('href','#');
            to.innerHTML=`<span  class="ms-1 d-none d-sm-inline">${(i++)+"  "+valx}</span>`
        //     let to =` <a href="#" class="nav-link align-middle px-0">
        //     <i class="fs-4 bi-house"></i> <span class="ms-1 d-none d-sm-inline">${valx}</span>
        // </a>`;
        conversations.appendChild(to);
        });
    });

    
    let msgs =document.getElementsByClassName('msgs')[0];

var active;
const loadMsg = (event,tox)=>{
    active=tox;
    fetch('/chat/getMsgs',{
        method:"post",
        headers:{
            'content-type': 'application/json'
        },
        body:JSON.stringify({
            to:tox
        })
    }).then(res=>{return res.json()}).then(val=>{
        msgs.innerHTML=' <h6 style="text-align: center;color: black;">Messages!</h6>';
        Array.from(val).forEach(valx=>{
            let clientmsg = document.createElement("div");
            if(valx.type==='s'){
            clientmsg.setAttribute("class", "server");
            clientmsg.innerHTML = `<span>${valx.msg+"<br>"+"<small style='font-size:12px'>"+valx.time+"</small>"}</span>`;
            msgs.appendChild(clientmsg);
        }
        else{
            clientmsg.setAttribute("class", "client");
            clientmsg.innerHTML = `<span>${valx.msg+"<br>"+"<small style='font-size:12px'>"+valx.time+"</small>"}</span>`;
            msgs.appendChild(clientmsg);
        } 
        });
    });
    document.getElementById('ctrl').setAttribute('style','display:block');
}

// let sendmsgbtn = document.getElementById("bmsg");
// let msgx = document.getElementById('msg');
//   sendmsgbtn.addEventListener('click',(evt)=>{
//         if(msgx.value!==''){
//         fetch("/chat/sendMsg",{
//           method:"post",
//           headers:{
//             'content-type': 'application/json'
//           },
//           body:JSON.stringify({
//             to:active,
//             msg:msgx.value
//           })
//         }).then(res=>{
//           return res.json();
//         }).then(val=>{
//             let clientmsg = document.createElement("div");
//            if(val.ack===true){
//             clientmsg.setAttribute("class", "client");
//             clientmsg.innerHTML = `<span>${msgx.value+"<br>"+"<small style='font-size:12px'>"+new Date().toLocaleTimeString()+"</small>"}</span>`;
//             msgs.appendChild(clientmsg);
//            }
       
//         });
//     }
//   });

let sendsms = (event)=>{
    let msgx = document.getElementById('msg');
    if(msgx.value!==''){
        fetch("/chat/sendMsg",{
          method:"post",
          headers:{
            'content-type': 'application/json'
          },
          body:JSON.stringify({
            to:active,
            msg:msgx.value
          })
        }).then(res=>{
          return res.json();
        }).then(val=>{
            let clientmsg = document.createElement("div");
           if(val.ack===true){
            clientmsg.setAttribute("class", "client");
            clientmsg.innerHTML = `<span>${msgx.value+"<br>"+"<small style='font-size:12px'>"+new Date().toLocaleTimeString()+"</small>"}</span>`;
            msgs.appendChild(clientmsg);
           }
       
        });
    }
}