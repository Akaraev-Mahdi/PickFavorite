import TournamentItem from '../../component/tournament/TournamentItem';
import { useEffect, useState } from 'react';
import { useGetLikedTournamentsQuery } from '../../redux/likesApi';
import { useLazyGetViewedTournamentsQuery } from '../../redux/viewsApi';
import { useLazyGetCreatedTournamentsQuery } from '../../redux/tournamentApi';
import type { ITournament } from '../../type/tournamentType';

function Activity() {
    const {data: LikedTournaments = []} = useGetLikedTournamentsQuery()
    const [GetViewedTournaments] = useLazyGetViewedTournamentsQuery()
    const [GetCreatedTournaments] = useLazyGetCreatedTournamentsQuery()
    
    const [activeButton, setActiveButton] = useState(1)
    const [newTournaments, setNewTournaments] = useState<ITournament[]>([])

    useEffect(() => {
        if(LikedTournaments.length > 0){
            setNewTournaments(LikedTournaments)
        }
    }, [LikedTournaments])

    const handleGetTournaments = async (buttonId: number) => {
        if(buttonId === 3){
            const {data} = await GetCreatedTournaments()
            setNewTournaments(data ?? [])
        }
        if(buttonId === 2){
            const {data} = await GetViewedTournaments()
            setNewTournaments(data ?? [])
        }
        if(buttonId === 1){
            setNewTournaments(LikedTournaments)
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
                        Liked
                    </button>
                    <button className="Most viewed" style={{
                    backgroundColor: activeButton === 2 ? '#CF2D2D' : '#D9D9D9', 
                    color: activeButton === 2 ? 'white' : '#4E4B4B'
                    }} onClick={() => handleGetTournaments(2)}>
                        Viewed
                    </button>
                    <button className="Most liked" style={{
                    backgroundColor: activeButton === 3 ? '#CF2D2D' : '#D9D9D9', 
                    color: activeButton === 3 ? 'white' : '#4E4B4B'
                    }} onClick={() => handleGetTournaments(3)}>
                        Created
                    </button>
                </div>
                <div className="content">
                    {newTournaments?.map((tournament) => <TournamentItem tournament={tournament} key={tournament.id}/>)}
                </div>
            </div>
        </main>
    );
}

export default Activity;