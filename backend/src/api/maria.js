const mysql = require("mysql");
const moment = require('moment');


const conn = {
  host: "127.0.0.1",
  port: "3306",
  user: "root",
  password: "970304",
  database: "facebook",
};

const Maria = {};

const queryFunc = (sql) => {
  return new Promise((resolve, reject) => {
    //1. DB 커넥션
    const connection = mysql.createConnection(conn);
    //2. DB 접속시작
    connection.connect();
    connection.query(sql, (err, results) => {
      if (err) {
        console.trace(err);
        reject(err);
      } else {
        // 4. DB연결 종료
        connection.end();
        console.log(results);
        resolve(results);
      }
    });
  });
};

Maria.selectUsers = (param, callback) => {
  return new Promise(async (resolve) => {
    const sql = "select * from users";
    const result = await queryFunc(sql);
    resolve(result);
  });
};

Maria.findUser = (params) => {
  return new Promise(async (resolve) => {
    const { userid, password } = params;
    const sql = `select * from users where userid="${userid}" and password="${password}"`;
    const result = await queryFunc(sql);
    resolve(result);
  });
};

Maria.insertUser = (params) => {
  return new Promise(async (resolve) => {
    const { userid, password, email, year, month, day, gender } = params;
    const birthday = year + month + day;
    const sql = `insert into users (userid,password,email,birthday,gender,updatetime,createtime) values ('${userid}','${password}','${email}','${birthday}','${gender}',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP );`;
    const result = await queryFunc(sql);
    resolve(result);
  });
};

Maria.checkUser = (params) => {
  return new Promise(async (resolve) => {
    const { userid } = params;
    const sql = `select * from users where userid='${userid}'`;
    const result = await queryFunc(sql);
    resolve(result);
  });
};

Maria.findAccountid = (params) => {
  return new Promise(async (resolve) => {
    const { email } = params;
    const sql = `select * from users where email='${email}'`;
    const result = await queryFunc(sql);
    resolve(result && result[0] ? result[0] : null);
  });
};

Maria.deleteUser = (params) => {
  return new Promise(async (resolve) => {
    const { userid, email } = params;
    const sql = `delete from users where userid='${userid}' and email='${email}'`;
    const result = await queryFunc(sql);
    resolve(results && results.affectedRows > 0 ? true : false);
  });
};

Maria.selectHome = (params) => {
  return new Promise(async (resolve) => {
    const sql = "select * from home";
    const result = await queryFunc(sql);
    resolve(result);
  });
};

Maria.updateLike = (params) => {
  return new Promise(async (resolve) => {
    const { likecount, homeid } = params;
    const sql = `update home set likecount="${
      likecount + 1
    }" where homeid='${homeid}'`;
    const result = await queryFunc(sql);
    resolve(result);
  });
};

Maria.findHome = (params) => {
  return new Promise(async (resolve) => {
    const { homeid } = params;
    const sql = `select * from home where homeid='${homeid}'`;
    const result = await queryFunc(sql);
    resolve(result);
  });
};

Maria.saveComment = (params) => {
  return new Promise(async (resolve) => {
    const { homeid, comment } = params;
    console.log(homeid, comment);
    const sql = `insert into comment (homeid,text) values ('${homeid}','${comment}' );`;
    const result = await queryFunc(sql);
    resolve(result);
  });
};

Maria.getComment = (params) => {
  return new Promise(async (resolve) => {
    const { homeid } = params;
    console.log(homeid);
    const sql = `select * from comment where homeid='${homeid}';`;
    const result = await queryFunc(sql);
    resolve(result);
  });
};

Maria.deleteComment = (params) => {
  return new Promise(async (resolve) => {
    const { cmtid }  = params;
    console.log(cmtid);
    const sql = `delete from comment where cmtid='${cmtid}';`;
    const result = await queryFunc(sql);
    resolve(result);
  });
};

Maria.getParticularComment = (params) => {
  return new Promise(async (resolve) => {
    const { cmtid }  = params;
    console.log(cmtid);
    const sql = `select * from comment where cmtid='${cmtid}';`;
    const result = await queryFunc(sql);
    resolve(result);
  });
};

Maria.EditComment = (params) => {
  return new Promise(async (resolve) => {
    const { cmtid , text }  = params;
    console.log(cmtid);
    const sql = `update comment set text='${text}' where cmtid='${cmtid}';`;
    const result = await queryFunc(sql);
    resolve(result);
  });
};


// 게시판 목록 조회
Maria.selectBoard = (params) => {
  return new Promise(async (resolve) => {
      const sql = `select * from board`;
      const result = await queryFunc(sql);
      console.log(result);
      resolve(result);
  });
};

// 게시판 항목 조회
Maria.selectBoardItem = (params) => {
  return new Promise(async (resolve) => {
      const { boardid } = params;
      const sql = `select * from board where boardid="${boardid}"`;
      const result = await queryFunc(sql);
      resolve(result && result[0]);
  });
};

// 게시판 항목 삽입
Maria.insertBoard = (params) => {
  return new Promise(async (resolve) => {
      const { title, text } = params;
      const today = moment().format('YYYY-MM-DD');
      const sql = `insert into board (title, text, regdate) values('${title}', '${text}', '${today}');`;
      const result = await queryFunc(sql);
      resolve(result);
  });
};

// 게시판 항목 삭제
Maria.deleteBoard = (params) => {
  return new Promise(async (resolve) => {
      const { boardid } = params;
      const sql = `delete from board where boardid="${boardid}";`;
      const result = await queryFunc(sql);
      resolve(result);
  });
};

// 게시판 항목 편집
Maria.updateBoard = (params) => {
  return new Promise(async (resolve) => {
      const { boardid, text, title } = params;
      console.log(params);
      const sql = `update board set text='${text}', title='${title}' where boardid="${boardid}";`;
      const result = await queryFunc(sql);
      resolve(result);
  });
};
module.exports = Maria;
