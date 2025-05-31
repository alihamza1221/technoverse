// import L from "leaflet";
// import redIconUrl from "../icons/marker-red.png";
// import greenIconUrl from "../icons/marker-green.png";
// import orangeIconUrl from "../icons/marker-orange.png";
// import blueIconUrl from "../icons/marker-blue.png";

// export const getMarkerIcon = (status) => {
//   let iconUrl;
//   switch (status) {
//     case "Pending":
//       iconUrl = redIconUrl;
//       break;
//     case "In Progress":
//       iconUrl = orangeIconUrl;
//       break;
//     case "Resolved":
//       iconUrl = greenIconUrl;
//       break;
//     default:
//       iconUrl = blueIconUrl;
//   }

//   return new L.Icon({
//     iconUrl,
//     iconSize: [30, 42],
//     iconAnchor: [15, 42],
//     popupAnchor: [0, -30],
//   });
// };
import L from "leaflet";
import { createRoot } from "react-dom/client";
import React from "react";
import { MapPin, CircleAlert, CircleCheckBig, Loader } from "lucide-react";

export const getMarkerIcon = (status) => {
  // Create a container div for the icon
  const div = document.createElement("div");
  div.style.width = "32px";
  div.style.height = "32px";
  div.style.display = "flex";
  div.style.justifyContent = "center";
  div.style.alignItems = "center";
  div.style.background = "white";
  div.style.borderRadius = "50%";
  div.style.boxShadow = "0 0 5px rgba(0,0,0,0.3)";

  // Mount React Lucide icon into the div
  const root = createRoot(div);

  const iconMap = {
    Pending: <CircleAlert size={22} color="#dc2626" />, // red
    "In Progress": <Loader size={22} color="#f97316" />, // orange
    Resolved: <CircleCheckBig size={22} color="#16a34a" />, // green
  };

  root.render(iconMap[status] || <MapPin size={22} color="#3b82f6" />); // default blue pin

  return L.divIcon({
    html: div,
    className: "", // no extra Leaflet CSS classes
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};
