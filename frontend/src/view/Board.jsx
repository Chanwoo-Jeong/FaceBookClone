import axios from "axios";
import { useEffect, useState } from "react";
import Header from "./Header";

export default function Board(props) {
  const [mode, setMode] = useState("list");
  const [selected, setSelected] = useState(null);

  const onEvent = (eventid, item) => {
    console.log(item);
    setMode(eventid);
    setSelected(item);
  };

  return (
    <div>
      <Header name="board" />
      <button onClick={() => setMode("list")}>목록</button>
      <button onClick={() => setMode("view")}>조회</button>
      <button onClick={() => setMode("edit")}>편집</button>

      <section className="board-layer">
        {
          {
            list: <BoardList onEvent={onEvent} />,
            view: <BoardView onEvent={onEvent} item={selected} />,
            edit: <BoardEdit onEvent={onEvent} item={selected} />,
          }[mode]
        }
      </section>
    </div>
  );
}

//게시판 목록
const BoardList = (props) => {
  const [list, setList] = useState([
    // {
    //   boardid: 1,
    //   title: "게시판 목록1",
    //   text: "Hi Im boarding 1",
    //   regdate: "2022.01.03",
    // },
    // {
    //   boardid: 2,
    //   title: "게시판 목록2",
    //   text: "Hi Im boarding 2",
    //   regdate: "2022.01.10",
    // },
    // {
    //   boardid: 3,
    //   title: "게시판 목록3",
    //   text: "Hi Im boarding 3",
    //   regdate: "2022.01.20",
    // }
  ]);

  useEffect(() => {
    axios.get("/api/board", {}).then((res) => {
      setList(res.data.result);
    });
  }, []);

  const onClickItem = (item) => {
    console.log(item);
    props.onEvent("view", item);
  };

  const onClickNew = () => {
    props.onEvent("edit", null);
  };

  return (
    <div className="list">
      <h1>게시판 목록</h1>
      <div className="buttons">
        <button onClick={onClickNew}>추가</button>
      </div>
      {list &&
        list.map((item) => {
          return (
            <li key={item.boardid} onClick={() => onClickItem(item)}>
              <span className="title">{item.title}</span>
              <span className="date">{item.regdate}</span>
            </li>
          );
        })}
    </div>
  );
};

//게시판 조회화면
const BoardView = (props) => {
  const onClickEdit = () => {
    console.log("onClickEdit");
    props.onEvent("edit", props.item);
  };

  const onClickList = () => {
    console.log("onClickList");
    props.onEvent("list");
  };

  const onClickRemove = () => {
    console.log("onClickRemove");

    const isok = window.confirm("정말로 삭제하시겠습니까?");
    if (isok === true) {
      axios
        .delete("/api/board/item", { params: { boardid: props.item.boardid } })
        .then((res) => {
          props.onEvent("list");
        });
    }
  };
  return (
    <div className="view">
      <h1>게시판 조회</h1>
      <div className="buttons">
        <button onClick={onClickEdit}>편집</button>
        <button onClick={onClickRemove}>삭제</button>
        <button onClick={onClickList}>목록</button>
      </div>
      <div>
        <div className="head">
          <h2>{props.item.title}</h2>
          <span className="date">{props.item.regdate}</span>
        </div>
        <div className="text">
          <p>{props.item.text}</p>
        </div>
      </div>
    </div>
  );
};

//게시판 편집화면
const BoardEdit = (props) => {
  const [text, setText] = useState(props.item && props.item.text);
  const [title, setTitle] = useState(props.item && props.item.title);

  const onClickCancel = () => {
    console.log("onClickCancel");
    props.onEvent("view", props.item);
  };
  const onClickSave = () => {
    // 편집
    if (props.item && props.item.boardid) {
      axios
        .put("/api/board/item", {
          boardid: props.item.boardid,
          text: text,
          title: title,
        })
        .then((res) => {
          props.onEvent("view", { ...props.item, text: text, title: title });

          //if (props.onRefresh) props.onRefresh();
        });
    }
    // 추가
    else {
      axios
        .post("/api/board/item", { text: text, title: title })
        .then((res) => {
          // props.onEvent('view', { ...props.item, text: text, title: title });

          props.onEvent("list");

          //if (props.onRefresh) props.onRefresh();
        });
    }
  };

  const onChangeTitle = (event) => {
    setTitle(event.target.value);
};
  const onChange = (event) => {
    setText(event.target.value);
  };

  return (
    <div className="edit">
      <h1>게시판 편집</h1>
      <div className="buttons">
        <button onClick={onClickCancel}>취소</button>
        <button onClick={onClickSave}>저장</button>
      </div>

      <div>
        <div className="head">
          <input defaultValue={title} onChange={onChangeTitle}></input>
          {/* <h2>{props.item && props.item.title}</h2> */}
          <span className="date">{props.item && props.item.regdate}</span>
        </div>
        <div className="text">
          <textarea
            defaultValue={text}
            onChange={onChange}
          ></textarea>
        </div>
      </div>
    </div>
  );
};
