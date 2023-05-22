
const mysq = require("./mysq.js");
const fs = require("fs");
const path = require("path");
const CryptoJs = require("crypto-js");

const updateCPProfilePath = async (cpobj, profilepath) => {
    console.time("qry:updateCPProfilePath");
    return new Promise(async (res, rej) => {
        const con = await mysq.getConnect();
        const checkqry = `SELECT * FROM cpmedia WHERE email='${cpobj.cpemail||cpobj.email}' and pass='${cpobj.cppass||cpobj.pass}'`;
        let sresult = { email: 'nub' };
        con.query(checkqry, (err, data) => {
            if (err) {
                console.log('media>updateCPProfilePath', err);
                rej([false, err])
            }
            else {
                let qry;
                sresult = data[0];
                //   console.log(sresult);

                try {
                    fs.unlinkSync(path.join(require.main.path, sresult.profile), (err) => { console.log("media>updateCPProfilePath", err) });

                    qry = `UPDATE cpmedia SET profile='${profilepath}' WHERE email='${cpobj.cpemail||cpobj.email}' and pass ='${cpobj.cppass||cpobj.pass}'`;
                    con.query(qry, (err, resx) => {
                        if (err) {
                            console.log('media>updateCPProfilePath', err);
                            rej([false, err])
                        }
                        else {
                            con.end((err) => {
                                if (err) console.log("updateCPProfilePath : cannot destroy");
                                else {
                                    console.log("updateCPProfilePath : con destroyed inside updateprofile update part");
                                }
                            });

                            res([true, resx])
                        }
                    });

                } catch (error) {

                    qry = `INSERT INTO cpmedia(email, pass, profile) VALUES ('${cpobj.cpemail||cpobj.email}','${cpobj.cppass||cpobj.pass}','${profilepath}')`;
                    con.query(qry, (err, resx) => {
                        if (err) {
                            console.log('media>updateCPProfilePath', err);
                            rej([false, err])
                        }
                        else {
                            con.end((err) => {
                                if (err) console.log("updateCPProfilePath : cannot destroy");
                                else {
                                    console.log("updateCPProfilePath : con destroyed inside updateprofile insert part");
                                }
                            });
                            res([true, resx])
                        }
                    })
                }
            }
        })
        console.timeEnd("qry:updateCPProfilePath");
    });
}

const getCompanyMedia = async function (cpemail, cppass) {
    return new Promise(async (res, rej) => {
        const con = await mysq.getConnect();
        const qry = `SELECT * FROM cpmedia WHERE email='${cpemail}' AND pass = '${cppass}'`;
        con.query(qry, (err, data) => {
            if (err) {
                console.log('err:media>getCompanyMedia : ', err);
                con.end((err) => {
                    console.log('err:media>getCompanyMedia : ', err)
                    rej(err);
                });
            }
            else {
                // console.table(data);
                if (data.profile === undefined) {
                    res([false, data]);
                }
                else {
                    res([true, data]);
                }
            }
        })
    })
}

const insertJobMedia = async (raw1, raw2, ext1, ext2, cpemail, cpttl) => {

    let hs = CryptoJs.SHA1(cpemail + cpttl);

    let hex = hs.toString();

    let pjposter_path = "/public/cpupload/jobmedia/" + hex + "." + ext1;
    let pjfile_path = "/public/cpupload/jobmedia/" + hex + "." + ext2;


    await fs.writeFile(path.join(require.main.path, pjposter_path), raw1, (err) => console.log(err));
    await fs.writeFile(path.join(require.main.path, pjfile_path), raw2, (err) => console.log(err));

    return [pjfile_path, pjposter_path];

}

const deleteJobMedia = (cpemail, cpttl, extimg) => {
    let hs = CryptoJs.SHA1(cpemail + cpttl);
    let hex = hs.toString();

    let pjposter_path = "./public/cpupload/jobmedia/" + hex + "." + extimg;
    let pjfile_path = "./public/cpupload/jobmedia/" + hex + ".pdf";
    fs.unlink(path.join(require.main.path,pjfile_path), (err) => {
        if (err) {
            console.log(err);
        }
        else {
            fs.unlink(path.join(require.main.path,pjposter_path), (err) => {
                if (err) {
                    console.log(err);
                }
            })
        }
    })
}

module.exports = { updateCPProfilePath, getCompanyMedia, insertJobMedia ,deleteJobMedia}
