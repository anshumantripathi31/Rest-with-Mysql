const express=require('express');
const app=express();
const path =require('path');
const {faker}=require('@faker-js/faker');
const mysql=require("mysql2");
const methodOverride=require("method-override");
const { v4: uuidv4 } = require('uuid');

app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));

const connection=mysql.createConnection({
    host:'localhost',
    user:'root',
    database:'delta_app',
    password:'Amt12anshu.'
});

// let getuserUser=()=>{
//     return [
//         faker.datatype.uuid(),
//         faker.internet.userName(),
//         faker.internet.email(),
//          faker.internet.password(),
    
// ];
//     };
    

// try{
//     connection.query(q,[data],(err,result)=>{
//         if(err) throw err;
//         console.log(result);
//     });
// }catch(err){
//     console.log(err);
// }
// connection.end();
app.get("/",(req,res)=>{
    let q=`SELECT count(*) FROM anshu`;
    try{
        connection.query(q,(err,result)=>{
            if(err) throw err;
            let count =result[0]["count(*)"];
            res.render("home.ejs",{count});
        });
    }catch{
        res.send("Somee error occurred");
    }
    
})

app.get("/user",(req,res)=>{
    let q= `SELECT * FROM anshu`;
    try{ 
        connection.query(q,(err,results)=>{
        if(err) throw err;

       // console.log(result);
        res.render("showusers.ejs",{results});
    });
}catch{
    res.send("Some err form Database")
}
});

app.get("/user/:id/edit",(req,res)=>{
    let {id}=req.params;
    let q=`SELECT * FROM anshu where id='${id}'`;
    try{ 
        connection.query(q,(err,result)=>{
        if(err) throw err;
        let user=result[0];
        //console.log(result);
        res.render("eedit.ejs",{user});
    });
}catch{
    res.send("Some err form Database")
}
      
});

app.patch("/user/:id",(req,res)=>{
  let {id}=req.params;
  let {password: formPass,username:newusername}=req.body;
  let q=`select * FROM anshu where id='${id}'`;
  try{
    connection.query(q,(err,result)=>{
        if(err) throw err;
        let user=result[0];
        if(formPass!=user.password){
            res.send("Please Enter Correct Password");
        }
        else{
            let q2=`UPDATE anshu SET username='${newusername}' WHERE id='${id}'`;
            connection.query(q2,(err,result)=>{
                if(err) throw err;
                res.redirect("/user");
            });
        }
       
    });
  }catch(err){
     console.log(err);
     res.send("some error in DB");
  }
})

app.get("/user/post",(req,res)=>{
    res.render("newPost.ejs");

})

app.patch("/user/post/new",(req,res)=>{
    let {username:newUsername,email:newEmail,password:newpassword}=req.body;
    let id=uuidv4();
    let q3=`INSERT INTO anshu (id,username,email,password) VALUES ('${id}','${newUsername}','${newEmail}','${newpassword}')`;
    try{
        connection.query(q3,(err,result)=>{
            if(err) throw err;
            res.redirect("/user");
        });
    }catch(err){
        console.log(err);
        res.sed("Some err in DB");
    }
   
});

app.get("/user/:id/delete",(req,res)=>{
    let {id}=req.params;
    let q=`SELECT * FROM anshu where id='${id}'`;
    try{
        connection.query(q,(err,result)=>{
            if (err) throw err;
            let user=result[0];
            res.render("delete.ejs",{user});
        });
    }
    catch(err){
        console.log(err);
        res.send("Some err With DB");
    }
    
});

app.delete("/user/:id",(req,res)=>{
    let {id}=req.params;
    let {password}=req.body;
    let q=`SELECT * FROM anshu WHERE id='${id}'`;
    try{
        connection.query(q,(err,result)=>{
            if(err) throw err;
            let user=result[0];
            if(password!=user.password){

               // prompt("Entered Wrong password!")
             res.send("Entered Wrong password");
            }
            else{
                let q2=`DELETE FROM anshu WHERE id='${id}'`;
                connection.query(q2,(err,result)=>{
                    if (err) throw err;
                    res.redirect("/user");
                })
            }
        })
    }
    catch(err){
        res.send("Some err in DB");
    }
})
app.listen("8080",()=>{
    console.log("App listening to the port")
})



// console.log(randomUser());

