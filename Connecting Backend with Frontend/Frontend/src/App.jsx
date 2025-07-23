import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios'
import { useEffect } from 'react'
function App() {
  const [jokes, setJokes] = useState([])

  useEffect(()=>{
      axios.get('api/jokes')
      .then((response) => {
        setJokes(response.data)
      })
      .catch((error) => {
        console.error('Error fetching jokes:', error)
      })
  },[])
  return (
    <>
      <h1>Jokes le lo</h1>
      <p>JOKES:{jokes.length}</p>

      {
        jokes.map((jokes,index)=>{
          return <p key={index}>{jokes}</p>
        })
      }
    </>
  )
}

export default App
