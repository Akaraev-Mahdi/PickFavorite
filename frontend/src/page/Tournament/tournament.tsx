import { useParams } from "react-router-dom";
import { useAddScoreMutation, useGetTournamentPicturesQuery } from "../../redux/PictureApi";
import loading from '../../assets/Iphone-spinner-2.gif'
import './tournament.css'
import { useEffect, useState } from "react";
import type { IPicture } from "../../type/pictureType";

interface ICandidatePicture {
    pictureId: string | number;
    score: number;
}

function Tournament() {
    const {id: tournamentId} = useParams()
    const {data: candidates = [], isLoading} = useGetTournamentPicturesQuery(tournamentId)

    const [addScore, { isLoading: addScoreIsLoading, isError: addScoreError }] = useAddScoreMutation()

    const [Pairs, setPairs] = useState<IPicture[][]>([])
    const [currentPairIndex, setCurrentPairIndex] = useState(0)
    const [updateCandidates, setUpdateCandidates] = useState<IPicture[]>([])
    const [tour, setTour] = useState(1)

    useEffect(() => {
        if(candidates.length > 0){
            const updateData = candidates.map(candidate => {
                return {
                    ...candidate,
                    score: candidate.score !== 0 ? 0 : candidate.score
                }
            })
            console.log(updateData)
            formationPairs(updateData)
            setUpdateCandidates(updateData)
        }
    }, [candidates])

    const formationPairs = (candidates: IPicture[]) => {
            const shuffed = [...candidates].sort(() => Math.random() - 0.5)
            const paired = []
            for(let i = 0; i < shuffed.length; i += 2) {
                paired.push(shuffed.slice(i, i+2))
            }
            setPairs(paired)
    }

    const handleVote = (selectedCandidate: IPicture) => {
        setUpdateCandidates(updateCandidates.map(candidate => 
            candidate.id === selectedCandidate.id ? {...candidate, score: candidate.score + 1} : candidate
        ))
        setCurrentPairIndex(currentPairIndex + 1)
    }

    const handleAddScore = async () => {
        let candidates: { tournamentId: unknown, pictures: ICandidatePicture[] } = {
            tournamentId: tournamentId,
            pictures: []
        }

        updateCandidates.map(c => candidates.pictures.push({pictureId: c.id, score: c.score}))

        await addScore(candidates).unwrap()

        location.replace('/result/' + tournamentId)
    }

    if(addScoreIsLoading) return (<div className="versus-place"><img className='loadingGif' src={loading} alt='...loding'/></div>)

    if(Pairs[0]?.length === 1){
        return (
            <div className='create-message'>
                <div className='create-message-border'>
                    {
                        addScoreError ?
                        <>
                            <div className='create-message-text'>
                                Вы ранее уже проходили этот турнир, изменения не будут внесены
                            </div>
                            <button onClick={() => location.replace('/result/' + tournamentId)} className='create-message-btn'>Перейти к результатам</button>
                        </> :
                        <>
                            <div className='create-message-text'>
                                Турнир кончился можно переходить к результатам
                            </div>
                            <button onClick={() => handleAddScore()} className='create-message-btn'>Перейти к результатам</button>
                        </>
                    }
                </div>
            </div>
        )
    }

    if(Pairs.length !== 0){
        if(currentPairIndex === Pairs.length){
            const newPairs = updateCandidates.filter(candidate => candidate.score === tour)
            setCurrentPairIndex(0)
            setTour(tour + 1)
            formationPairs(newPairs)
        }
    }

    if(isLoading) return (<div className="versus-place"><img className='loadingGif' src={loading} alt='...loding'/></div>)

    const currentPair = Pairs[currentPairIndex]

    return (
    <main>
        <div className="container">
            <div className="versus-place">
                {
                    currentPair?.map(candidate => (
                        <div onClick={() => handleVote(candidate)} key={candidate.id} className="picture">
                            <div className='tournament-img'>
                                <img className="img" src={'http://localhost:5000/' + candidate.image} alt="i"/>
                            </div>
                            <div className="picture-info">
                                <div className="picture-name">
                                    {candidate.title}
                                </div>
                                <div className="picture-description">
                                    {candidate.description}
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    </main>
    );
}

export default Tournament;