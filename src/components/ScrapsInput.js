import React, {useState} from 'react'
import './SideInput.css'

const ScrapsInput = ({setScraps}) => {


    
    const handleScrapsChange = (event) => {
      setScraps(event.target.value)
    }

    return (
    <div className='side box'>
        <p>Scraps weight:</p>
        <input onChange={handleScrapsChange}></input>
    </div>
  )
}

export default ScrapsInput;