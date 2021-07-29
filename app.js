var express = require("express");
var app = express();
var engine = require("ejs-locals");
var bodyParser = require("body-parser");

var admin = require("firebase-admin");

var serviceAccount = require("./project-355c7-firebase-adminsdk-2lu1l-dde79518e5.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://project-355c7-default-rtdb.firebaseio.com",
});

var fireData = admin.database();
// console.log(fireData);

fireData
  .ref("todos")
  .set({
    //  title: 1234,
  })
  .then(() => {
    fireData.ref("todos").once("value", (snapshot) => {
      console.log(snapshot.val());
    });
  });

app.engine("ejs", engine);
app.set("views", "./views");
app.set("view engine", "ejs");
//增加靜態檔案的路徑
app.use(express.static("public"));

// 增加 body 解析
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//路由
app.get("/", function (req, res) {
  fireData.ref("todos").once("value", (snapshot) => {
    console.log(snapshot.val());
    let data = snapshot.val();
    //  let { title } = data;
    res.render("index", { todolist: data });
  });
});

// add logic
app.post("/addTodo", (req, res) => {
  let content = req.body.content;
  let contentRef = fireData.ref("todos").push();
  contentRef.set({ content: content }).then(() => {
    fireData.ref("todos").once("value", (snapshot) => {
      res.send({
        success: true,
        result: snapshot.val(),
        message: "資料讀取成功",
      });
    });
  });
});

// delete logic
app.post("/removeTodo", (req, res) => {
  let _id = req.body.id;
  console.log(_id);
  fireData
    .ref("todos")
    .child(_id)
    .remove()
    .then(() => {
      fireData.ref("todos").once("value", (snapshot) => {
        res.send({
          success: true,
          result: snapshot.val(),
          message: "資料刪除成功",
        });
      });
    });
});

// 監聽 port
var port = process.env.PORT || 3000;
app.listen(port);
