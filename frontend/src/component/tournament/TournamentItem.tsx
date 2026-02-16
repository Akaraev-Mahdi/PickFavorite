import '../../page/Home/home.css'
import like from '../../assets/like.png'
import likeActive from '../../assets/likeActive.png'
import views from '../../assets/view.png'
import { useState } from 'react'
import { useLikeTournamentMutation, useUnLikeTournamentMutation } from '../../redux/likesApi'
import { useViewTournamentMutation } from '../../redux/viewsApi'
import type { ITournament } from '../../type/tournamentType'

interface Props {
  tournament: ITournament;
}

function TournamentItem({tournament}: Props) {
    const [likes, setLikes] = useState(tournament.likedByUser)
    const [likeCount, setLikeCount] = useState(tournament.like.length)

    const [likeTournament] = useLikeTournamentMutation()
    const [unLikeTournament] = useUnLikeTournamentMutation()

    const [viewTournament] = useViewTournamentMutation()

    const handleLike = async(like: boolean) => {
        setLikes(like)
        if(like){
            const data = await likeTournament(tournament.id).unwrap()
            setLikeCount(data)
        }else{
            const data = await unLikeTournament(tournament.id).unwrap()
            setLikeCount(data)
        }
    }

    const handleViews = async() => {
        await viewTournament(tournament.id).unwrap()
        location.replace('tournament/' + tournament.id)
    }

    return ( 
        <div className="tournament">
            <div onClick={() => handleViews()} className='tournament-img'>
                <img className="img" src={'http://localhost:5000/' + tournament.image} alt="i"/>
            </div>
            <div className="tournament-info">
                {tournament.title}
                <div className="tournament-activity">
                    <div className="likes">
                        <img onClick={() => handleLike(!likes)} className="like" src={likes ? likeActive : like} alt="3"/>
                        {likeCount}
                    </div>
                    <div className="views">
                        <img className="view" src={views} alt="4"/>
                        {tournament.views.length}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TournamentItem;