const express = require('express');
const http = require('http');
const app = express();
const socketio = require('socket.io');
const handlebars = require('express3-handlebars').create({defaultLayout: 'main'});
const credential = require('./secret');
const mysql = require('mysql');
const path = require('path');
const urlParser = require('url');

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

/* MIDDLEWARE HERE */
app.use(require('body-parser')());
app.use(require('cookie-parser')(credential.secret));
app.use(require('express-session')());
app.use(express.static('public'));


const sharp = require('sharp');
const fileUpload = require('express-fileupload');
const fs = require('fs');
var sizeOf = require('image-size');
var _req;
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : path.join(__dirname, 'public/img/tempImg'),
}));

const server = http.createServer(app);
const io = socketio(server)

var id = null;

io.on('connection', (socket)=>{
    // console.log(`${id}`);
    var query = `SELECT post_id FROM POSTS WHERE user_id = '${id}'`;
    execute(query, result=>{
        for(var i = 0; i<result.length; i++){
            socket.join(`${result[i].post_id}`);
        }
        socket.join(`followed-${id}`);

        socket.on('someone-likes-your-post', msg=>{
            var d = new Date();
            var date = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;

            query = `INSERT INTO LIKES(user_id, post_id, time) VALUES('${id}', '${msg.post_id}', '${date}')`;

            execute(query, result=>{
                // console.log('insert');
                query = `INSERT INTO NOTIFY(user_id, url, content, time, target_id)
                         VALUES('${msg.user_id}', '/p/${msg.post_id}', 'Vừa thích một bài viết của bạn.', '${date}', '${id}')`;
                execute(query, result=>{
                    query = `SELECT avatar, user_token FROM PROFILES WHERE user_id = '${id}'`;
                    execute(query, result =>{

                        socket.broadcast.to(`${msg.post_id}`).emit('notif', {src: result[0].avatar, user_token: result[0].user_token, url: `/p/${msg.post_id}`});
                    })
                });
            });
        });

        socket.on('someone-dislikes-your-post', msg=>{
            query = `DELETE FROM LIKES WHERE user_id = '${id}' AND post_id = '${msg.post_id}'`;
            execute(query, result=>{
                // console.log('delete');
            });
        });

        socket.on('someone-cmtd-on-your-post', msg=>{

            var d = new Date();
            var date = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;

            query = `INSERT INTO comments(user_id, post_id, time, content) VALUES('${id}', '${msg.post_id}', '${date}', '${msg.cmt}')`;

            execute(query, result=>{

                query = `INSERT INTO NOTIFY(user_id, url, content, time, target_id)
                         VALUES('${msg.user_id}', '/p/${msg.post_id}', 'Vừa bình luận một bài viết của bạn.', '${date}', '${id}')`;
                execute(query, result=>{
                    query = `SELECT user_token, avatar FROM PROFILES WHERE user_id = '${id}'`;
                    execute(query, result=>{

                        socket.emit('new-mess', {cmt: msg.cmt, user_token:  result[0].user_token, post_id: `${msg.post_id}`})
                        socket.broadcast.to(`${msg.post_id}`).emit('someone-has-cmtd-on-your-post', {src: result[0].avatar, user_token: result[0].user_token, url: `/p/${msg.post_id}`});
                    });
                });
            });
        });
        socket.on('someone-has-followed-you', msg => {
            // console.log(msg);
            query = `SELECT * FROM PROFILES WHERE user_token = '${msg.user_token}'`;
            id = msg.user;
            execute(query, result=>{
                var user = result[0];
                var query = `INSERT INTO FOLLOWED(user_id, target) VALUES('${id}', '${user.user_id}')`;
                execute(query, result=>{
                    var d = new Date();
                    var date = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;

                    query = `INSERT INTO NOTIFY(user_id, url, content, time, target_id)
                    VALUES('${user.user_id}', '/u/${user.user_token}', 'Vừa theo dõi bạn.', '${date}', '${id}')`;

                    execute(query, result=>{
                        query = `SELECT user_token, avatar FROM PROFILES WHERE user_id = '${id}'`;
                        execute(query, result=>{

                            socket.emit('follow-success', {token: `${msg.user_token}`});
                            socket.broadcast.to(`followed-${user.user_id}`).emit('someone-has-followed-you', {src: result[0].avatar, r_user_token:  result[0].user_token, url:  `/u/${result[0].user_token}`});
                        });
                    });
                });
            });
        });
        socket.on('leave-req', msg=>{
            var user_1 = msg.user_id;
            var user_2 = msg.session;

            var query = `SELECT rkey FROM ROOMKEY
                         WHERE user_id_1 IN ('${user_1}', '${user_2}') AND
                               user_id_2 IN ('${user_1}', '${user_2}')`;
            // console.log(query);
            execute(query, result=>{
                socket.leave(result[0].rkey);
            });
        });
        socket.on('join-req', msg=>{
            var user_1 = msg.user_id;
            var user_2 = msg.session;

            var query = `SELECT rkey FROM ROOMKEY
                         WHERE user_id_1 IN ('${user_1}', '${user_2}') AND
                               user_id_2 IN ('${user_1}', '${user_2}')`;
            // console.log(query);
            execute(query, result=>{
                if(result.length>0){
                    socket.join(result[0].rkey);
                    socket.emit('join-success', {target: user_1});
                }else{
                    query = `
                        INSERT INTO ROOMKEY VALUES('${user_1}', '${user_2}', '${user_1}${user_2}'),('${user_2}', '${user_1}', '${user_1}${user_2}');
                    `;
                    execute(query, result=>{
                        socket.join(`${user_1}${user_2}`);
                        socket.emit('join-success', {target: user_1});
                    });
                }
            });
        });
        socket.on('new-message-req', msg=>{
            var d = new Date();
            var date = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;

            var content = msg.content;
            var ctype   = msg.type;
            var sender  = msg.from;
            var recipant= msg.to;

            query = `SELECT rkey FROM ROOMKEY WHERE user_id_1 IN ('${sender}', '${recipant}') AND
                     user_id_2 IN ('${sender}', '${recipant}')`;

            execute(query, result =>{
                var key = result[0].rkey;

                query = `INSERT INTO MESSAGES VALUES('${key}', '${sender}', '${date}', '${content}', '${ctype}')`;
                execute(query, result =>{

                    socket.broadcast.to(`${key}`).emit('new-message-arrived', {ctype: ctype, content: content});
                });
            });
        });
    });
});



