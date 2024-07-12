import React from "react";
import { useQuery, gql } from "@apollo/client";

const GetTweets = gql`
  query {
    Tweets {
      id
      body
      Author {
        username
        full_name
      }
    }
  }
`;

function App() {
  const { loading, error, data } = useQuery(GetTweets, {
    onError: (error) => {
      console.log(`Apollo error: ${JSON.stringify(error, null, 2)}`);
    },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}

export default App;
