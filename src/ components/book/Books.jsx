import axios from 'axios';
import React, { useEffect, useState } from 'react'
import {Row, Col, Card, InputGroup, Form, Button} from 'react-bootstrap'
import { BsCart4 } from "react-icons/bs";
import { FaCartPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import {app} from '../../firebaseInit'
import {getDatabase, ref, get, set} from 'firebase/database'

const Books = () => {
  const navi = useNavigate();
  const db = getDatabase(app);
  const uid = sessionStorage.getItem('uid');
  const [query, setQuery] = useState('원피스');
  const [page, setPage] = useState(1);
  const [is_end, setIs_end] = useState(false);
  const [loading, setLoading] = useState(false);
  const [books, setBooks] = useState([]);
  const callAPI = async() => {
    setLoading(true);
    const url = `https://dapi.kakao.com/v3/search/book?target=title&query=${query}&size=12&page=${page}`;
    const config = {
      headers:{"Authorization":"KakaoAK 1973a89214091a2dbfa2ddeefd9c8fb0"}
    };
    const res = await axios.get(url, config);
    setBooks(res.data.documents);
    setLoading(false);
    setIs_end(res.data.meta.is_end);
  }

  const onSubmit = (e) => {
    // 기본 이벤트 refresh 방지 (submit눌렸을때 화면 번쩍이는 거 방지)
    e.preventDefault();
    setPage(1);
    callAPI();
}

const onClickCart = (book) => {
    if (uid) {
      //장바구니에 도서 넣기
      if(window.confirm(`${book.title}\n 도서를 장바구니 넣냐?`)){
        // 장바구니 있는건지 체크
          get(ref(db, `cart/${uid}/${book.isbn}`)).then(snapshot=>{
              if(snapshot.exists()){
                alert("장바구니 이미있다;");
              }
              else{
                set(ref(db, `cart/${uid}/${book.isbn}`), {...book});
                alert("장바구니 넣음요");
              }
          });
       
      }
    }
    else
    {
        sessionStorage.setItem('target', '/books');
        navi('/login');
    }
}

  useEffect(()=>{callAPI()}, [page]);

  if(loading) return <h1 className='my-5'>로딩중 ㅋ</h1>
  return (
    <div>
        <h1 className='my-2'>도서 검색</h1>
        <Row className='mb-2'>
          <Col xs={8} md={6} lg={4}>
            <form onSubmit={onSubmit}> 
                <InputGroup>
                    <Form.Control value={query} onChange={(e)=>setQuery(e.target.value)}/>
                    <Button type='submit'>검색</Button>
                </InputGroup>
            </form>
          </Col>
        </Row>
        <Row>
          {books.map(book=>
            <Col key={book.isbn} xs={6} md={3} lg={2} className='mb-2'>
              <Card>
                <Card.Body className='justify-content-center d-flex'>
                  <img src={book.thumbnail || 'http://via.placeholder.com/120x170'}/>
                </Card.Body>
                <Card.Footer>
                  <div className='ellipsis'>{book.title}</div>
                  <FaCartPlus style={{cursor:'pointer', fontSize:'20px', color:'blue'}} onClick={()=>onClickCart(book)}/>
                </Card.Footer>
              </Card>
            </Col>
          )}
        </Row>
        <div className='text-center my-3'>
            <Button onClick={()=>setPage(page-1)} disabled={page===1}>이전</Button>
            <span className='mx-3'>{page}</span>
            <Button onClick={()=>setPage(page+1)} disabled={is_end===true}>다음</Button>
        </div>
    </div>
  )
}

export default Books
