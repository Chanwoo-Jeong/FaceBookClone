import { Image, Title, Subtitle, Button, Input } from "./Component";
import Header from "./Header.jsx";

import EDU_ICON from "../images/edu_icon.png";
import MORE_ICON from "../images/more.png";
import HOME_ICON from "../images/home.png";
import YOUTUBE_ICON from "../images/youtube.png";
import PEOPLE_ICON from "../images/people.png";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Home(props) {
  const [array, setArray] = useState([]);

  useEffect(() => {
    axios.get("/api/home").then((res) => {
      setArray(res.data.result);
    });
  }, []);

  const onRefreshHome = () => {
    console.log("onrefresh call");
    axios.get("/api/home").then((res) => {
      setArray(res.data.result);
    });
  };

  return (
    <>
      <Header name="home" />
      <section className="home-layer">
        <ul className="list">
          {array &&
            array.map((item, index) => {
              return (
                <CardBox
                  key={item.homeid}
                  value={item}
                  onRefresh={onRefreshHome}
                />
              );
            })}
        </ul>
      </section>
    </>
  );
}

const CardBox = (props) => {
  const { homeid, likecount, title, subtitle, tags, url, text, image } =
    props.value;

  const [commnetli, setCommentLi] = useState([]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    getComment();
  }, []);

  const getComment = () => {
    axios.get("/api/getComment", { params: { homeid: homeid } }).then((res) => {
      setCommentLi(res.data.result);
      // console.log(commnetli);
    });
  };

  const onClickLike = () => {
    // console.log(props.value)
    axios
      .put("/api/home/like", { homeid: homeid, likecount: likecount })
      .then((res) => {
        props.onRefresh();
      });
  };

  const onClickComment = () => {
    setShow(!show);
  };

  return (
    <li>
      <div className="card">
        <div className="head">
          <div>
            <Image src={EDU_ICON} alt="광고 아이콘" />
            <span className="title">{title}</span>
            <Image className="more" src={MORE_ICON} alt="더보기 메뉴" />
          </div>
          <div className="text">
            <p>{subtitle}</p>
            <p className="blue">{tags}</p>
          </div>
        </div>
        <div className="body">
          <div className="image">
            <Image src={image} alt="광고 메인 이미지" />
          </div>
          <div className="text">
            <div>
              <p className="grey sm">{url}</p>
              <p className="bold">{text}</p>
            </div>
            <button>더 알아보기</button>
          </div>
        </div>
        <div className="foot">
          <div className="btn-box active">
            <div>
              <Image src={HOME_ICON} alt="홈 바로가기" />
              <span className="btn-text" onClick={onClickLike}>
                좋아요({likecount})
              </span>
            </div>
          </div>
          <div className="btn-box">
            <div>
              <Image src={YOUTUBE_ICON} alt="동영상 바로가기" />
              <span className="btn-text" onClick={onClickComment}>
                댓글 달기
              </span>
            </div>
          </div>
          <div className="btn-box">
            <div>
              <Image src={PEOPLE_ICON} alt="사용자 바로가기" />
              <span className="btn-text">공유 하기</span>
            </div>
          </div>
        </div>
        {show === true ? (
          <CommentBox
            homeid={homeid}
            commnetli={commnetli}
            getComment={getComment}
          />
        ) : null}
      </div>
    </li>
  );
};

const CommentBox = (props) => {
  const [comment, setComment] = useState("");
  const [selectedItem, setselectedItem] = useState(null);

  const onChangeEditComment = (e) => {
    const item = { ...selectedItem };
    item.text = e.target.value;
    setselectedItem(item);
    console.log(selectedItem);
    // setEditingComment(e.target.value);
  };

  const onChangeComment = (e) => {
    setComment(e.target.value);
  };

  const EditComment = () => {
    axios
      .put("/api/EditComment", {
        cmtid: selectedItem.cmtid,
        text: selectedItem.text,
      })
      .then((res) => {
        props.getComment();
        setselectedItem(null);
      });
  };

  const onClickCommentUpdate = (item) => {
    setselectedItem(item);
  };

  const onClickCommentDelete = (cmtid) => {
    console.log(cmtid);
    axios.delete("/api/deleteComment", { params: { cmtid } }).then((res) => {
      props.getComment();
    });
    console.log("delete");
  };

  const onClickCommentSave = () => {
    if (!comment) return;
    axios
      .post("/api/saveComment", { homeid: props.homeid, comment: comment })
      .then((res) => {
        props.getComment();
      });
    setComment("");
  };

  return (
    <div className="comment-box">
      <ul className="comment-list">
        {props.commnetli.map((item) => {
          console.log(item);
          return (
            <li key={item.cmtid} className="comment-low">
              <div>{item.text}</div>
              <div className="buttons">
                <Button
                  type="secondary"
                  text="편집"
                  onClick={() => onClickCommentUpdate(item)}
                />
                <Button
                  type="primary"
                  text="삭제"
                  onClick={() => onClickCommentDelete(item.cmtid)}
                />
              </div>
            </li>
          );
        })}
      </ul>
      <div className="comment-input">
        {selectedItem ? (
          <>
            <textarea
              value={selectedItem.text}
              onChange={onChangeEditComment}
            />
            <Button
              type="primary"
              onClick={() => EditComment()}
              text="편집"
            ></Button>
          </>
        ) : (
          <>
            <textarea
              placeholder="예쁜 댓글을 달아주세요."
              value={comment}
              onChange={onChangeComment}
            />
            <Button
              type="primary"
              onClick={onClickCommentSave}
              text="저장"
            ></Button>
          </>
        )}
      </div>
    </div>
  );
};
