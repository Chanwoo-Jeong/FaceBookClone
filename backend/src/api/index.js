const express = require("express");
const router = express.Router();
const mysql = require("./maria");
// /api/login POST 데이터를 전달 받는다.
router.post("/login", async (req, res) => {
  // console.log("=================> [POST]/api/login call!!!")

  console.log(req.body);

  const { userid, password } = req.body;

  // mysql.selectUsers("",(result)=>{
  //   console.log(result)
  // })

  const results = await mysql.findUser(req.body);
  console.log(results);

  if (results && results.length > 0) {
    res.send({ result: "success" });
  } else {
    res.send({ result: "fail" });
  }
});

// /api/login POST 데이터를 전달 받는다.
router.post("/regist", async (req, res) => {
  // console.log("=================> [POST]/api/regist call!!!")
  console.log(req.body);

  // 사용자 아이디 중복체크
  const user = await mysql.checkUser(req.body);
  console.log(user);
  if (user && user.length > 0) {
    // 중복되었을 경우
    res.send({ result: "dup-userid" });
  } else {
    // 중복되지 않은 경우만 회원가입 성공
    const results = await mysql.insertUser(req.body);
    console.log(results);

    if (results) {
      res.send({ result: "success" });
    } else {
      res.send({ result: "fail" });
    }
  }
});

router.get("/identify", async (req, res) => {
  // console.log("================> [GET]/api/identify call!!!")

  const { email } = req.query;

  const user = await mysql.findAccountid({ email });

  // console.log(user.userId);

  if (user) {
    res.send({ result: user.userId });
  } else {
    res.send({ result: "fail", text: "계정이 존재하지 않습니다." });
  }

  // if (email == "sentron@email.com") {
  //   res.send({ result: "sentron" });
  // } else if (email === "aaa@email.com") {
  //   res.send({ result: "aaa123" });
  // } else if (email === "bbb@email.com") {
  //   res.send({ result: "bbb123" });
  // } else {
  //   res.send({ result: "fail", text: "계정이 존재하지 않습니다." });
  // }

});

router.delete("/user", async(req, res) => {
  // console.log("===============> [DELETE]/api/user call!!!")

  const { userid , email } = req.query;

  const results =  await mysql.deleteUser(req.query)
  console.log(results)

  if(results){
    res.send({result:"success"})
  } else {
    res.send({result:"fail"})
  }
  // if (email === "sentron@email.com" && userid === "sentron") {
  //   res.send({ result: "success" });
  // } else {
  //   res.send({ result: "fail" });
  // }
});

// const array = [
//   {
//     no: 1,
//     title: "에듀윌",
//     subtitle: "🚨기간한정 특별 이벤트🚨 초시생 필수템, 만화입문서 무료배포!",
//     tags: "#합격자수1위 #에듀윌 #공인중개사",
//     url: "EDUWILL.NET",
//     text: "입문교재 선착순 무료신청☞ 합격자 수 1위 에듀윌 공인중개사",
//     image: "/images/game-1.jpg",
//     likecount: 1,
//   },
//   {
//     no: 2,
//     title: "코리아아이티",
//     subtitle: "🚨기간한정 특별 이벤트🚨 프론트엔드 5개월차 수업!",
//     tags: "#합격자수1위 #코리아아이티 #프론트엔드",
//     url: "KOREATIT.NET",
//     text: "녹화 동영상 무료 제공!☞ 합격자 수 1위 에듀윌 공인중개사",
//     image: "/images/game-2.jpg",
//     likecount: 2,
//   },
// ];

router.get("/home", async(req, res) => {
  // console.log("=============> [GET]/api/home call!!!")

  const results = await mysql.selectHome()

  res.send({ result: results });
});

router.put("/home/like", async(req, res) => {
  // console.log("=============> [PUT]/api/home/like call!!!")

  const { no, like } = req.body;
  // const data = array.find((item) => item.no === no);
  // data.likecount = Number(data.likecount) + Number(like);

  // 1. 첫번째 likecount 를 업데이트 하는 코드
  await mysql.updateLike(req.body)
  // 2. 업데이트한 데이터를 설렉트한 코드
  const item = await mysql.findHome(req.body)

  res.send({ result: item });
});

router.post("/saveComment", async(req, res) => {
  console.log(req.body)
  const results = await mysql.saveComment(req.body)
  res.send({ result: results });
});

router.get("/getComment", async(req, res) => {
  console.log(req.query)
  const results = await mysql.getComment(req.query)
  res.send({ result: results });
});

router.delete("/deleteComment", async(req, res) => {
  console.log(req.query)
  const results = await mysql.deleteComment(req.query)
  res.send({ result: results });
});

router.get("/getParticularComment", async(req, res) => {
  console.log(req.query)
  const results = await mysql.getParticularComment(req.query)
  res.send({ result: results });
});

router.put("/EditComment", async(req, res) => {
  console.log(req.body)
  const results = await mysql.EditComment(req.body)
  res.send({ result: results });
});

// 게시판 목록 조회
router.get('/board', async (req, res) => {
  console.log('board');
  const array = await mysql.selectBoard(req.query);
  res.send({ result: array });
});

// 게시판 항목 조회
router.get('/board/item', async (req, res) => {
  const item = await mysql.selectBoardItem(req.query);
  res.send({ result: item });
});

// 게시판 항목 편집
router.put('/board/item', async (req, res) => {
  await mysql.updateBoard(req.body);
  res.send({ result: 'success' });
});

// 게시판 항목 삭제
router.delete('/board/item', async (req, res) => {
  await mysql.deleteBoard(req.query);
  res.send({ result: 'success' });
});

// 게시판 항목 삽입
router.post('/board/item', async (req, res) => {
  await mysql.insertBoard(req.body);
  res.send({ result: 'success' });
});

module.exports = router;
