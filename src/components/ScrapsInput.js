import React, {useState} from 'react'

const ScrapsInput = ({setScraps}) => {


    
    const handleScrapsChange = (event) => {
      setScraps(event.target.value)
    }

    return (
    <div>
        <p>Scraps weight:</p>
        <input onChange={handleScrapsChange}></input>
    </div>
  )
}

export default ScrapsInput;