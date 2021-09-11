import { useHistory, useParams } from 'react-router-dom';
import logoImg from '../assets/images/logo.svg';
import Button from '../components/Button';
import Question from '../components/Question';
import RoomCode from '../components/RoomCode';
import { useAuthContext } from '../contexts/AuthContext';
import useRoom from '../hooks/useRoom';
import { database } from '../services/firebase';
import deleteImg from '../assets/images/delete.svg';

import '../styles/room.scss';

type RoomParams = {
  id: string;
}

function AdminRoom() {
  const history = useHistory();
  const { user } = useAuthContext();
  const params = useParams<RoomParams>();
  const { title, questions } = useRoom(params.id);

  async function handleEndRoom(){
    if(!user){
      return;
    }

    await database.ref(`/rooms/${params.id}`).update({
      endedAt: new Date()
    });

    history.push('/');
  }

  async function handleDeleteQuestion(questionId: string) {
    if(!user){
      return;
    }

    const confirmation = window.confirm('Tem certeza que você deseja excluir esta pergunta?');
    
    if(confirmation){
      await database.ref(`rooms/${params.id}/questions/${questionId}`).remove();
    }
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Lemeask" />
          <div>
            <RoomCode code={params.id} />
            <Button isOutlined onClick={handleEndRoom}>Encerrar sala</Button>
          </div>
        </div>
      </header>
      <main>
        <div className="room-title">
          <h1>Sala { title }</h1>
          { questions.length > 0 && <span>{ questions.length } pergunta(s)</span> }
        </div>
        
        <div className="question-list">
          { questions.map(question => (
            <Question 
              key={question.id}
              content={question.content} 
              author={question.author} 
            >
              <button
                type='button'
                onClick={ () => handleDeleteQuestion(question.id)}
              >
                <img src={deleteImg} alt="Remover pergunta" />
              </button>
            </Question>
          )) }
        </div>
      </main>
    </div>
  );
}

export default AdminRoom;