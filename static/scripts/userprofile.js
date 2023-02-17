const applyjob = (cpname,cpemail,cpttl,evt)=>{
    fetch("/appyJob",{
        method:"post",
        headers:{
            'Accept': 'application/json',
            'Content-type': "application/json; charset=UTF-8"
        },
        body:JSON.stringify({
            pjemail:cpemail,
            pjcpname:cpname,
            pjttl:cpttl
        })
    }).then(val=>{return val.json()}).then(valx=>{
       alert(valx.msg);
    })
    // let job = document.querySelector(`'[data-]'`);
    //console.log(
        evt.target.classList.add("disabled")//);
        evt.target.setAttribute("disabled","");
        console.log(evt.target.classList);
    // evt.target.class
}


const updateui = (type,event)=>{
    let data = event.target.innerHTML;
    event.target.innerHTML=`<object type="text/html" data="/static/component/appliedjob.html" ></object>`;
document.getElementById("supercontent").innerHTML=`"<object type="text/html" data="/static/component/appliedjob.html" ></object>"`;
}