app.use((req, res, next)=>{
    id = req.session.user_id;
    var query = `SELECT * FROM PROFILES WHERE user_id = '${req.session.user_id}'`;
    // console.log(query);
    execute(query, result=>{
        query = `
        SELECT COUNT(target) AS C FROM FOLLOWED WHERE user_id = '${req.session.user_id}' GROUP BY user_id;
    `;
        req.session.profile = result[0];
        execute(query, result=>{
            req.session.following = 0;
            if(result.length > 0){
                req.session.following  = result[0].C;
            }

            query = `
            SELECT COUNT(user_id)  AS C FROM FOLLOWED WHERE target = '${req.session.user_id}' GROUP BY target;
        `;
            execute(query, result=>{
                req.session.followed = 0;
                if(result.length > 0){
                    req.session.followed  = result[0].C;
                }
                deleteAllTempImg()
                next();
            });
        });
    });
});


/* FUNCTION */
function toArray(json){
    var result = [];
    var keys = Object.keys(json);
    keys.forEach(function(key){
        result.push(json[key]);
    });
    return result;
}



function getUserById(req, id){
    var users = req.session.users;
    // console.log(id);
    // console.log(users);
    for(var i = 0; i<users.length; i++){
        if(users[i].user_id == id){
            return users[i];
        }
    }
    return null;
}

function getUserByToken(req, token){
    var users = req.session.users;
    // console.log(id);
    // console.log(users);
    for(var i = 0; i<users.length; i++){
        if(users[i].user_token == token){
            return users[i];
        }
    }
    return null;
}

