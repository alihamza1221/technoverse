// // import React, { useEffect, useState } from "react";
// // import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// // import MarkerClusterGroup from "react-leaflet-cluster";
// // import axios from "axios";
// // import "leaflet/dist/leaflet.css";
// // import "./fixLeafletIcons"; // icon fix script

// // const CityMap = () => {
// //   const [issues, setIssues] = useState([]);
// //   const [filters, setFilters] = useState({
// //     category: "",
// //     status: "",
// //     department: "",
// //     startDate: "",
// //     endDate: "",
// //   });

// //   const fetchIssues = async () => {
// //     try {
// //       const res = await axios.get("http://localhost:3000/issues/"); // your API URL
// //       setIssues(res.data);
// //     } catch (error) {
// //       console.error("Failed to fetch issues", error);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchIssues();
// //   }, []);

// //   const filteredIssues = issues.filter((issue) => {
// //     const { category, status, department, startDate, endDate } = filters;

// //     const issueDate = new Date(issue.createdAt);

// //     return (
// //       (!category || issue.category === category) &&
// //       (!status || issue.status === status) &&
// //       (!department ||
// //         (issue.department && issue.department.name === department)) &&
// //       (!startDate || issueDate >= new Date(startDate)) &&
// //       (!endDate || issueDate <= new Date(endDate))
// //     );
// //   });

// //   return (
// //     <div className="p-4">
// //       <h1 className="text-2xl font-bold mb-4">City Issues Map</h1>

// //       {/* Filters */}
// //       <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
// //         <input
// //           type="text"
// //           placeholder="Category"
// //           className="border p-2 rounded"
// //           value={filters.category}
// //           onChange={(e) => setFilters({ ...filters, category: e.target.value })}
// //         />
// //         <input
// //           type="text"
// //           placeholder="Status"
// //           className="border p-2 rounded"
// //           value={filters.status}
// //           onChange={(e) => setFilters({ ...filters, status: e.target.value })}
// //         />
// //         <input
// //           type="text"
// //           placeholder="Department"
// //           className="border p-2 rounded"
// //           value={filters.department}
// //           onChange={(e) =>
// //             setFilters({ ...filters, department: e.target.value })
// //           }
// //         />
// //         <input
// //           type="date"
// //           className="border p-2 rounded"
// //           value={filters.startDate}
// //           onChange={(e) =>
// //             setFilters({ ...filters, startDate: e.target.value })
// //           }
// //         />
// //         <input
// //           type="date"
// //           className="border p-2 rounded"
// //           value={filters.endDate}
// //           onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
// //         />
// //       </div>

// //       {/* Map */}
// //       <MapContainer
// //         center={[28.6139, 77.209]} // city coords
// //         zoom={12}
// //         className="h-[600px] w-full rounded shadow"
// //       >
// //         <TileLayer
// //           attribution="&copy; OpenStreetMap contributors"
// //           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
// //         />

// //         <MarkerClusterGroup>
// //           {filteredIssues.map(
// //             (issue) =>
// //               issue.location?.ltd &&
// //               issue.location?.lng && (
// //                 <Marker
// //                   key={issue._id}
// //                   position={[issue.location.ltd, issue.location.lng]}
// //                 >
// //                   <Popup>
// //                     <div>
// //                       <h2 className="font-bold text-lg">{issue.title}</h2>
// //                       <p className="text-sm">{issue.description}</p>
// //                       <p className="mt-1 text-sm">
// //                         <strong>Category:</strong> {issue.category}
// //                       </p>
// //                       <p className="text-sm">
// //                         <strong>Status:</strong> {issue.status}
// //                       </p>
// //                       {issue.department && (
// //                         <p className="text-sm">
// //                           <strong>Department:</strong> {issue.department.name}
// //                         </p>
// //                       )}
// //                       <p className="text-sm">
// //                         <strong>Priority:</strong> {issue.priority}
// //                       </p>
// //                       <p className="text-xs text-gray-500">
// //                         Reported on:{" "}
// //                         {new Date(issue.createdAt).toLocaleDateString()}
// //                       </p>
// //                       {issue.images && issue.images.length > 0 && (
// //                         <img
// //                           src={issue.images[0]}
// //                           alt="issue preview"
// //                           className="mt-2 w-32 h-20 object-cover rounded"
// //                         />
// //                       )}
// //                     </div>
// //                   </Popup>
// //                 </Marker>
// //               )
// //           )}
// //         </MarkerClusterGroup>
// //       </MapContainer>
// //     </div>
// //   );
// // };

// // export default CityMap;

// import React, { useEffect, useState } from "react";
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import MarkerClusterGroup from "react-leaflet-cluster";
// import axios from "axios";
// import { getMarkerIcon } from "./customMarkers";
// import "leaflet/dist/leaflet.css";

