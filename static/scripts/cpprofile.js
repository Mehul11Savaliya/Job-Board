// window.onpopstate = (e) => {
//     if (e) {
//       window.location = "/signin"
//     }

//   }

let modelx = document.getElementById("jobDialog");
let post = document.getElementById("pjpost");
let obj = {};

let gender = "";
let genders = document.getElementsByName("pjgender");
genders.forEach((val) => {
  val.addEventListener("click", (evt) => {
    gender = evt.target.value;
  });
});

const postjb = (event) => {
  event.preventDefault();
  var formData = new FormData();
  let ips = document.querySelectorAll(".ip");
  Array.from(ips).forEach((ele) => {
    if (ele.getAttribute("name") === "pjgender") {
      return;
    }
    if (
      ele.getAttribute("name") === "pjfile" ||
      ele.getAttribute("name") === "pjposter"
    ) {
      formData.append(
        ele.getAttribute("name"),
        document.getElementsByName(ele.getAttribute("name"))[0].files[0]
      );
    } else {
      formData.append(ele.getAttribute("name"), ele.value);
    }
  });
  formData.append("pjcpname", document.getElementById("CPNAME").value);
  formData.append("gender", gender);

  fetch("/setjob", {
    method: "POST",
    body: formData,
  })
    .then((res) => {
      // console.log(res.body);
      return res.json();
    })
    .then((vax) => {
      $("#jobDialog").modal("hide");
      updateJobs(vax.data);
     console.log(vax);
      alert(vax.msg);
    })
    .catch((err) => {
      console.log(err);
    });
};

let sal = Math.max(
  Number.parseFloat(
    document.getElementsByName("pjsalary")[0],
    document.getElementsByName("pjsalary")[0]
  )
);

// post.addEventListener("click", (evt) => {
//   let ips = document.querySelectorAll(".ip");
//   Array.from(ips).forEach((ele) => {

//     if (ele.getAttribute("name") === "pjgender") {
//       return;
//     }
//     obj[ele.getAttribute("name")] = ele.value;

//   })
//   obj.pjcpname=document.getElementById("CPNAME").value;
//   obj.pjgender = gender;
//   // console.log(JSON.stringify(obj));
//   fetch("/setjob", {
//     method: "POST",
//     headers: {
//       'Accept': 'application/json',
//       "Content-type": "application/json; charset=UTF-8"
//     },
//     body: JSON.stringify(obj)

//   }).then(res => {
//     return res.json();
//   }).then(va => {
//     $('#jobDialog').modal('hide');
//       updateJobs(obj);
//     alert(va.msg);
//   });
// });

const fetJobs = async () => {
  fetch("/getJobs", {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify({
      email: `'${document.getElementById("CPNAME").value}'`,
    }),
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      
      for (let obj of data) {
       // console.log(typeof obj);
       obj = JSON.stringify(obj);
        
         obj = JSON.parse(obj);
       //  console.table(obj);
        if (obj.pjttl === undefined) continue;
        else updateJobs(obj);
      }
    });
};

(async function () {
  await fetJobs();
})();

const updateJobs = (obj) => {
  let job = document.createElement("div");
  job.setAttribute("class", "job");
  job.setAttribute("style","margin-top:5px")
  job.setAttribute("data-email", obj.pjemail);
  job.setAttribute("data-ttl", obj.pjttl);

  job.innerHTML = `
    <div class="card" style="width: 75%;margine-top:5px;">
            <div class="card-header">
              ${document.getElementById("CPNAME").value}
            </div>
            <div class="card-body" style="display:flex">
          <div style="width:40vw">
   <h5 class="card-title" style="display: inline;">Job Title : </h5> <span class="card-text">${obj.pjttl
    }</span>
   <br>
   <p class="card-text">${obj.pjdisc.replaceAll("\n", "<br>")}</p>
   <br>
   <h5 class="card-title" style="display: inline;">email : </h5> <span class="card-text">${obj.pjemail
    }</span><br>
   <h5 class="card-title" style="display: inline;">For : </h5> <span class="card-text">${obj.gender
    }</span><br>
   <h5 class="card-title" style="display: inline;">salary : </h5> <span class="card-text">${obj.pjsalary
    }</span><br>
   <br>
              
              <a href="" class="btn btn-primary mx-3">Edit</a>
              <button data-email="${obj.pjemail}" data-ttl="${obj.pjttl}" class="btn btn-danger mx-3">Delete</button>
            </div>

            <div class="d-flex" style="height: 200px;">
  <div class="vr"></div>
</div>

            <div class="media" style="margin:10px auto">
  <img loading="lazy" src="${obj.pjfile}" class="img-fluid rounded-start" style="display:block;width:25vw;height:25vh;margin-bottom:5px" onerror="this.src='/static/img/download.jfif'" alt="job,jobposter">
  <a href="${obj.pjposter===undefined?'#':obj.pjposter}" style="display:block,margin:5px auto" class="btn btn-primary mx-3">JOB FILE</a>
</div>
            </div>
         

          </div>
              `;
  document.getElementsByClassName("jobholder")[0].appendChild(job);
  attachDeleteEvent();
};

let data = [];
const attachDeleteEvent = () => {
  let dels = document.getElementsByClassName("btn-danger");

  Array.from(dels).forEach((delet) => {
    delet.addEventListener("click", (evt) => {
      data = [];
      console.clear();
      let parent = evt.target.parentNode.parentNode.parentNode.parentNode;
      data.push(parent.getAttribute("data-email"));
      data.push(parent.getAttribute("data-ttl"));
      //console.log(parent.getAttribute("data-email"),parent.getAttribute("data-email"));
      let ttl = data[1];
      let eml = data[0];

      deletJob(eml, ttl);
      document.querySelectorAll(`[data-ttl="${ttl}"]`)[0].remove();
    });
  });
};

const deletJob = (email, ttl) => {
  fetch("/deletejob", {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify({
      cpemail: `'${email}'`,
      cpttl: `'${ttl}'`,
    }),
  })
    .then((res) => {
      return res.json();
    })
    .then((val) => {
      alert(val.msg);
    });
};