function deleteAllTempImg(){
    var query = "SELECT url FROM temp_img";
    execute(query, result=>{
        var temp = result;

        for(var i = 0; i < temp.length; i++){
            var url = temp[i].url;
            fs.unlink(`${temp[i].url}`, (err)=>{
                var query = `DELETE FROM temp_img WHERE url = '${url}'`;
                execute(query, (result)=>{});
            });
        }
    });
}

function cropIMG(file, post_id ,new_name){
    new_name = new_name.toString();
    file.mv(`public/img/tempImg/${post_id+new_name}.jpg`, ()=>{

        sizeOf(`public/img/tempImg/${post_id+new_name}.jpg`, (err, sizes)=>{
                    // console.log(new_name);
            var height, width;

            if(sizes){
                height = sizes.height;
                width  = sizes.width;
            }
            if(height == width){
                sharp(`public/img/tempImg/${post_id+new_name}.jpg`).extract({width: width, height: height, left: 0, top: 0}).toFile(`public/img/post/${post_id+new_name}.jpg`);
            }
            if(height > width){
                var top = Math.round((height-width)/2);
                sharp(`public/img/tempImg/${post_id+new_name}.jpg`).extract({width: width, height: width, left: 0, top: top}).toFile(`public/img/post/${post_id+new_name}.jpg`);
            }
            if(height < width){
                var left = Math.round((width - height)/2);
                sharp(`public/img/tempImg/${post_id+new_name}.jpg`).extract({width: height, height: height, left: left, top: 0}).toFile(`public/img/post/${post_id+new_name}.jpg`);
            }
        });
    });
}


app.use('/', (req, res, next)=>{
    var query = "SELECT post_id, url FROM POST_CONTENT";
    execute(query, result=>{
        req.session.post_content = result;
        query = "SELECT user_id, name, user_token, avatar, website FROM PROFILES";
        execute(query, result=>{
            var users = result;
            req.session.users = users;
            next();
        })
    });
});

/* DATABASE*/


const con = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'sasageyo'
});



function execute(query, callback){
    con.query(query, function(err, result){
        if(err){
            throw err;
        }
        callback(result);
    });
}

app.get('/login', (req, res)=>{
    res.render("sign/login", {
        layout: null,
    });
});

app.get('/logout', (req, res)=>{
    req.session.user_id = null;
    res.redirect('/login');
});

app.get('/logup', (req, res)=>{
    res.render("sign/logup", {
        layout: null,
    });
});

app.get('/birth-assign', (req, res)=>{
    if(!req.session.user_id){
        res.redirect('/logup');
    }
    else{

        res.render("sign/birth", {
            layout: null,
        });
    }
});




app.get('/', (req, res)=>{
    if(!req.session.user_id){
        res.redirect('/login');
    }
    else{
        var query = "SELECT post_id, user_id, content FROM POSTS ORDER BY post_date DESC";
        execute(query, result=>{
            var posts = result;
            var contents = req.session.post_content;

            for(var i = 0; i < posts.length; i++){
                var post_id = posts[i].post_id;
                var tmp = [];
                for(var j = 0; j < contents.length; j++){
                    if(contents[j].post_id == post_id){
                        tmp.push(contents[j].url);
                    }
                }
                var user = getUserById(req, posts[i].user_id);
                posts[i].start_url = tmp[0];
                var linksList = [];
                for(var h =1; h<tmp.length; h++){
                    linksList.push(tmp[h]);
                }
                posts[i].url=linksList;
                posts[i].postOwner = user;
            }

            res.render('home', {
                profile: req.session.profile,
                post: posts,
            });
        });
    }
});


app.get('/profile', (req, res)=>{
    if(!req.session.user_id){
        res.redirect('/login');
    }
    else{
        var query = `SELECT P.post_id, url FROM POST_CONTENT AS C
                     INNER JOIN POSTS AS P ON P.post_id = C.post_id
                     WHERE user_id = '${req.session.user_id}'
                     GROUP BY POST_ID ORDER BY post_date DESC;`;


        execute(query, result=>{
            var sample = result;

            res.render('profile/profiles', {
                profile: req.session.profile,
                following: req.session.following,
                followed: req.session.followed,
                sample: sample,
                post_count: sample.length,
            });
        });
    }
});


