import React, { useContext, useEffect, useState } from "react";
import { UserDataContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserProtectWrapper = ({ children }) => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserDataContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }

    console.log("token", token);
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          console.log("User data: succes:", response.data);
          try {
            setUser(response.data);
          } catch (err) {
            console.log("Error setting user data:", err);
          }
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        // localStorage.removeItem("token");
        navigate("/login");
      });
  }, [token]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default UserProtectWrapper;
