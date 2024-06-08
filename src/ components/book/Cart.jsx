import React, { useEffect, useState } from 'react'
import {app} from '../../firebaseInit'
import { getDatabase, onValue, ref, remove } from 'firebase/database'
import {Button, Table} from 'react-bootstrap'

const Cart = () => {

  // db 사용하기
  const uid = sessionStorage.getItem('uid');
  const db = getDatabase(app);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
    

  const callAPI = () => {
    setLoading(true);
    onValue(ref(db, `cart/${uid}`), snapshot=>{
        const rows = [];
        snapshot.forEach(row=>{
            rows.push({...row.val()});
        });
        setBooks(rows);
        setLoading(false);
    });
    
  }

  const onClickDelete = (book) => {
      if(window.confirm(`${book.title} \n 삭제하나?`)){
        //삭제
        remove(ref(db, `cart/${uid}/${book.isbn}`));
      }
  }
  useEffect(()=>{
    callAPI();
  }, []);

  if (loading) return <h1 className='my=5'>로딩중이다</h1>
  return (
    <div>
        <h1 className='my-5'>장바구니</h1>
        <Table >
          <thead>
            <tr>
              <td colSpan={2}>도서 제목</td>
              <td>가격</td>
              <td>저자</td>
              <td>삭제</td>
            </tr>
          </thead>
          <tbody>
            {books.map(book=>
                <tr key={book.isbn}>
                    <td><img src={book.thumbnail} width="50px"/></td>
                    <td>{book.title}</td>
                    <td>{book.price}</td>
                    <td>{book.authors}</td>
                    <td className='text-center'><Button variant='danger' className='btn-sm' onClick={()=>onClickDelete(book)}>삭제</Button></td>
                </tr>
            )}
          </tbody>
        </Table>
    </div>
  )
}

export default Cart