app.get('/profile/saved', (req, res)=>{
    if(!req.session.user_id){
        res.redirect('/login');
    }
    else{
        var query = `SELECT P.post_id, url FROM POST_CONTENT AS C
                     INNER JOIN POSTS AS P ON P.post_id = C.post_id
                     INNER JOIN SAVED AS S ON S.post_id = P.post_id
                     WHERE S.user_id = '${req.session.user_id}'
                     GROUP BY POST_ID ORDER BY time DESC;`;


        execute(query, result=>{
            var sample = result;
            var query = `SELECT P.post_id, url FROM POST_CONTENT AS C
                         INNER JOIN POSTS AS P ON P.post_id = C.post_id
                         WHERE user_id = '${req.session.user_id}'
                         GROUP BY POST_ID ORDER BY post_date DESC;`;
            execute(query, result=>{

                res.render('profile/save', {
                    profile: req.session.profile,
                    following: req.session.following,
                    followed: req.session.followed,
                    sample: sample,
                    post_count: result.length,
                });
            });
        });
    }
});


app.get('/profile/c/infor', (req, res)=>{
    if(!req.session.user_id){
        res.redirect('/login');
    }
    else{

        res.render('profile/change_infor', {
            layout: "change",
            profile: req.session.profile,
        });
    }
});

app.get('/profile/c/password', (req, res)=>{
    if(!req.session.user_id){
        res.redirect('/login');
    }
    else{

        res.render('profile/change_password', {
            layout: "change",
            profile: req.session.profile,
        });
    }
});


app.get('/post/create', (req, res)=>{
    if(!req.session.user_id){
        res.redirect('/login');
    }else{

        res.render('profile/post_create', {
            profile: req.session.profile,
        });
    }
});



app.get('/p/:id', (req, res)=>{
    if(!req.session.user_id){
        res.redirect('/login');
    }else{

        var post_id = req.params.id;

        var query = `SELECT post_id, user_id, content FROM POSTS WHERE post_id = '${post_id}'`;
        execute(query, result=>{
            var posts = result;
            var contents = req.session.post_content;

            for(var i = 0; i < posts.length; i++){
                var post_id = posts[i].post_id;
                var tmp = [];
                for(var j = 0; j < contents.length; j++){
                    if(contents[j].post_id == post_id){
                        tmp.push(contents[j].url);
                    }
                }
                var user = getUserById(req, posts[i].user_id);
                posts[i].start_url = tmp[0];
                var linksList = [];
                for(var h =1; h<tmp.length; h++){
                    linksList.push(tmp[h]);
                }
                posts[i].url=linksList;
                posts[i].postOwner = user;
            }
            query = `SELECT COUNT(*) AS likes FROM LIKES WHERE post_id = '${post_id}'
                    UNION ALL
                     SELECT COUNT(*) AS likes FROM LIKES WHERE post_id = '${post_id}' AND user_id = '${req.session.user_id}';

            `;
            execute(query, result=>{
                posts[0].likes = result[0].likes;
                if(result[1].likes == 1){
                    posts[0].liked = true;
                }else{
                    posts[0].liked = false;
                }
                // console.log(posts[0]);
                res.render('post/post', {
                    post: posts[0],
                    profile: req.session.profile,
                });
            });
        });
    }
});

