
import { useParams, Link } from 'react-router';
import { useState, useEffect, useContext } from 'react';
import * as hootService from '../../services/hootService';
import CommentForm from '../CommentForm/CommentForm';
import { UserContext } from '../../contexts/UserContext';

const HootDetails = (props) => {
  const { hootId } = useParams();
  const { user } = useContext(UserContext);
  const [hoot, setHoot] = useState(null);

  useEffect(() => {
    const fetchHoot = async () => {
      const hootData = await hootService.show(hootId);
      setHoot(hootData);
    };
    fetchHoot();
  }, [hootId]);

  const handleAddComment = async (commentFormData) => {
    const newComment = await hootService.createComment(hootId, commentFormData);
    setHoot({ ...hoot, comments: [...hoot.comments, newComment] });
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const removedComment = await hootService.deleteComment(hootId, commentId);
      if (!removedComment) throw new Error(removedComment.error);
      setHoot({ ...hoot, comments: hoot.comments.filter(el => el._id !== commentId) });
    } catch (error) {
      console.log(error);
    };
  };

  if (!hoot) return <main>Loading...</main>;
  return (
    <main>
      <section>
        <header>
          <p>{hoot.category.toUpperCase()}</p>
          <h1>{hoot.title}</h1>
          <p>
            {`${hoot.author.username} posted on
            ${new Date(hoot.createdAt).toLocaleDateString()}`}
          </p>
          {hoot.author._id === user._id && (
            <>
              <Link to={`/hoots/${hootId}/edit`}>Edit</Link>
              <button onClick={() => props.handleDeleteHoot(hootId)}>
                Delete
              </button>
            </>
          )}
        </header>
        <p style={{ color: 'gray' }}>{hoot.text}</p>
      </section>
      <section>
        <h2>Comments</h2>
        {/* Pass the handleAddComment function to the CommentForm Component */}
        <CommentForm handleAddComment={handleAddComment} />

        {!hoot.comments.length && <p>There are no comments.</p>}

        {hoot.comments.map((comment) => (
          <article key={comment._id}>
            <header>
              <p>
                {`${comment.author.username} posted on
                ${new Date(comment.createdAt).toLocaleDateString()}`}
              </p>
            </header>
            {comment.author._id === user._id && (
              <>
                <Link to={`/hoots/${hootId}/comments/${comment._id}/edit`}>Edit</Link>
                <button onClick={() => handleDeleteComment(comment._id)}>
                  Delete
                </button>
              </>
            )}
            <p>{comment.text}</p>
          </article>
        ))}
      </section>
    </main>
  );
};

export default HootDetails;