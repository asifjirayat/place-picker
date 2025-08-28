import { useRef, useState, useEffect } from "react";
import Places from "./components/Places.jsx";
import { AVAILABLE_PLACES } from "./utils/data.js";
import Modal from "./components/Modal.jsx";
import DeleteConfirmation from "./components/DeleteConfirmation.jsx";
import { sortPlacesByDistance } from "./utils/loc.js";
import logoImg from "./assets/logo.png";

const App = () => {
  const storedIds = JSON.parse(localStorage.getItem("pickedPlaces")) || [];

  const modal = useRef();
  const selectedPlace = useRef();
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [pickedPlaces, setPickedPlaces] = useState([]);

  // Setting userLocation
  useEffect(() => {
    const defaultLocation = {
      coords: {
        latitude: 15.8609,
        longitude: 74.5129,
      },
    };

    const handleSuccess = (position) => {
      const sortedPlaces = sortPlacesByDistance(
        AVAILABLE_PLACES,
        position.coords.latitude,
        position.coords.longitude
      );
      setAvailablePlaces(sortedPlaces);
    };

    const handleError = (error) => {
      console.log(
        "Geo Location API failed. Using default coordinates:",
        error.message
      );
      const sortedPlaces = sortPlacesByDistance(
        AVAILABLE_PLACES,
        defaultLocation.coords.latitude,
        defaultLocation.coords.longitude
      );
      setAvailablePlaces(sortedPlaces);
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
    } else {
      handleError(new Error("Geolocation not supported"));
    }
  }, []);

  // Load picked places from localStorage
  useEffect(() => {
    if (availablePlaces.length > 0 && storedIds.length > 0) {
      const storedPlaces = storedIds
        .map((id) => AVAILABLE_PLACES.find((place) => place.id === id))
        .filter((place) => place !== undefined);

      setPickedPlaces(storedPlaces);
    }
  }, [availablePlaces]);

  // Handle removal of selected place
  const handleStartRemovePlace = (id) => {
    modal.current.open();
    selectedPlace.current = id;
  };

  // Handle stop removal of place
  const handleStopRemovePlace = () => {
    modal.current.close();
  };

  // Handle selected place by adding to the array ? add : return
  const handleSelectPlace = (id) => {
    setPickedPlaces((prevPickedPlaces) => {
      if (prevPickedPlaces.some((place) => place.id === id))
        return prevPickedPlaces;

      const place = AVAILABLE_PLACES.find((place) => place.id === id);
      const newPickedPlaces = [place, ...prevPickedPlaces];

      // Update localStorage
      const newIds = newPickedPlaces.map((p) => p.id);
      localStorage.setItem("pickedPlaces", JSON.stringify(newIds));

      return newPickedPlaces;
    });
  };

  // Handle removal of place, return filtered array
  const handleRemovePlace = () => {
    setPickedPlaces((prevPickedPlaces) => {
      const updatedPlaces = prevPickedPlaces.filter(
        (place) => place.id !== selectedPlace.current
      );

      // Update localStorage
      const updatedIds = updatedPlaces.map((place) => place.id);
      localStorage.setItem("pickedPlaces", JSON.stringify(updatedIds));

      return updatedPlaces;
    });
    modal.current.close();
  };

  return (
    <>
      <Modal ref={modal}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>
      <header>
        <img src={logoImg} alt="Stylized Globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit..."
          fallbackText="Select the places you would like to visit below."
          places={pickedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />
        <Places
          title="Available Places"
          places={availablePlaces}
          onSelectPlace={handleSelectPlace}
          fallbackText="Loading places...."
        />
      </main>
    </>
  );
};

export default App;