app.get('/u/:id', (req, res)=>{
    var id = req.params.id;

    if(!req.session.user_id){
        res.redirect('/login');
    }
    else{
        if(req.session.user_token == id){
            res.redirect('/profile');
        }
        else{

            var query = `SELECT * FROM PROFILES WHERE user_token = '${id}'`;
            // console.log(query);
            execute(query, result=>{
                query = `
                SELECT COUNT(target) AS C FROM FOLLOWED AS F INNER JOIN PROFILES AS P ON P.user_id = F.user_id WHERE P.user_token = '${id}' GROUP BY P.user_id
                UNION ALL
                SELECT COUNT(P.user_id) AS C FROM FOLLOWED AS F INNER JOIN PROFILES AS P ON P.user_id = F.user_id WHERE P.user_token = '${id}' GROUP BY user_token;
                `;
                // console.log(query);
                var profile = result[0];
                execute(query, result=>{
                    var following = 0;
                    var followed = 0;
                    if(result.length != 0){
                        following  = result[0].C;
                        followed = result[1].C
                    }
                    var query = `SELECT P.post_id, url FROM POST_CONTENT AS C
                    INNER JOIN POSTS AS P ON P.post_id = C.post_id
                    INNER JOIN PROFILES AS F ON F.user_id = P.user_id
                    WHERE user_token = '${id}'
                    GROUP BY POST_ID
                    ORDER BY post_date DESC;`;


                    execute(query, result=>{
                        var sample = result;
                        var user = getUserByToken(req, id);
                        query = `SELECT user_id, target FROM FOLLOWED WHERE user_id = '${req.session.user_id}' AND target = '${user.user_id}'`;
                        execute(query, result=>{
                            var isfollowed = false;
                            if(result.length > 0){
                                isfollowed = true;
                            };
                            res.render('profile/user', {
                                u_profile: profile,
                                profile: req.session.profile,
                                followed: followed,
                                following: following,
                                sample: sample,
                                post_count: sample.length,
                                isfollowed: isfollowed,
                            });
                        });
                    });
                });
            });
        }
    }

});


app.get('/messengers', (req, res)=>{
    if(!req.session.user_id){
        res.redirect('/login');
    }else{
        var query = `SELECT user_id, user_token, avatar FROM PROFILES
                     WHERE user_id IN
                     (
                     	 SELECT target FROM FOLLOWED WHERE user_id = '${req.session.user_id}'
                     );`;

        execute(query, result =>{
            var users = result;
            res.render('messenger', {
                profile: req.session.profile,
                users: users,
            });
        });
    }
});



app.post('/getPostInfor', (req, res)=>{
    var post_id = req.body.post_id;

    var query = `SELECT post_id, user_id, content FROM POSTS WHERE post_id = '${post_id}'`;
    execute(query, result=>{
        var posts = result;
        var contents = req.session.post_content;

        for(var i = 0; i < posts.length; i++){
            var post_id = posts[i].post_id;
            var tmp = [];
            for(var j = 0; j < contents.length; j++){
                if(contents[j].post_id == post_id){
                    tmp.push(contents[j].url);
                }
            }
            var user = getUserById(req, posts[i].user_id);
            posts[i].start_url = tmp[0];
            var linksList = [];
            for(var h =1; h<tmp.length; h++){
                linksList.push(tmp[h]);
            }
            posts[i].url=linksList;
            posts[i].postOwner = user;
        }

        res.send({
            post: posts[0],
        });
    });
});

app.post('/login-process', (req, res)=>{
    var user = req.body.user;
    var pass = req.body.pass;

    var query = `SELECT COUNT(*) AS C FROM USERS WHERE user_id = '${user}' AND password = '${pass}'`;
    // console.log(query);
    execute(query, result=>{
        if(result[0].C != 0){
            query = `SELECT user_token, avatar FROM PROFILES WHERE user_id = '${user}'`;
            execute(query, result=>{
                // console.log(result);
                req.session.user_token = result[0].user_token;
                req.session.avatar = result[0].avatar;
                req.session.user_id = user;
                res.redirect('/');
            });
        }else{
            res.redirect('/login');
        }
    });
});

