import axios from 'axios'
import md5 from "md5";
import timestamp from "time-stamp";

// public key
const PUB_KEY = "92387a221913641bb3041cd50a94d64d";

// private key;
const PRI_KEY = "39844d0d6aa0369233feeb891e86689985c4b308"; 

// base URL
const URL = "http://gateway.marvel.com";

// Image size
const icon = "/standard_xlarge.jpg"

/* 
 * API call - /v1/public/characters
 * Randomly pick 1 letter from 'a' to 'z' and search 20 characters with the letter 
 * Data to retrieve and save:
 *  - character ID
 *  - character name
 *  - Icon Image URL (use standard_large)
 *  
 * Store the result into a list with a format of:
 * [{ 
 *    id: character id
 *    name: character name
 *    image: character icon url
 *  }, 
 *  {}, 
 *  {}, ...]
 */

export const GetCharacters = async () => {
  /* Time stamp */
  const ts = timestamp();
  /* Hash - md5 digest of (time stamp + private key + public key) */
  const hash = md5(ts+PRI_KEY+PUB_KEY);

  let nameStartsWith = 97 + Math.floor(Math.random() * 25);
  let tempCharacters = [];  
  try {     
    await axios.get(`${URL}/v1/public/characters?nameStartsWith=${String.fromCharCode(nameStartsWith)}&apikey=${PUB_KEY}&ts=${ts}&hash=${hash}`)
    .then((res) => {
        for (let i = 0; i < res.data.data.results.length; i++) {
            tempCharacters.push({
              id: res.data.data.results[i].id,
              name: res.data.data.results[i].name,
              image: res.data.data.results[i].thumbnail.path + icon,
              status: "200"
            })
        }
    })
  } catch(e) {
    const status = e.code;
    tempCharacters.push({status: status});
  }
  return tempCharacters;
}

/* 
 * API call - /v1/public/characters
 * search characters with keywords 
 * 
 * Data to retrieve and save:
 *  - character ID
 *  - character name
 *  - Icon Image URL (use standard_large)
 *  
 * Store the result into a list with a format of:
 * [{ 
 *    id: character id
 *    name: character name
 *    image: character icon url 
 *  }, 
 *  {}, 
 *  {}, ...]
 */
export const Search = async (name) => {
  /* Time stamp */
  const ts = timestamp();
  /* Hash - md5 digest of (time stamp + private key + public key) */
  const hash = md5(ts+PRI_KEY+PUB_KEY);
  
  let tempCharacter = [];
  try {
    await axios.get(`${URL}/v1/public/characters?nameStartsWith=${name}&limit=100&apikey=${PUB_KEY}&ts=${ts}&hash=${hash}`)
    .then((res) => {
      for (let i = 0; i < res.data.data.results.length; i++) { 
        tempCharacter.push({
          id: res.data.data.results[i].id,
          name: res.data.data.results[i].name,
          image: res.data.data.results[i].thumbnail.path + icon,
          status: "200"
        });
      }
    })
    } catch(e) {
      const status = e.code;
      tempCharacter.push({status: status});
    }
    return tempCharacter;
}

/* 
 * API call - /v1/public/characters/{characterId}
 * search characters with characterId 
 * 
 * Data to retrieve and save:
 *  - character ID
 *  - character name
 *  - Description
 *  - Icon Image URL (use standard_large)
 *  
 * Store the result into a list with a format of:
 * [{ 
 *    id: character id
 *    name: character name
 *    description: character description
 *    image: character icon url 
 *  }, 
 *  {}, 
 *  {}, ...]
 */
export const GetCharacter = async (id) => {
  /* Time stamp */
  const ts = timestamp();
  /* Hash - md5 digest of (time stamp + private key + public key) */
  const hash = md5(ts+PRI_KEY+PUB_KEY);
  
  let tempCharacter = [];
  try {
    await axios.get(`${URL}/v1/public/characters/${id}?apikey=${PUB_KEY}&ts=${ts}&hash=${hash}`)
    .then((res) => {
      tempCharacter.push({
        id: res.data.data.results[0].id,
        name: res.data.data.results[0].name,
        description: res.data.data.results[0].description.length>0?res.data.data.results[0].description: "No description",
        image: res.data.data.results[0].thumbnail.path + icon,
        status: "200"
      });
    })
  } catch(e) {
    const status = e.code;
    tempCharacter.push({status: status});
  }
  return tempCharacter;
}
