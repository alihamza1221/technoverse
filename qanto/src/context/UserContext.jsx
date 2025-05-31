import React, { createContext, useState } from "react";

export const UserDataContext = createContext();
import { UserRole } from "../lib/common";

const UserContext = ({ children }) => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    role: UserRole.CITIZEN,
    phone: "",
    profileImage: "",
    socketId: "",
    _id: "",
  });

  return (
    <div>
      <UserDataContext.Provider value={{ user, setUser }}>
        {children}
      </UserDataContext.Provider>
    </div>
  );
};

export default UserContext;
