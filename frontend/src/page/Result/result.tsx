import { useParams } from "react-router-dom";
import { useGetTournamentPicturesQuery, useLazyGetPersonalTournamentPicturesQuery } from "../../redux/PictureApi";
import loading from '../../assets/Iphone-spinner-2.gif'
import './result.css'
import { useEffect, useState } from "react";
import type { IPicture, IPictureWithInfo } from "../../type/pictureType";

function Result() {
    const {id: tournamentId} = useParams()
    const {data: candidates = [], isLoading} = useGetTournamentPicturesQuery(tournamentId)
    const [trigger] = useLazyGetPersonalTournamentPicturesQuery()

    const [results, setResults] = useState<IPicture[]>([])
    const [activeButton, setActiveButton] = useState(2)

    useEffect(() => {
        if(candidates.length > 0){
            setResults(candidates)
        }
    }, [candidates])

    const handleGetPersonalCandidates = (data: IPictureWithInfo[]) => {
        console.log(data)
        setResults(data.map(candidate => {
            return {...candidate.picture, score: candidate.score}
        }))
    }

    const handleGetResults = async(buttonId: number) => {
        if(buttonId === 1){
            const {data} = await trigger(tournamentId)
            handleGetPersonalCandidates(data)
        }else {
            setResults(candidates)
        }
        setActiveButton(buttonId)
    }

    if(isLoading) return (<div className="versus-place"><img className='loadingGif' src={loading} alt='...loding'/></div>)

    return ( 
    <main>
        <div className="container">
            <div className="filters">
                <button style={{
                    backgroundColor: activeButton === 1 ? '#CF2D2D' : '#D9D9D9', 
                    color: activeButton === 1 ? 'white' : '#4E4B4B'
                    }} onClick={() => handleGetResults(1)}>
                    You results
                </button>
                <button style={{backgroundColor: activeButton === 2 ? '#CF2D2D' : '#D9D9D9', 
                    color: activeButton === 2 ? 'white' : '#4E4B4B'
                    }} onClick={() => handleGetResults(2)}>
                    General results
                </button>
            </div>
            <div className="tournament-name">Tournament Name</div>
            <div className="results">
                {results?.map((candidate, index) => (
                <div key={candidate.id}>
                    <hr/>
                    <div className="voiter">
                        <span>{index + 1}.</span>
                        <div>
                            <div className="voiter-name">{candidate.title}</div>
                            <div className='result-tournament-img'>
                                <img className="img" src={'http://localhost:5000/' + candidate.image} alt="i"/>
                            </div>
                        </div>
                        <div className="description">
                            {candidate.description}
                        </div>
                    </div>
                </div>
                ))}
            </div>
        </div>
    </main>
    );
}

export default Result;