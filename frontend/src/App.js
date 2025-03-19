import React, { useState, useEffect } from 'react'; 
import Map, { Marker, Popup } from 'react-map-gl';
import mapboxgl from 'mapbox-gl';
import RoomIcon from '@mui/icons-material/Room';
import StarIcon from '@mui/icons-material/Star';
import CloseIcon from '@mui/icons-material/Close';
import "./app.css";
import axios from "axios";
import { format } from 'timeago.js';
import Register from './components/Register';
import Login from './components/Login';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX;

function App() {
  const myStorage= window.localStorage;
  const [currentUser, setCurrentUser] = useState(myStorage.getItem("user"));
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [rating, setRating] = useState(0);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);


  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios.get("http://localhost:8800/api/pins");
        const validPins = res.data.filter(pin => !isNaN(pin.lat) && !isNaN(pin.long));
        setPins(validPins);
      } catch (err) {
        console.log(err);
      }
    };
    getPins();
  }, []);

  // Handle marker click
  const handleMarkerClick = (id) => {
    setCurrentPlaceId(id);
  };


  const handleAddClick = (e) => {
    const { lng, lat } = e.lngLat;

 
    if (!isNaN(lng) && !isNaN(lat)) {
      setNewPlace({
        lat: lat,
        lng: lng,
      });
    } else {
      console.error("Invalid longitude or latitude values");
    }
  };

  // Handle form submission for new pin
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: currentUser,
      title,
      desc,
      rating,
      lat: newPlace?.lat,
      long: newPlace?.lng,
    };

    if (!isNaN(newPin.lat) && !isNaN(newPin.long)) {
      try {
        const res = await axios.post("http://localhost:8800/api/pins", newPin);
        setPins([...pins, res.data]);
        setNewPlace(null); // Close the popup after adding the pin
      } catch (err) {
        console.log(err);
      }
    } else {
      console.error("Cannot submit invalid coordinates");
    }
  };

  const handleLogout = ()=>{
    myStorage.removeItem("user");
    setCurrentUser(null);
  }


  return (
    <div className="App">
      <Map
        initialViewState={{
          longitude: 80.7718,
          latitude: 7.8731,
          zoom: 8
        }}
        style={{ width: "100vw", height: "100vh" }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxAccessToken={process.env.REACT_APP_MAPBOX}
        onDblClick={handleAddClick}
        transitionDuration="200"
      >
        {pins.map((p) => (
          // Ensure the markers are rendered only with valid long and lat values
          !isNaN(p.long) && !isNaN(p.lat) && (
            <React.Fragment key={p._id}>
              <Marker 
                longitude={p.long} 
                latitude={p.lat} 
                anchor="bottom" 
                onClick={() => handleMarkerClick(p._id)}
              >
                <RoomIcon 
                  style={{ fontSize: 30, color: p.username === currentUser ? 'red' : "slateblue", cursor: "pointer" }} 
                />
              </Marker>

              {currentPlaceId === p._id && (
                <Popup
                  key={p._id}
                  longitude={p.long}
                  latitude={p.lat}
                  anchor="left"
                  closeButton={false}
                  closeOnClick={false}
                  onClose={() => setCurrentPlaceId(null)}
                >
                  <div className="card">
                    <button 
                      className="custom-close-button" 
                      onClick={() => setCurrentPlaceId(null)}
                      aria-label="Close popup"
                    >
                    <CloseIcon className="loginCancel"/> 
                    </button>
                    <label>Place</label>
                    <h4 className="Place">{p.title}</h4>
                    <label>Review</label>
                    <p className='desc'>{p.desc}</p>
                    <label>Rating</label>
                    <div className="Stars">
                      {[...Array(p.rating)].map((_, index) => (
                        <StarIcon key={`star-${p._id}-${index}`} className="star" />
                      ))}
                    </div>
                    <label>Information</label>
                    <span className="username">Created by <b>{p.username}</b></span>
                    <span className="date">{format(p.createdAt)}</span>
                  </div>
                </Popup>
              )}
            </React.Fragment>
          )
        ))}

        {newPlace && !isNaN(newPlace.lng) && !isNaN(newPlace.lat) && (
          <Popup
            longitude={newPlace.lng}
            latitude={newPlace.lat}
            anchor="left"
            closeButton={true}
            closeOnClick={false}
            onClose={() => setNewPlace(null)}
          >
            <div>
              <form onSubmit={handleSubmit}>
                <label>Title</label>
                <input 
                  placeholder="Enter a title" 
                  onChange={(e) => setTitle(e.target.value)}
                />
                <label>Review</label>
                <textarea 
                  placeholder="Say something about this place."
                  onChange={(e) => setDesc(e.target.value)}
                />
                <label>Rating</label>
                <select onChange={(e) => setRating(e.target.value)}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                <button className="submitButton" type="submit">Add Pin</button>
              </form>
            </div>
          </Popup>
        )}
        {currentUser ?(
          <button className = "button logout" onClick={handleLogout}>log out </button>
        ) : (
          <div className= "buttons">
          <button 
          className = "button login" 
          onClick={()=>setShowLogin(true)}>
            login 
          </button>
          <button 
          className = "button register" 
          onClick={()=>setShowRegister(true)}>
            Register </button>
          </div>
        )}   
        {showRegister &&  <Register setShowRegister= {setShowRegister}/> }   
        {showLogin &&  <Login setShowLogin= {setShowLogin} myStorage={myStorage} setCurrentUser={setCurrentUser}/> }  
      </Map>
    </div>
  );
}

export default App;
