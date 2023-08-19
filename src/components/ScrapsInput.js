import React, {useState} from 'react'
import './SideInput.css'

const ScrapsInput = ({setInputScraps}) => {


    
    const handleScrapsChange = (event) => {
      setInputScraps(event.target.value)
    }

    return (
    <div className='side box'>
        <p>Scraps weight:</p>
        <input onChange={handleScrapsChange}></input>
    </div>
  )
}

export default ScrapsInput;