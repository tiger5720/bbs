import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Table , Row, Col, InputGroup, Form, Button} from 'react-bootstrap';
import {app} from '../../firebaseInit';
import {getDatabase, ref, get, set} from 'firebase/database';
import { useNavigate } from 'react-router-dom';

const Locals = () => {
    const navi = useNavigate();
    const db = getDatabase(app);
    const uid = sessionStorage.getItem('uid');

    const [query, setQuery] = useState('원피스');
    const [page, setPage] = useState(1);
    const [is_end, setIs_end] = useState(false);
    const [loading, setLoading] = useState(false);
    const [locals, setLocals] = useState([]);

    const callAPI = async() => {
        setLoading(true);
        const url = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${query}&size=10&page=${page}`;
        const config = {
        headers:{"Authorization":"KakaoAK 1973a89214091a2dbfa2ddeefd9c8fb0"}
        };
        const res = await axios.get(url, config);
        setLocals(res.data.documents);
        setLoading(false);
        setIs_end(res.data.meta.is_end);
    }

    const onSubmit = (e) => {
        e.preventDefault();
        if(query==="") {
            alert("검색어 입력해라");
        }
        else {
            callAPI();
        }
    }

    const onClickFavorite = async(local) => {
        if(!uid){
            sessionStorage.setItem('target', '/locals');
            navi('/login');
            return;
        }
        if(window.confirm("즐겨찾기 추가하실?")){
            setLoading(true);
            await get(ref(db, `favorite/${uid}/${local.id}`)).then(async snapshot=>{
                if(snapshot.exists()){
                    alert("즐겨찾기 이미 등록됨요");
                }
                else{
                    await set(ref(db, `favorite/${uid}/${local.id}`), local);
                    alert("즐겨찾기 등록완료다");
                }
            });
            setLoading(false);
        }
    }

    useEffect(()=>{callAPI()}, [page]);

    if(loading) return <h1 className='my-5'>로딩중이다</h1>
    return (
        <div>
            <h1 className='my-5'>지역검색</h1>
            <Row className='mb-2'>
                <Col xs={8} md={6} lg={4}>
                    <form onSubmit={onSubmit}> 
                        <InputGroup>
                            <Form.Control value={query} onChange={(e)=>setQuery(e.target.value)}/>
                            <Button type='submit' className='btn btn-warning'>검색</Button>
                        </InputGroup>
                     </form>
                </Col>
            </Row>
            <Table striped bordered hover>
                <thead>
                    <tr className='text-center'>
                        <td>ID</td>
                        <td>장소명</td>
                        <td>주소</td>
                        <td>전화 번호</td>
                        <td>즐겨찾기</td>
                    </tr>
                </thead>
                <tbody>
                    {locals.map(local=>
                        <tr key={local.id}>
                            <td>{local.id}</td>
                            <td>{local.place_name}</td>
                            <td>{local.address_name}</td>
                            <td>{local.phone}</td>
                            <td className='text-center'><Button onClick={()=>onClickFavorite(local)}>즐겨찾기</Button></td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </div>
    )
}

export default Locals