app.post('/logup-process', (req, res)=>{
    var user = req.body.user;
    var name = req.body.name;
    var token = req.body.token;
    var pass = req.body.pass;

    var query = `SELECT COUNT(*) AS C FROM USERS WHERE user_id = "${user}"`;
    // console.log(query);
    execute(query, (result)=>{
        if(result[0].C == 0){
            query = `INSERT INTO USERS(user_id, password) VALUES('${user}', '${pass}')`;
            // console.log(query);
            execute(query, result=>{
                query = `INSERT INTO PROFILES(user_id, user_token, name, avatar) VALUES('${user}', '${token}', '${name}', '/img/avatar/${user}.jpg')`;
                // console.log(query);
                fs.copyFile('public/img/avatar/default.jpg', `public/img/avatar/${user}.jpg`, err=>{

                    execute(query, result=>{
                        req.session.user_id = user;
                        res.redirect('/birth-assign');
                    });
                });
            });
        }else{
            res.redirect('/logup');
        }
    });
});




app.post('/changeIMG', (req, res)=>{

    var d = new Date();
    var new_name = `${req.session.user_id}${d.getFullYear()}${d.getMonth()+1}${d.getDate()}${d.getHours()}${d.getMinutes()}${d.getSeconds()}${d.getMilliseconds()}`;


    fs.unlink(`public${req.session.profile.avatar}`, (err)=>{

        req.files.file.mv(`public/img/tempImg/${new_name}.jpg`, ()=>{

            sizeOf(`public/img/tempImg/${new_name}.jpg`, (err, sizes)=>{
                        // console.log(new_name);
                var height, width;

                if(sizes){
                    height = sizes.height;
                    width  = sizes.width;
                }
                if(height == width){
                    sharp(`public/img/tempImg/${new_name}.jpg`).extract({width: width, height: height, left: 0, top: 0}).toFile(`public/${req.session.profile.avatar}`);
                }
                if(height > width){
                    var top = Math.round((height-width)/2);
                    sharp(`public/img/tempImg/${new_name}.jpg`).extract({width: width, height: width, left: 0, top: top}).toFile(`public/${req.session.profile.avatar}`);
                }
                if(height < width){
                    var left = Math.round((width - height)/2);
                    sharp(`public/img/tempImg/${new_name}.jpg`).extract({width: height, height: height, left: left, top: 0}).toFile(`public/${req.session.profile.avatar}`);
                }
            });

            var tmpIMGQuery = `INSERT INTO temp_img(url) VALUES('public/img/tempImg/${new_name}.jpg')`;
            execute(tmpIMGQuery, result=>{

                res.redirect('/profile/c/infor');
            });
        });
    });
});

app.post('/profile-change', (req, res)=>{
    var name = req.body.name;
    var token = req.body.token;
    var website = req.body.website;
    var bio = req.body.bio;
    var email = req.body.email;
    var phone = req.body.phone;

    var user_id = req.session.user_id;

    var query = `UPDATE PROFILES SET
            user_token = '${token}',
            website    = '${website}',
            bio        = '${bio}',
            email      = '${email}',
            phone      = '${phone}'
        WHERE user_id  = '${user_id}';
    `;
    execute(query, result=>{
        req.session.user_token = token;
        res.redirect('/profile/c/infor');
    });
});

app.post('/gender-change', (req, res)=>{
    var gender  = req.body.gender;
    var user_id = req.session.user_id;

    var query = `
        UPDATE PROFILES SET gender = '${gender}'
        WHERE user_id = '${user_id}'
    `;

    execute(query, result=>{

        res.redirect('/profile/c/infor');
    });
});

app.post('/password-change', (req, res)=>{
    var query = `SELECT password FROM USERS WHERE user_id = '${req.session.user_id}'`;

    var old  = req.body.old;
    var new_ = req.body.new;
    var conf = req.body.conf;

    execute(query, result=>{
        if(result.length > 0 && new_ == conf){
            query = `UPDATE USERS SET password = ${new_} WHERE user_id = '${req.session.user_id}'`;

            execute(query, result=>{
                res.redirect('/profile/c/infor');
            });
        }
    });
});

