import { use, useState ,useEffect} from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for missing marker icons in Leaflet
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const customIcon = new L.Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function MapApp({ search ,lt ,lon,setLat,setLon}) {
  const defaultPosition = { lat: lt, lng: lon };
  const [marker, setMarker] = useState(defaultPosition);
  useEffect(() => {
    setMarker(defaultPosition);
  }, [lt,lon]);
  const AddMarker = ({ setMarker }) => {
    useMapEvents({
      click(e) {
        setMarker(e.latlng);
        setLat(e.latlng.lat);
        setLon(e.latlng.lng);
        search(e.latlng.lat, e.latlng.lng);
      },
    });
    return null;
  };

  return (
    <div className="min-h-[400px] flex justify-center items-center bg-gray-100 shadow-xl rounded-2xl  ">
      <div className="w-[600px] h-[400px] shadow-xl rounded-2xl overflow-hidden  bg-white">
        <MapContainer
          center={[lt, lon]}
          zoom={11}
          className="h-full w-full rounded-2xl"
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          <AddMarker setMarker={setMarker} />
          <Marker key="1" position={marker} icon={customIcon}>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}
