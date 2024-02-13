
import {GetCharacter, GetCharacters, Search} from './APIs/Api.js'
import './App.css';
import searchLogo from './searchLogo.svg'
import Back from './Back.svg'
import img_not_found from './image_not_found.jpg'


import React, { useState } from 'react';

/*
 * A customized component that is used to display the characters' image
 */
function CharacterImageComponent({initialImageUrl, id}) {
  // State to hold the current image URL
  const [imageUrl, setImageUrl] = useState(initialImageUrl);

  // Handler for image load error
  const handleError = () => {
    // Image not found with the url retrieved from the API get request
    setImageUrl(img_not_found); // Set to fallback URL on error
  };

  return (
    <img src={imageUrl} alt={id} id={id} className="icon" onError={handleError}/>
  );
}


export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [characters, setCharacters] = useState([]); 
  const [keywords, setKeyWords] = useState("");
  const [selected, setSelected] = useState([]);
  const [confirmedGK, setConfirmedGK] = useState("");
  const [confirmedST, setConfirmedST] = useState("");
  const [confirmedMD, setConfirmedMD] = useState("");
  const [confirmedDF, setConfirmedDF] = useState("");
  const [confirmedAdd, setConfirmedAdd] = useState("");
  const [confirmedGKName, setConfirmedGKName] = useState("");
  const [confirmedSTName, setConfirmedSTName] = useState("");
  const [confirmedMDName, setConfirmedMDName] = useState("");
  const [confirmedDFName, setConfirmedDFName] = useState("");
  const [confirmedAddName, setConfirmedAddName] = useState("");
  const [characterId, setCharacterId] = useState(0);
  const [characterName, setCharacterName] = useState("");
  const [characterUrl, setCharacterUrl] = useState("");
  const [position, setPosition] = useState('');

  const [selectGK, setSelecteGK] = useState(false);
  const [selectST, setSelecteST] = useState(false);
  const [selectMD, setSelecteMD] = useState(false);
  const [selectDF, setSelecteDF] = useState(false);
  const [selectAdd, setSelecteAdd] = useState(false);



  const OrganizeData = async (res) => {
    var result = [];  // Each row of the table 
    var element = [];// Elements of each row
    for (var i = 0; i < res.length; i++) {
      element.push(
        <div key={i} className="characters">
          <button type="button" className="characters-option" onClick={OpenDetail}>
            <div className="characters-option-name" id={res[i].id}>{res[i].name}</div>
            <div className="characters-option-image"><CharacterImageComponent initialImageUrl={res[i].image} id={res[i].id}/></div>
          </button>
        </div>);
    if (i % 5 === 4||i === res.length - 1) {
      result.push(<>{element}</>);
      element = [];
    }}
    
    return result
  }
  const FetchData = async () => {
    try {
      setIsLoading(true);
      const res = await GetCharacters();
      const result = await OrganizeData(res);
      setCharacters(<>{result}</>);
    } catch(e) {
      console.log("Error: " + e.status)
      setCharacters(<h1>Service not available at the moment</h1>);
    } finally {
      setIsLoading(false);
    }
  }

  const OpenCharacterList = (event) => {
    FetchData();
    let pos;
    // Check if the event target itself is the image
    if (event.target.tagName === 'IMG' || event.target.tagName === 'BUTTON' ) {
      pos = event.target.id;
    }

    if (pos === "GK") { setSelecteGK(true); }
    else if (pos === "ST") { setSelecteST(true); }
    else if (pos === "MD") { setSelecteMD(true); }
    else if (pos === "DF") { setSelecteDF(true); }
    else if (pos === "Add") { setSelecteAdd(true); }
    document.getElementById("overlay").style.height = "100%";
    document.getElementById("overlay").style.visibility = "visible";
  }
  const CloseCharacterList = () => {
    document.getElementById("overlay").style.height = "0%";
    document.getElementById("overlay").style.visibility = "hidden";
    document.getElementById("keywords").value = "";
    setSelecteGK(false);
    setSelecteST(false);
    setSelecteMD(false);
    setSelecteDF(false);
    setSelecteAdd(false);
  }
  const SearchCharacter = async () => {
    try{
      setIsLoading(true);
      const res = keywords? await Search(keywords) : await GetCharacters();
      const result = await OrganizeData(res);
      if (result.length > 0) {
        setCharacters(<>{result}</>);
      } else {
        setCharacters(<>No such character, Please try other keywords</>)
      }
      
    } catch(e) {
      console.log("Error: " + e.status)
      setCharacters(<h1>Service not available at the moment</h1>);
    } finally {
      setIsLoading(false);
    }

  }

  const OpenDetail = async (event) => {
    document.getElementById("overlay-2").style.height = "100%";
    document.getElementById("overlay-2").style.visibility = "visible";
    let imageId;
    try {
      setIsLoading2(true); 
      // Check if the event target itself is the image
      if (event.target.tagName === 'IMG' || event.target.tagName === 'DIV' ) {
        imageId = event.target.id;
      } 
      else {
        // If the button itself was clicked, find the image child
        const image = event.target.querySelector('img');
        if (image) {
          imageId = image.id;
          setCharacterId(imageId);
        }
      }
      const result = await GetCharacter(imageId);
      console.log(result)
      setSelected(
      <>
        <CharacterImageComponent initialImageUrl={result[0].image} id={position}/>
        <div className='name'>{result[0].name}</div>
        <div className='description'>{result[0].description}</div>
      </>);
      setCharacterName(result[0].name);
      setCharacterUrl(result[0].image);

    } catch(e) {
      console.log('Error:', e);
    }
    setIsLoading2(false);

  }
  const CloseDetail = async (event) => {
    document.getElementById("overlay-2").style.height = "0";
    document.getElementById("overlay-2").style.visibility = "hidden";
    try {
      if (event.target.id === "confirm"){
        if (selectGK) { 
          console.log(characterUrl)
          setConfirmedGK(characterUrl)
          setConfirmedGKName(characterName)
        }
        else if (selectST) { 
          setConfirmedST(characterUrl)
          setConfirmedSTName(characterName)
        }
        else if (selectMD) { 
          setConfirmedMD(characterUrl)
          setConfirmedMDName(characterName)
        }
        else if (selectDF) { 
          setConfirmedDF(characterUrl)
          setConfirmedDFName(characterName)
        }
        else if (selectAdd) { 
          setConfirmedAdd(characterUrl)
          setConfirmedAddName(characterName)
        }
        setCharacterUrl("");
        setCharacterName("");  
      }
    } catch(e) {

    }
  }

  
  return (
    <div>
      <header style={{ minHeight: "10vh", minWidth:"100vw" }}>
        <h1>Marvel Soccer Team</h1>
      </header>
      <div className="parent" style={{ minHeight: "90vh", minWidth:"100vw" }}>
        <h2>Create your best 5-aside Marvel soccer team and share it with the world</h2>
        <div className="selection-container">
          <button className="selection" type="button" id="GK" onClick={OpenCharacterList}>
            { confirmedGKName === ""? "GK"
            : <div id="GK">
                <div className='name' id="GK">{confirmedGKName}</div>
                <div><CharacterImageComponent initialImageUrl={confirmedGK} id="GK"/></div>
              </div>}
          </button>
          <button className="selection" type="button" id="ST" onClick={OpenCharacterList}>
            { confirmedSTName === ""? "ST"
            : <div id="ST">
                <div className='name' id="ST">{confirmedSTName}</div>
                <div><CharacterImageComponent initialImageUrl={confirmedST} id="ST"/></div>
              </div>}
          </button>
          <button className="selection" type="button" id="MD" onClick={OpenCharacterList}>
            { confirmedMDName === ""? "MD"
            : <div id="MD">
                <div className='name' id="MD">{confirmedMDName}</div>
                <div><CharacterImageComponent initialImageUrl={confirmedMD} id="MD"/></div>
              </div>}
          </button>
          <button className="selection" type="button" id="DF" onClick={OpenCharacterList}>
            { confirmedDFName === ""? "DF"
            : <div id="DF">
              <div className='name' id="DF">{confirmedDFName}</div>
              <div><CharacterImageComponent initialImageUrl={confirmedDF} id="DF"/></div>
              </div>}
          </button>
          <button className="selection" type="button" id="Add" onClick={OpenCharacterList}>
            { confirmedAddName === ""? "Additonal"
            : <div id="Add">
                <div className='name' id="Add">{confirmedAddName}</div>
                <div><CharacterImageComponent initialImageUrl={confirmedAdd} id="Add"/></div>
              </div>}
          </button> 
        </div>
        
        <div id="overlay">
          <div className="search-bar-container">
            <input
              type="text"
              placeholder="Search" 
              id="keywords"
              className="search"
              onChange = {(e) => {setKeyWords(e.target.value)}}
            />
            <input type="image" className="search-button" src={searchLogo} onClick={SearchCharacter}/>
          </div>
          
          <div className='characters-container'>
            {isLoading?<div className="Loading">Loading</div>:characters}
          </div>
          <div className="back-logo-container"><button id="back" type="button" onClick={CloseCharacterList}><img className="back-logo" src={Back}></img></button></div>
        </div>

        <div id="overlay-2">
          <div className="detail-container">
            {isLoading2? <div className="Loading">Loading</div>:selected}
            
          </div>
          <div className="button-container">
            <button id="confirm" type="button" onClick={CloseDetail}>confirm</button>
            <button id="exit-2" type="button" onClick={CloseDetail}>cancel</button>
          </div>
        </div>
        
      </div>
    </div>
  );
          
}