app.post('/add-post', (req, res)=>{
    var content = req.body.content;
    var files = toArray(req.files);

    var d = new Date();
    var post_id = `${req.session.user_id}${d.getFullYear()}${d.getMonth()+1}${d.getDate()}${d.getHours()}${d.getMinutes()}${d.getSeconds()}${d.getMilliseconds()}`;

    var date = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;

    var query = `INSERT INTO POSTS(user_id, post_id, post_date, content) VALUES('${req.session.user_id}', '${post_id}', '${date}', '${content}')`;
    execute(query, result=>{

        // console.log(files);
        for(var i = 0; i< files.length; i++){
            cropIMG(files[i], post_id, i);
            var new_name = i.toString();
            query = `INSERT INTO POST_CONTENT(post_id, url) VALUES('${post_id}', '/img/post/${post_id+new_name}.jpg')`;
            execute(query, result=>{
            });
        }
    });

    res.redirect('/post/create');
});

app.post('/delete-post', (req, res)=>{

    query = `SELECT url FROM POST_CONTENT AS C INNER JOIN POSTS AS P ON P.post_id = C.post_id
             WHERE user_id = '${req.session.user_id}' AND C.post_id = '${req.body.post_id}';`;

    execute(query, result=>{

        for(var i = 0; i< result.length; i++){
            fs.unlink(`public${result[i].url}`, (err)=>{});
        }
        query = `DELETE FROM POST_CONTENT WHERE post_id = '${req.body.post_id}'`;
        execute(query, result=>{
            query = `DELETE FROM POSTS WHERE post_id = '${req.body.post_id}'`;
            execute(query, result=>{

                res.send({
                    succ: true,
                });
            });
        });
    });
});

app.post('/likesAndLiked', (req, res)=>{
    var post_id = req.body.post_id;
    var user_id = req.session.user_id;

    query = `SELECT COUNT(*) AS likes FROM LIKES WHERE post_id = '${post_id}'
             UNION ALL
             SELECT COUNT(*) AS likes FROM LIKES WHERE post_id = '${post_id}' AND user_id = '${req.session.user_id}';
    `;

    execute(query, result=>{
        var likes = result[0].likes;
        var liked = true;
        if(result[1].likes == 0){
            liked = false;
        }
        res.send({
            liked: liked,
            likes: likes,
        })
    });
});

app.post('/comments', (req, res)=>{
    var post_id = req.body.post_id;
    var position = parseInt(req.body.position);

    query = `SELECT content, user_token

             FROM comments AS P INNER JOIN PROFILES AS F
                    ON P.user_id = F.user_id

             WHERE post_id = '${post_id}'
             ORDER BY TIME DESC
             ;`;



    execute(query, result=>{
        var totalCmts = result.length;
        var cmts = [];
        var start, end;

        if(position == 0){
            start = 0;
            if(result.length < 20){
                end = result.length;
            }else{
                end = 20;
            }
        }else{
            start = position * 20;
            end = start + 20;
        }


        for(var i = start; i < end; i++){
            try{
                cmts.push({
                    user_token: result[i].user_token,
                    content: result[i].content,
                });
            }catch(e){
                console.log(e.message);
            }
        }


        res.send({
            total: totalCmts,
            cmts: cmts,
            new_pos: position + 1,
        })
    });
});


app.post('/getNotify', (req, res)=>{
    var query = `SELECT T.user_token AS user_token, T.avatar AS avatar, content, time, url
        FROM NOTIFY AS N INNER JOIN PROFILES AS T ON T.user_id = N.target_id
        WHERE N.user_id = '${req.session.user_id}'  AND user_token <> '${req.session.user_token}'
        ORDER BY time DESC;
    `;
    execute(query, result=>{
        // console.log(result);

        res.send({
            notify: result,
        });
    });
});


app.post('/getSimilars', (req, res)=>{
    var query = `
    SELECT user_id, user_token, avatar FROM PROFILES
    WHERE user_id NOT IN(
    SELECT TARGET FROM FOLLOWED WHERE USER_ID = '${req.session.user_id}' UNION SELECT '${req.session.user_id}' AS USER_ID); `;
    execute(query, result=>{
        var similars = result;
        // console.log(result);
        res.send({
            similars: similars,
        });
    });
});

