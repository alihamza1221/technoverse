import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import axios from "axios";
import { getMarkerIcon } from "../utils/customMarkers.jsx";
import "leaflet/dist/leaflet.css";

const CityMap = () => {
  const dummyIssues = [
    {
      _id: "1",
      title: "Pothole on Main Street",
      description: "Large pothole causing traffic delays.",
      category: "Potholes",
      status: "Pending",
      priority: "High",
      department: { _id: "d1", name: "Road Maintenance" },
      createdAt: "2025-05-30T10:30:00Z",
      location: { ltd: 28.6139, lng: 77.209 },
      images: ["https://via.placeholder.com/150"],
    },
    {
      _id: "2",
      title: "Streetlight not working",
      description: "Streetlight near Park Avenue is not functioning.",
      category: "Electricity",
      status: "In Progress",
      priority: "Medium",
      department: { _id: "d2", name: "Electricity Department" },
      createdAt: "2025-05-29T18:45:00Z",
      location: { ltd: 28.62, lng: 77.215 },
      images: [],
    },
    {
      _id: "3",
      title: "Overflowing Garbage Bin",
      description: "Garbage bin at Market Street is overflowing.",
      category: "Garbage Disposal",
      status: "Resolved",
      priority: "Low",
      department: { _id: "d3", name: "Sanitation" },
      createdAt: "2025-05-28T08:15:00Z",
      location: { ltd: 28.6, lng: 77.22 },
      images: ["https://via.placeholder.com/150"],
    },
  ];

  const [issues, setIssues] = useState(dummyIssues);
  const [departments, setDepartments] = useState([]);
  const [filters, setFilters] = useState({
    category: "",
    status: "",
    department: "",
    startDate: "",
    endDate: "",
    radius: "", // <-- NEW: area radius filter in km
  });

  const fetchIssues = async () => {
    try {
      const res = await axios.get("http://localhost:3000/issues/");
      console.log("Issues fetched:", res.data);
      if (!res.data.length === 0) {
        setIssues(res.data);
      }
    } catch (err) {
      console.error("Error fetching issues:", err);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await axios.get("http://localhost:3000/departments/");
      console.log("Departments fetched:", res.data);
      setDepartments(res.data);
    } catch (err) {
      console.error("Error fetching departments:", err);
    }
  };

  useEffect(() => {
    // fetchIssues();
    // fetchDepartments();
  }, []);

  // helper: calculate distance between two lat/lng points in km (Haversine)
  const getDistanceFromCenter = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Earth radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // filtered issues including area filter
  const filteredIssues = issues.filter((issue) => {
    const { category, status, department, startDate, endDate, radius } =
      filters;
    const createdAt = new Date(issue.createdAt);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    // area filter center point (can customize later if needed)
    const centerLat = 28.6139;
    const centerLng = 77.209;

    const distance = getDistanceFromCenter(
      centerLat,
      centerLng,
      issue.location.ltd,
      issue.location.lng
    );

    return (
      (!category || issue.category === category) &&
      (!status || issue.status === status) &&
      (!department ||
        (issue.department && issue.department.name === department)) &&
      (!startDate || createdAt >= start) &&
      (!endDate || createdAt <= end) &&
      (!radius || distance <= parseFloat(radius))
    );
  });

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">City Map View</h1>

      {/* Filters */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
        <select
          className="border p-2 rounded"
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        >
          <option value="">All Categories</option>
          {[
            "Potholes",
            "Sanitation",
            "Electricity",
            "Traffic",
            "Water Supply",
            "Public Safety",
            "Road Maintenance",
            "Garbage Disposal",
            "Other",
          ].map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <select
          className="border p-2 rounded"
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">All Statuses</option>
          {["Pending", "Assigned", "In Progress", "Resolved", "Rejected"].map(
            (status) => (
              <option key={status} value={status}>
                {status}
              </option>
            )
          )}
        </select>

        <select
          className="border p-2 rounded"
          value={filters.department}
          onChange={(e) =>
            setFilters({ ...filters, department: e.target.value })
          }
        >
          <option value="">All Departments</option>
          {departments.map((dept) => (
            <option key={dept._id} value={dept.name}>
              {dept.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          className="border p-2 rounded"
          value={filters.startDate}
          onChange={(e) =>
            setFilters({ ...filters, startDate: e.target.value })
          }
        />

        <input
          type="date"
          className="border p-2 rounded"
          value={filters.endDate}
          onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
        />

        {/* NEW: Area Radius input */}
        <input
          type="number"
          placeholder="Radius (km)"
          className="border p-2 rounded"
          value={filters.radius}
          onChange={(e) => setFilters({ ...filters, radius: e.target.value })}
        />
      </div>

      {/* Map */}
      <MapContainer
        center={[28.6139, 77.209]}
        zoom={12}
        style={{ height: "600px", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* Show circle if radius is provided */}
        {filters.radius && (
          <Circle
            center={[28.6139, 77.209]}
            radius={parseFloat(filters.radius) * 1000} // meters
            pathOptions={{
              color: "red",
              fillColor: "rgba(0, 0, 255, 0.1)",
              fillOpacity: 0.2,
            }}
          />
        )}

        <MarkerClusterGroup>
          {filteredIssues.map((issue) => (
            <Marker
              key={issue._id}
              position={[issue.location.ltd, issue.location.lng]}
              icon={getMarkerIcon(issue.status)}
            >
              <Popup>
                <div>
                  <h2 className="font-bold text-lg">{issue.title}</h2>
                  <p className="text-sm mb-2">{issue.description}</p>
                  <p className="text-sm">
                    <strong>Category:</strong> {issue.category}
                  </p>
                  <p className="text-sm">
                    <strong>Status:</strong> {issue.status}
                  </p>
                  {issue.department && (
                    <p className="text-sm">
                      <strong>Department:</strong> {issue.department.name}
                    </p>
                  )}
                  <p className="text-sm">
                    <strong>Priority:</strong> {issue.priority}
                  </p>
                  <p className="text-xs text-gray-500">
                    Reported: {new Date(issue.createdAt).toLocaleString()}
                  </p>
                  {issue.images && issue.images.length > 0 && (
                    <img
                      src={issue.images[0]}
                      alt="issue"
                      className="mt-2 w-32 h-20 object-cover rounded"
                    />
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
};

export default CityMap;
