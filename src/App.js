
import {GetCharacter, GetCharacters, Search} from './APIs/Api.js'
import './App.css';
import searchLogo from './searchLogo.svg'
import Back from './Back.svg'


import React, { useState } from 'react';


export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [characters, setCharacters] = useState([]); 
  const [keywords, setKeyWords] = useState("");
  const [selected, setSelected] = useState([]);
  const [confirmedGK, setConfirmedGK] = useState([]);
  const [confirmedST, setConfirmedST] = useState("");
  const [confirmedMD, setConfirmedMD] = useState("");
  const [confirmedDF, setConfirmedDF] = useState("");
  const [confirmedAdd, setConfirmedAdd] = useState("");
  const [confirmedGKName, setConfirmedGKName] = useState(false);
  const [confirmedSTName, setConfirmedSTName] = useState(false);
  const [confirmedMDName, setConfirmedMDName] = useState(false);
  const [confirmedDFName, setConfirmedDFName] = useState(false);
  const [confirmedAddName, setConfirmedAddName] = useState(false);
  const [characterName, setCharacterName] = useState("");
  const [characterUrl, setCharacterUrl] = useState("");

  const [selectGK, setSelecteGK] = useState(false);
  const [selectST, setSelecteST] = useState(false);
  const [selectMD, setSelecteMD] = useState(false);
  const [selectDF, setSelecteDF] = useState(false);
  const [selectAdd, setSelecteAdd] = useState(false);


  /*
   * Function to organize the retrieved data and rearrange them
   */
  const OrganizeData = async (res) => {
    var result = [];  // Each row of the table 
    var element = [];// Elements of each row
    for (var i = 0; i < res.length; i++) {
      element.push(
        <div key={i} className="characters">
          <button type="button" className="characters-option" onClick={OpenDetail}>
            <div className="characters-option-name" id={res[i].id}>{res[i].name}</div>
            <div className="characters-option-image"><img src={res[i].image} alt={res[i].name} id={res[i].id} className="icon" /></div>
          </button>
        </div>);
    if (i % 5 === 4||i === res.length - 1) {
      result.push(<>{element}</>);
      element = [];
    }}
    
    return result
  }

  /*
   * Function to fetch random characters
   */
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

  /**
   * Listen and handle to a click event and open an overlay which contains a list of characters with their names and images 
   * This overlay is opened when user click any position on the first page
   * @param event - click event
   */
  const OpenCharacterList = (event) => {

    // Search random characters at first
    FetchData();

    let pos;
    /*
     * Determine the role/position of the selected button
     */
    if (event.target.tagName === 'IMG' || event.target.tagName === 'BUTTON' ) {
      pos = event.target.id;
    }
    // determine which role is the user selecting now
    if (pos === "GK") { setSelecteGK(true); }
    else if (pos === "ST") { setSelecteST(true); }
    else if (pos === "MD") { setSelecteMD(true); }
    else if (pos === "DF") { setSelecteDF(true); }
    else if (pos === "Add") { setSelecteAdd(true); }

    document.getElementById("overlay").style.height = "100%";
    document.getElementById("overlay").style.visibility = "visible";
  }

  /*
   * Close the character list overlay
   */
  const CloseCharacterList = () => {
    document.getElementById("overlay").style.height = "0%";
    document.getElementById("overlay").style.visibility = "hidden";
    document.getElementById("keywords").value = "";

    // User has finished this selection
    setSelecteGK(false);
    setSelecteST(false);
    setSelecteMD(false);
    setSelecteDF(false);
    setSelecteAdd(false);
  }

  /**
   * Function to search characters with the keywords in the searching bar
   * @param event - click event (press the searching button)
   */
  const SearchCharacter = async (event) => {
    try{
      event.preventDefault();
      setIsLoading(true); // Searching now
      
      const res = keywords? await Search(keywords) : await GetCharacters(); // if the searching bar is empty, search some random characters
      const result = await OrganizeData(res);

      // received valid result
      if (result.length > 0) {
        setCharacters(<>{result}</>);
      } else {
        setCharacters(<>No such character, Please try other keywords</>)
      }
      
    } catch(e) {
      console.log("Error: " + e.status)
      setCharacters(<h1>Service not available at the moment</h1>);
    } finally {
      setIsLoading(false); // finished searching
    }

  }
  /**
   * Listen and handle to a click event and open an overlay which contains the name, description and an image of the selected character 
   * @param event - click event
   */
  const OpenDetail = async (event) => {
    document.getElementById("overlay-2").style.height = "100%";
    document.getElementById("overlay-2").style.visibility = "visible";
    let imageId;
    try {
      setIsLoading2(true); // Searching the detail for the selected character

      /*
       * Determine the id of the selected character
       */
      if (event.target.tagName === 'IMG' || event.target.tagName === 'DIV' ) {
        imageId = event.target.id;
      } 
      else {
        // If the button itself was clicked, find the image child
        const image = event.target.querySelector('img');
        if (image) {
          imageId = image.id;
        }
      }


      const result = await GetCharacter(imageId);
      console.log(result)
      setSelected(
      <>
        <img className="icon" src={result[0].image} alt={result[0].name}/>
        <div className='name'>{result[0].name}</div>
        <div className='description'>{result[0].description}</div>
      </>);
      setCharacterName(result[0].name);
      setCharacterUrl(result[0].image);

    } catch(e) {
      console.log('Error:', e);
    }
    setIsLoading2(false); // Finished searching

  }
  /**
   * Close the character detail overlay with confirm/cancel button
   * if confirm button is clicked, the selected character will be displayed on button of the first page accordingly, and close the character detail overlay
   * if cancel button is clicked, close the character detail overlay
   * 
   * @param event - click event
   */
  const CloseDetail = async (event) => {
    document.getElementById("overlay-2").style.height = "0";
    document.getElementById("overlay-2").style.visibility = "hidden";
    try {
      if (event.target.id === "confirm"){
        if (selectGK) { 
          setConfirmedGKName(true)
          setConfirmedGK(
          <div key="GK" id="GK">
            <div className='name' id="GK">{characterName}</div>
            <div><img src={characterUrl} alt={characterName} id="GK"/></div>
          </div>)
        }
        else if (selectST) {           
          setConfirmedSTName(true)
          setConfirmedST(
          <div key="ST" id="ST">
            <div className='name' id="ST">{characterName}</div>
            <div><img src={characterUrl} alt={characterName} id="ST"/></div>
          </div>)
        }
        else if (selectMD) { 
          setConfirmedMDName(true)
          setConfirmedMD(
          <div key="GK" id="GK">
            <div className='name' id="GK">{characterName}</div>
            <div><img src={characterUrl} alt={characterName} id="GK"/></div>
          </div>)
        }
        else if (selectDF) { 
          setConfirmedDFName(true)
          setConfirmedDF(
          <div key="DF" id="DF">
            <div className='name' id="DF">{characterName}</div>
            <div><img src={characterUrl} alt={characterName} id="DF"/></div>
          </div>)
        }
        else if (selectAdd) { 
          setConfirmedAddName(true)
          setConfirmedAdd(
          <div key="Add" id="Add">
            <div className='name' id="Add">{characterName}</div>
            <div><img src={characterUrl} alt={characterName} id="Add"/></div>
          </div>)
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
        <h2>Create your best 5-aside Marvel soccer team and share it with the world</h2>
      </header>
      <div className="parent" style={{ minHeight: "90vh", minWidth:"100vw" }}>
        <div className="selection-container">
          {/* Goal keeper */}
          <button className="selection" type="button" id="GK" onClick={OpenCharacterList}>
            { confirmedGKName? confirmedGK : <div><div className='name'>GK</div></div>}
          </button>
          {/* Striker */}
          <button className="selection" type="button" id="ST" onClick={OpenCharacterList}>
            { confirmedSTName? confirmedST : <div><div className='name'>ST</div></div>}
          </button>
          {/* Midfielder */}
          <button className="selection" type="button" id="MD" onClick={OpenCharacterList}>
            { confirmedMDName? confirmedMD : <div><div className='name'>MD</div></div>}
          </button>
          {/* Defender */}
          <button className="selection" type="button" id="DF" onClick={OpenCharacterList}>
            { confirmedDFName? confirmedDF : <div><div className='name'>DF</div></div>}
          </button>
          {/* Additional player */}
          <button className="selection" type="button" id="Add" onClick={OpenCharacterList}>
            { confirmedAddName? confirmedAdd : <div><div className='name'>Additional</div></div>}
          </button> 
        </div>
        
        <h2>GK - Goal keeper</h2>
        <h2>ST - Strike</h2>
        <h2>MD - Midfielder</h2>
        <h2>DF - Defender</h2>
        <h2>Additional - Additional player for any outfield spot (ST, MD or DF)</h2>
        

        {/* First overlay - the character list and searching bar */}
        <div id="overlay">
          {/* Searching bar */}
          <div className="search-bar-container">
            {/* Text input */}
            <input
              type="text"
              placeholder="Search" 
              id="keywords"
              className="search"
              onChange = {(e) => {setKeyWords(e.target.value)}}
            />
            {/* Search button */}
            <input type="image" alt="search-button" className="search-button" src={searchLogo} onClick={SearchCharacter}/>
          </div>
          {/* Character list */}
          <div className='characters-container'>
            {isLoading?<div className="Loading">Loading</div>:characters}
          </div>
          {/* Back button - back to the first page */}
          <div className="back-logo-container"><button id="back" type="button" onClick={CloseCharacterList}><img className="back-logo" alt="back-button" src={Back}></img></button></div>
        </div>

        {/* Second overlay displaying the detail of the selected character - name, description, image */}
        <div id="overlay-2">
          <div className="detail-container">
            {isLoading2? <div className="Loading">Loading</div>:selected}
            
          </div>
          <div className="button-container">
            {/* Confirm button - confirm the selection */}
            <button id="confirm" type="button" onClick={CloseDetail}>confirm</button>
            {/* Cancel button - cancel the selection */}
            <button id="exit-2" type="button" onClick={CloseDetail}>cancel</button>
          </div>
        </div>
        
      </div>
    </div>
  );
          
}
