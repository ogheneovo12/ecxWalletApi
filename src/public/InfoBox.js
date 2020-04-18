import React from "react";
import ReactDOM from "react-dom";

const infos = [
  {
    requestName: "GET ALL USERS",
    description: "this endpoint fetches all available users from database",
    endpoint: "/api/users",
    jsonString: `{
            "success": true,
            "users": [
                {
                    "names": [],
                    "occupation": "not stated",
                    "lastLogin": "never",
                    "_id": "5e9a8b28ca40653048e5e5a1",
                    "name": "mulansu",
                    "email": "lizzy@gmail.com",
                    "password":"hashed password",
                    "date": "18-4-2020",
                    "time": "6:07:52 AM",
                    "__v": 1
                },
                ...
            ]
        }`,
    method: "/GET/",
  },
  {
    requestName: "GET ALL USERS",
    description: "this endpoint fetches all available users from database",
    endpoint: "/api/users",
    jsonString: `{
            "success": true,
            "users": [
                {
                    "names": [],
                    "occupation": "not stated",
                    "lastLogin": "never",
                    "_id": "5e9a8b28ca40653048e5e5a1",
                    "name": "mulansu",
                    "email": "lizzy@gmail.com",
                    "password":"hashed password",
                    "date": "18-4-2020",
                    "time": "6:07:52 AM",
                    "__v": 1
                },
                ...
            ]
        }`,
    method: "/GET/",
  },
];

const Code = ({ jsonString }) => (
  <pre>
    <code class="javascript">{jsonString}</code>
  </pre>
);

const InfoBox = ({
  requestName,
  description,
  endpoint,
  jsonString,
  method,
}) => (
  <div class="infobox">
    <div class="request">
      <h2>{requestName}</h2>
      <p>
        <span>{method}</span>
        {endpoint}
      </p>
      <p>description</p>
      <p>{description}</p>
      <a href="#">
        {" "}
        try it <i></i>
      </a>
    </div>
    <div class="response">
      <Code jsonString={jsonString} />
    </div>
  </div>
);

const infoContainer = () => (
  <div class="infoContainer">
    {infos.map((info, index) => (
      <InfoBox key={index} props={{ ...info }} />
    ))}
  </div>
);
console.log(react);
ReactDOM.render(<infoContainer />, document.querySelector("#view"));
