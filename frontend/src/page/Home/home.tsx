import './home.css'
import plus from '../../assets/plus.png'
import { useGetTournamentsQuery } from '../../redux/tournamentApi';
import TournamentItem from '../../component/tournament/TournamentItem';
import { useEffect, useState } from 'react';
import type { ITournament } from '../../type/tournamentType';

function Home() {

    const {data: tournaments = []} = useGetTournamentsQuery()
    
    const [activeButton, setActiveButton] = useState(0)
    const [newTournaments, setNewTournaments] = useState<ITournament[]>([])

    useEffect(() => {
        if(tournaments.length > 0){
            setNewTournaments(tournaments)
        }
    }, [tournaments])

    const handleGetTournaments = (buttonId: number) => {
        if(buttonId === 3){
            setNewTournaments([...(newTournaments ?? [])].sort((a, b) => {
                const likesB = b.like?.length ?? 0;
                const likesA = a.like?.length ?? 0;
                return likesB - likesA;
            }))
        }
        if(buttonId === 2){
            setNewTournaments([...(newTournaments ?? [])].sort((a, b) => {
                const likesB = b.like?.length ?? 0;
                const likesA = a.like?.length ?? 0;
                return likesB - likesA;
            }))
        }
        if(buttonId === 1){
            setNewTournaments([...(newTournaments ?? [])].sort((a, b) => {
                const likesA = Array.isArray(a.like) ? a.like.length : (Number(a.like) || 0)
                const likesB = Array.isArray(b.like) ? b.like.length : (Number(b.like) || 0)
                
                const viewsA = Number(a.views) || 1
                const viewsB = Number(b.views) || 1

                const rateA = likesA / viewsA
                const rateB = likesB / viewsB

                if (isNaN(rateA) || isNaN(rateB)) {
                    console.error("Ошибка в данных поста:", { a, b })
                    return 0
                }

                return rateB - rateA
            }))
        }
        setActiveButton(buttonId)
    }

    return (
        <main>
            <div className="container">
                <div className="filters">
                    <button className="relevant" style={{
                    backgroundColor: activeButton === 1 ? '#CF2D2D' : '#D9D9D9', 
                    color: activeButton === 1 ? 'white' : '#4E4B4B'
                    }} onClick={() => handleGetTournaments(1)}>
                        Relevant
                    </button>
                    <button className="Most viewed" style={{
                    backgroundColor: activeButton === 2 ? '#CF2D2D' : '#D9D9D9', 
                    color: activeButton === 2 ? 'white' : '#4E4B4B'
                    }} onClick={() => handleGetTournaments(2)}>
                        Most viewed
                    </button>
                    <button className="Most liked" style={{
                    backgroundColor: activeButton === 3 ? '#CF2D2D' : '#D9D9D9', 
                    color: activeButton === 3 ? 'white' : '#4E4B4B'
                    }} onClick={() => handleGetTournaments(3)}>
                        Most liked
                    </button>
                </div>
                <div className="content">
                    <div onClick={() => {location.replace('/create')}} className="add-tournament">
                        <img className="plus" src={plus} alt="2"/>
                    </div>
                    {newTournaments?.map((tournament) => <TournamentItem tournament={tournament} key={tournament.id}/>)}
                </div>
            </div>
        </main>
    );
}

export default Home;