// const CityMap = () => {
//   const [issues, setIssues] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [filters, setFilters] = useState({
//     category: "",
//     status: "",
//     department: "",
//     startDate: "",
//     endDate: "",
//   });

//   const fetchIssues = async () => {
//     try {
//       const res = await axios.get("http://localhost:3000/issues/");
//       setIssues(res.data);
//     } catch (err) {
//       console.error("Error fetching issues:", err);
//     }
//   };

//   const fetchDepartments = async () => {
//     try {
//       const res = await axios.get("http://localhost:3000/departments/");
//       setDepartments(res.data);
//     } catch (err) {
//       console.error("Error fetching departments:", err);
//     }
//   };

//   useEffect(() => {
//     fetchIssues();
//     // fetchDepartments();
//   }, []);

//   const filteredIssues = issues.filter((issue) => {
//     const { category, status, department, startDate, endDate } = filters;
//     const createdAt = new Date(issue.createdAt);
//     const start = startDate ? new Date(startDate) : null;
//     const end = endDate ? new Date(endDate) : null;

//     return (
//       (!category || issue.category === category) &&
//       (!status || issue.status === status) &&
//       (!department ||
//         (issue.department && issue.department.name === department)) &&
//       (!startDate || createdAt >= start) &&
//       (!endDate || createdAt <= end)
//     );
//   });

//   return (
//     <div className="p-4">
//       <h1 className="text-3xl font-bold mb-4">City Map View</h1>

//       {/* Filters */}
//       <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
//         <select
//           className="border p-2 rounded"
//           value={filters.category}
//           onChange={(e) => setFilters({ ...filters, category: e.target.value })}
//         >
//           <option value="">All Categories</option>
//           {[
//             "Potholes",
//             "Sanitation",
//             "Electricity",
//             "Traffic",
//             "Water Supply",
//             "Public Safety",
//             "Road Maintenance",
//             "Garbage Disposal",
//             "Other",
//           ].map((type) => (
//             <option key={type} value={type}>
//               {type}
//             </option>
//           ))}
//         </select>

//         <select
//           className="border p-2 rounded"
//           value={filters.status}
//           onChange={(e) => setFilters({ ...filters, status: e.target.value })}
//         >
//           <option value="">All Statuses</option>
//           {["Pending", "Assigned", "In Progress", "Resolved", "Rejected"].map(
//             (status) => (
//               <option key={status} value={status}>
//                 {status}
//               </option>
//             )
//           )}
//         </select>

//         <select
//           className="border p-2 rounded"
//           value={filters.department}
//           onChange={(e) =>
//             setFilters({ ...filters, department: e.target.value })
//           }
//         >
//           <option value="">All Departments</option>
//           {departments.map((dept) => (
//             <option key={dept._id} value={dept.name}>
//               {dept.name}
//             </option>
//           ))}
//         </select>

//         <input
//           type="date"
//           className="border p-2 rounded"
//           value={filters.startDate}
//           onChange={(e) =>
//             setFilters({ ...filters, startDate: e.target.value })
//           }
//         />

//         <input
//           type="date"
//           className="border p-2 rounded"
//           value={filters.endDate}
//           onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
//         />
//       </div>

//       {/* Map */}
//       <MapContainer
//         center={[28.6139, 77.209]}
//         zoom={12}
//         style={{ height: "600px", width: "100%" }}
//       >
//         <TileLayer
//           attribution="&copy; OpenStreetMap contributors"
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         />

//         <MarkerClusterGroup>
//           {filteredIssues.map((issue) => (
//             <Marker
//               key={issue._id}
//               position={[issue.location.ltd, issue.location.lng]}
//               icon={getMarkerIcon(issue.status)}
//             >
//               <Popup>
//                 <div>
//                   <h2 className="font-bold text-lg">{issue.title}</h2>
//                   <p className="text-sm mb-2">{issue.description}</p>
//                   <p className="text-sm">
//                     <strong>Category:</strong> {issue.category}
//                   </p>
//                   <p className="text-sm">
//                     <strong>Status:</strong> {issue.status}
//                   </p>
//                   {issue.department && (
//                     <p className="text-sm">
//                       <strong>Department:</strong> {issue.department.name}
//                     </p>
//                   )}
//                   <p className="text-sm">
//                     <strong>Priority:</strong> {issue.priority}
//                   </p>
//                   <p className="text-xs text-gray-500">
//                     Reported: {new Date(issue.createdAt).toLocaleString()}
//                   </p>
//                   {issue.images && issue.images.length > 0 && (
//                     <img
//                       src={issue.images[0]}
//                       alt="issue"
//                       className="mt-2 w-32 h-20 object-cover rounded"
//                     />
//                   )}
//                 </div>
//               </Popup>
//             </Marker>
//           ))}
//         </MarkerClusterGroup>
//       </MapContainer>
//     </div>
//   );
// };

// export default CityMap;
