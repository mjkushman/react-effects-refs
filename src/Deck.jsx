import { useEffect, useRef } from 'react'
import {useState} from 'react'
import axios from "axios";

const Deck = () => {

    // state for cards on the table
    const [cardsOnTable, setCardsOnTable] = useState([])

    // state for the deck
    const [cardsLeft, setCardsLeft] = useState(52)

    // ref for deckId. Not necessary to useRef but I did anyway
    const deckId = useRef()

    // state of suhffling
    const [isShuffling, setIsShuffling] = useState(false)
    
    useEffect( () => {
        async function getDeck() {
            const res = await axios.get(`https://deckofcardsapi.com/api/deck/new/`)

            const {deck_id, remaining} = res.data
            deckId.current = deck_id
            setCardsLeft(remaining)
            console.log(deck_id,remaining)
        }
        getDeck()

    },[])

    const drawCard = async ()=>{
        const res = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId.current}/draw/?count=1`)

        const {remaining, cards } = res.data
        setCardsLeft(remaining) // set cards left in deck
        console.log(remaining, cards[0], deckId.current)

        setCardsOnTable(cardsOnTable => [...cardsOnTable,cards[0] ] )
    }
    
    
    // useEffect()

    const shuffleDeck = async () => {
        // shuffle existing cards back into deck.
        setIsShuffling(true)
        try {
            await axios.get(`https://deckofcardsapi.com/api/deck/${deckId.current}/shuffle/
            `)    
        } catch (error) {
            alert(error);
        } finally {setIsShuffling(false)}
        
        //clear the cards off the table
        setCardsOnTable([])

    }

    return (
        <>
        <div>
            {deckId
            ? <img src="https://deckofcardsapi.com/static/img/back.png"/>
            :"loading a deck"}
        </div>

         <div>
            {cardsLeft? 
            <button onClick={drawCard}>Draw a card</button>
            :"No cards to draw!"}
            
            {}
            <button disabled={isShuffling} onClick={shuffleDeck}>Shuffle</button>
         </div>
        <div>{cardsOnTable.map(({image, code}) => (<img src={image} key={code}/>) )}</div>
            
            </>
    )
}

export default Deck;