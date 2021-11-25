import { useState, useRef, useEffect,useCallback } from "react";
import {getBookApi} from "./services/BookApi";
import { debounce } from 'lodash';
import {CircularProgress} from "@material-ui/core";
import React from 'react'

function App() {
  const [search, setSearch] = useState('');
  const [result, setResult] = useState(false);
  const searchRef = useRef();
  const isTyping = search.replace(/\s+/, '').length > 2;

  const [isLoading, setIsLoading] = useState(false);

 const delayedQuery = useCallback(debounce(q => sendQuery(q), 500), [])

  const sendQuery =async (search)=> {

    if (search === '') return;

    try {
      await setIsLoading(true);
      let res = await getBookApi(search);
      await filterBookNameFromList(res.data.items)
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  }


  useEffect(() => {
    const inputWrapper = document.querySelector(".input-wrapper");
    if (isTyping) {
      delayedQuery(search);
    } else {
      inputWrapper.classList.remove("inpTyping");
      setResult(false);
    }
  }, [ search,delayedQuery]);




  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutSide);
    return () => {
      document.removeEventListener("mousedown", handleClickOutSide);
    };
  }, []);


  const handleClickOutSide = (e) => {
    if (!searchRef.current.contains(e.target)) {
      setSearch("");
    }
  };

  const getSelectedData = (item) => {
    setSearch(item.volumeInfo.title)
    setResult('');
  };

  const filterBookNameFromList = (item) =>{
    if (item){
      const inputWrapper = document.querySelector(".input-wrapper");
      const filteredResult = item.filter(item =>
          item.volumeInfo.title.toLocaleLowerCase().trim()
              .includes(search.toLocaleLowerCase().trim())
      )

      setResult(filteredResult.length > 0 ? filteredResult : false);
      inputWrapper.classList.add("inpTyping");
    }

  }

  const boldResult = (search, text) => {
    const s = search.toUpperCase();
    const t = text.toUpperCase();
    const x = s.indexOf(t);
    if (!t || x === -1) {
      return search;
    }
    const l = t.length;
    let p = React.createElement('p',null,
        [search.substr(0, x) ,React.createElement('b',null,search.substr(x, l)),search.substr(x + l)]
  );

    return p;
  }


  return (
    <div className="wrapper">
      <div className="search" ref={searchRef}>
        <div className="input-wrapper">
          <input
            type="text"
            value={search}
            className={isTyping ? "typing" : null}
            placeholder="Search"
            onChange={(e)=>setSearch(e.target.value)}
          />
        </div>
        {isTyping && (
          <div className="search-result">

             {isLoading ?
               <div style={{display:'flex',justifyContent:'center'}}>
                  <CircularProgress style={{color: '#424242', margin: '10px'}}/>
              </div>
                  :
                  <>
                      {result &&
                      result.map((item) => (
                          <div
                              onClick={() => getSelectedData(item)}
                              key={item.id}
                              className="search-result-item"
                          >
                              {boldResult(item.volumeInfo.title,search)}
                          </div>
                      ))}

                      {!result && (
                          <div className="result-not-found">
                              "{search} / not find.."
                          </div>
                      )}
                  </>

              }


          </div>
        )}
      </div>
    </div>
  );
}

export default App;
