import axios from "axios";
import { useEffect, useRef, useState } from "react"
import { youtube_parser } from './utils'

function App() {
  const inputUrlRef = useRef()
  const [urlResult, setUrlResult] = useState(null)
  const [remaining, setRemaining] = useState(JSON.parse(localStorage.getItem('attemptsRemaining')))
  const [title, setTitle] = useState('')

  useEffect(() => {
    localStorage.setItem('attemptsRemaining', JSON.stringify(remaining));
  }, [remaining])

  function handleSubmit(e) {
    e.preventDefault()
    const youtubeId = youtube_parser(inputUrlRef.current.value)
    const remainingKey = `x-ratelimit-request-remaining`

    const options = {
      method: 'get',
      url: 'https://youtube-mp36.p.rapidapi.com/dl',
      headers: {
        'X-RapidAPI-Key': import.meta.env.VITE_RAPID_API_KEY,
        'X-RapidAPI-Host': 'youtube-mp36.p.rapidapi.com'
      },
      params: {
        id: youtubeId,
      },
    }
    axios(options)
      .then(res => {
        setUrlResult(res.data.link)
        setRemaining(res.headers[remainingKey])
        setTitle(res.data.title)
      })
      .catch(err => console.log(err))

    inputUrlRef.current.value = ''
  }

  function closeLink() {
    setUrlResult(null)
  }

  return (
    <>
      <p className="remaining">Remaining: {remaining}</p>

      <section className='content'>
        <h1>MP3 converter</h1>

        <form onSubmit={handleSubmit} className="form">
          <input ref={inputUrlRef} type="text" placeholder="Add video URL" />
          <button type="submit">Search</button>
        </form>

        {urlResult ? <a target='_blank' rel='noreferrer' href={urlResult} onClick={closeLink}>Download MP3</a> : ''}
        {urlResult ? <p className="musicTitle">{title}</p> : ''}
      </section>
    </>
  )
}

export default App
