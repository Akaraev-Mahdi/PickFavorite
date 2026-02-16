import { useEffect, useState } from 'react';
import cancle from '../../assets/cancel.png'
import './create.css'
import loading from '../../assets/Iphone-spinner-2.gif'
import { useChekTournamentCompletedMutation, useCompletedTournamentMutation, useCreateTournamentMutation } from '../../redux/tournamentApi';
import { useCreateVoiterMutation, useDeletePictureMutation } from '../../redux/PictureApi';
import type { IPicture } from '../../type/pictureType';

function Create() {

    const [tournamentName, setTournamentName] = useState('')
    const [tournamentDescription, setTournamentDescription] = useState('')
    const [TournamentFile, setTournamentFile] = useState<File | null>(null)
    const [TournamentImgURL, setTournamentImgURL] = useState<string | null>('')

    const [voiterName, setVoiterName] = useState('')
    const [voiterDescription, setVoiterDescription] = useState('')
    const [VoiterFile, setVoiterFile] = useState<File | null>(null)
    const [VoiterImgURL, setVoiterImgURL] = useState<string | null>('')

    const [voitersArray, setVoitersArray] = useState<IPicture[]>([])

    const [createTournament, {error: tournamentError, data: tournamentData, isLoading: tournamentLoading}] = useCreateTournamentMutation()
    const [createVoiter, {error: voiterError}] = useCreateVoiterMutation()
    const [completedTournament, {error: completedError, data: completedData}] = useCompletedTournamentMutation()
    const [chekTournamentCompleted, {isLoading: chekTournamentCompletedLoading}] = useChekTournamentCompletedMutation()
    const [deletePicture] = useDeletePictureMutation()

    const handleChekTournamentCompleted = async () => {
        await chekTournamentCompleted().unwrap()
    }

    useEffect(() => {
        handleChekTournamentCompleted()
    }, [])

    const selectTournamentFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file){
            setTournamentFile(file)
            const url = URL.createObjectURL(file)
            setTournamentImgURL(url)
        }
    }

    const selectVoiterFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file){
            setVoiterFile(file)
            const url = URL.createObjectURL(file)
            setVoiterImgURL(url)
        }
    }

    const handleCreateTournament = async () => {
        const formData = new FormData()
        if(TournamentFile){
            formData.append('title', tournamentName)
            formData.append('description', tournamentDescription)
            formData.append('image', TournamentFile)
            await createTournament(formData).unwrap()
        }
    }

    const handleCreateVoiter = async () => {
        const formData = new FormData()
        if(VoiterFile){
            formData.append('title', voiterName)
            formData.append('description', voiterDescription)
            formData.append('image', VoiterFile)
            formData.append('tournamentId', tournamentData?.id)
            const result = await createVoiter(formData).unwrap()
            setVoitersArray((prevData) => [...prevData, result])
        }
        setVoiterName('')
        setVoiterDescription('')
        setVoiterImgURL('')
        setVoiterFile(null)
    }

    const handleDeletePicture = async (pictureId: number) => {

        let body = {
            pictureId: pictureId,
            tournamentId: tournamentData.id
        }

        await deletePicture(body).unwrap()
        setVoitersArray([...voitersArray].filter(v => v.id !== pictureId))
    }

    const handleCompleted = async () => {
        await completedTournament(tournamentData?.id).unwrap()
        setVoitersArray([])
        setTournamentName('')
        setTournamentDescription('')
        setTournamentImgURL('')
        setTournamentFile(null)
    }

    if(chekTournamentCompletedLoading){
        return (
            <div className='create-message'>
                <img className='loadingGif' src={loading} alt='...loding'/>
            </div>
        )
    }

    if(completedData){
        return (
            <div className='create-message'>
                <div className='create-message-border'>
                    <div className='create-message-text'>
                        Избератели добавленны и можно переходить к турниру
                    </div>
                    <button onClick={() => location.replace('/tournament/' + tournamentData?.id)} className='create-message-btn'>Перейти к турниру</button>
                </div>
            </div>
        )
    }

    return ( 
    <main>
        <div className="container">
            <div className="tournament-place">
                {
                    tournamentLoading ? <img className='loadingGif' src={loading} alt='...loding'/> :
                    tournamentData === undefined ?
                    <>
                    <div className="create-place">
                        <div className="place-name">Tournament</div>
                        <input value={tournamentName} onChange={e => setTournamentName(e.target.value)} className="tournament-input" type="text" placeholder="tournament name"/>
                        <input value={tournamentDescription} onChange={e => setTournamentDescription(e.target.value)} className="tournament-input" type="text" placeholder="tournament description"/>
                        <div className="tournament-btns">
                            <input id='tournament-file-img' className='file-change-input' type="file" onChange={selectTournamentFile} />
                            <label htmlFor="tournament-file-img" className="file-change-input-text">Add image</label>
                            <button onClick={() => handleCreateTournament()}>Done</button>
                        </div>
                        {tournamentError && <div className='error-message'>{tournamentError.data.message}</div>}
                    </div>
                    <div className="preview-place">
                        <div className="tournament-preview">
                            {TournamentImgURL && <img className='img' src={TournamentImgURL}/>}
                        </div>
                    </div>
                    </> :
                    <div className='success-message'>Турнир создан, добавьте изберателей</div>
                }
            </div>
            <div className="voiter-place">
                <div className="create-place">
                    <div className="place-name">Voiters</div>
                    <input value={voiterName} onChange={e => setVoiterName(e.target.value)} className="tournament-input" type="text" placeholder="voiter name"/>
                    <input value={voiterDescription} onChange={e => setVoiterDescription(e.target.value)} className="tournament-input" type="text" placeholder="voiter description"/>
                    <div className="tournament-btns">
                        <input id='voiter-file-img' className='file-change-input' type="file" onChange={selectVoiterFile} />
                        <label htmlFor="voiter-file-img" className="file-change-input-text">Add image</label>
                        <button onClick={() => handleCreateVoiter()} className="create-plus">+</button>
                    </div>
                    {voiterError && <div className='error-message'>{voiterError.data.message}</div>}
                </div>
                <div className="preview-place">
                    <div className="tournament-preview">
                        {VoiterImgURL && <img className='img' src={VoiterImgURL}/>}
                    </div>
                </div>
            </div>
            <button onClick={() => handleCompleted()} className='tournament-completed'>Completed</button>
            {completedError && <div className='error-message'>{completedError.data.message}</div>}
            <div className="existing-voters-place">
                <div className="place-name">Existing voters</div>
                {
                    voitersArray?.map((voiter) => 
                        <>
                            <hr />
                            <div className="voiter">
                                <div>
                                    <div className="create-voiter-name">{voiter.title}</div>
                                    <div className='tournament-img'>
                                        <img className="img" src={'http://localhost:5000/' + voiter.image} alt="i" />
                                    </div>
                                </div>
                                <div className="description">
                                    {voiter.description}
                                </div>
                                <div onClick={() => handleDeletePicture(voiter.id)} className="cancel-btn">
                                    <img className="cancel-img" src={cancle} alt="4"/>
                                </div>
                            </div>
                        </>
                    )
                }
            </div>
        </div>
    </main>
    );
}

export default Create;