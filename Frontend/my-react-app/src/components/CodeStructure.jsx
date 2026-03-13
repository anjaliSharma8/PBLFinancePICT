import React from "react";
import AppNavbar from "./AppNavbar";

function CodeStructure() {
  return (
    <>
      <AppNavbar />
      <div style={{ padding: "30px" }}>
        <h2>Project Structure</h2>

<pre>
PBL
│
├── backend
│   ├── models
│   ├── routes
│   │   └── auth.js
│   ├── server.js
│   └── .env
│
└── Frontend
    └── my-react-app
        ├── public
        └── src
            ├── components
            │   ├── Dashboard.jsx
            │   ├── Home.jsx
            │   ├── login.js
            │   ├── register.js
            │   ├── Transactions.jsx
            │   └── CodeStructure.jsx
            ├── App.js
            └── index.js
</pre>

      </div>
    </>
  );
}

export default CodeStructure;