app.post('/update-user-birth', (req, res)=>{
    var date  = req.body.date;
    var month = req.body.month;
    var year  = req.body.year;

    var date = `${year}-${month}-${date}`;

    var query = `UPDATE PROFILES SET date_of_birth = '${date}' WHERE user_id = '${req.session.user_id}'`;
    try{

        execute(query, result=>{
            res.send({
                success: true,
            });
        });
    }
    catch(err){
        res.send({
            success: false,
        });
    }
});


app.post('/validateUserId', (req, res)=>{

    var user_id = req.body.user_id;

    query = `SELECT COUNT(*) AS c FROM USERS WHERE user_id = '${user_id}'`;
    execute(query, result=>{
        if(result[0].c == 1){
            res.send({
                exits: true,
            });
        }else{
            res.send({
                exits: false,
            });
        }
    });
});

app.post('/validateUserToken', (req, res)=>{

    var user_token = req.body.user_token;

    query = `SELECT COUNT(*) AS c FROM PROFILES WHERE user_token = '${user_token}'`;
    execute(query, result=>{
        if(result[0].c == 1){
            res.send({
                exits: true,
            });
        }else{
            res.send({
                exits: false,
            });
        }
    });
});

app.post('/getFollowedInfor', (req, res)=>{
    var user_id = req.body.user_id;

    query = `
    SELECT COUNT(target) AS C FROM FOLLOWED WHERE user_id = '${user_id}' GROUP BY user_id;
`;
    execute(query, result=>{
        var following = 0;
        if(result.length > 0){
            following  = result[0].C;
        }

        query = `
        SELECT COUNT(user_id)  AS C FROM FOLLOWED WHERE target = '${user_id}' GROUP BY target;
    `;
        execute(query, result=>{
            var followed = 0;
            if(result.length > 0){
                followed  = result[0].C;
            }

            query = `
            SELECT COUNT(*) AS C FROM POSTS WHERE user_id = '${user_id}' GROUP BY user_id;
        `;
            execute(query, result=>{
                var postCount = 0;
                if(result.length > 0){
                    postCount  = result[0].C;
                }

                res.send({
                    followed: followed,
                    following: following,
                    postCount: postCount,
                });
            });
        });
    });
});

app.post('/getMessages', (req, res)=>{
    var user_1 = req.body.user_1;
    var user_2 = req.body.user_2;

    query = `SELECT rkey FROM ROOMKEY WHERE user_id_1 IN ('${user_1}', '${user_2}') AND
             user_id_2 IN ('${user_1}', '${user_2}')`;

    execute(query, result =>{
        var key = result[0].rkey;

        query = `SELECT sender, ctype, content, time FROM MESSAGES WHERE rkey = '${key}'`;

        execute(query, result=>{
            var messages = result;
            res.send({
                messages: messages,
            });
        });
    });
});

app.post('/saveMedia', (req, res)=>{
    var file = req.files.file;
    var ctype= req.body.type;
    var from = req.body.from;
    var to   = req.body.to;


    var d = new Date();
    var new_name = `${req.session.user_id}${d.getFullYear()}${d.getMonth()+1}${d.getDate()}${d.getHours()}${d.getMinutes()}${d.getSeconds()}${d.getMilliseconds()}`;
    var date = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;

    var query = `SELECT rkey FROM ROOMKEY WHERE user_id_1 IN ('${from}', '${to}') AND
             user_id_2 IN ('${from}', '${to}')`;
    execute(query, result=>{
        var rkey = result[0].rkey;

        new_name = rkey + new_name;

        switch(ctype){
            case "img":
                file.mv(`public/img/messenger/${new_name}.jpg`);
                res.send({
                    content: `/img/messenger/${new_name}.jpg`,
                    ctype: ctype,
                });
            break;
            case "video":
                file.mv(`public/img/messenger/${new_name}.mp4`);
                res.send({
                    content: `/img/messenger/${new_name}.mp4`,
                    ctype: ctype,
                });
            break;
        }

    });
});


const PORT = process.env.PORT || 3000;

server.listen(PORT, ()=>{
    console.log('Sasageyo started on http://127.0.0.1:'+PORT);
})
