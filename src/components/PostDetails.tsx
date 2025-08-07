import React from 'react';
import { Loader } from './Loader';
import { NewCommentForm } from './NewCommentForm';
import { Post } from '../types/Post';
import { Comment } from '../types/Comment';
import { client } from '../utils/fetchClient';
import PropTypes from 'prop-types';

type Props = {
  post: Post | undefined;
  comments: Comment[] | undefined;
  setComments: React.Dispatch<React.SetStateAction<Comment[] | undefined>>;
  stateCommentButton: boolean;
  setStateCommentButton: React.Dispatch<React.SetStateAction<boolean>>;
  errorIsSubmiting: string;
  setErrorIsSubmiting: React.Dispatch<React.SetStateAction<string>>;
};

export const PostDetails: React.FC<Props> = ({
  post,
  comments,
  setComments,
  stateCommentButton,
  setStateCommentButton,
  errorIsSubmiting,
  setErrorIsSubmiting,
}) => {
  const handleDeleteComment = (id: number) => {
    client
      .delete(`/comments/${id}`)
      .then(() => {
        setComments(comments?.filter(coment => coment.id !== id));
      })
      .catch(() => {});
  };

  return (
    <div className="content" data-cy="PostDetails">
      <div className="content" data-cy="PostDetails">
        {post && (
          <>
            <div className="block">
              <h2 data-cy="PostTitle">
                {`#${post?.id}: ${post?.title}`}
                {/* #18: voluptate et itaque vero tempora molestiae */}
              </h2>

              <p data-cy="PostBody">
                {post?.body}
                {/* eveniet quo quis laborum totam consequatur non dolor ut et est
            repudiandae est voluptatem vel debitis et magnam */}
              </p>
            </div>

            <div className="block">
              {!post && <Loader />}

              {errorIsSubmiting && (
                <div className="notification is-danger" data-cy="CommentsError">
                  {errorIsSubmiting}
                </div>
              )}

              {!comments && (
                <p className="title is-4" data-cy="NoCommentsMessage">
                  No comments yet
                </p>
              )}

              <p className="title is-4">Comments:</p>

              {comments?.map(comment => (
                <article
                  className="message is-small"
                  data-cy="Comment"
                  key={comment.id}
                >
                  <div className="message-header">
                    <a href={`mailto:${comment.email}`} data-cy="CommentAuthor">
                      {comment.name}
                    </a>

                    <button
                      data-cy="CommentDelete"
                      type="button"
                      className="delete is-small"
                      aria-label="delete"
                      onClick={() => handleDeleteComment(comment.id)}
                    >
                      delete button
                    </button>
                  </div>

                  <div className="message-body" data-cy="CommentBody">
                    {comment.body}
                  </div>
                </article>
              ))}

              <button
                data-cy="WriteCommentButton"
                type="button"
                className="button is-link"
                onClick={() => setStateCommentButton(true)}
              >
                Write a comment
              </button>
            </div>
          </>
        )}

        {stateCommentButton && (
          <NewCommentForm
            post={post}
            setComments={setComments}
            setErrorIsSubmiting={setErrorIsSubmiting}
          />
        )}
      </div>
    </div>
  );
};

PostDetails.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number.isRequired,
    userId: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
  }).isRequired,

  comments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      postId: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      body: PropTypes.string.isRequired,
    }).isRequired,
  ),

  stateCommentButton: PropTypes.bool.isRequired,
  errorIsSubmiting: PropTypes.string.isRequired,
  setComments: PropTypes.func.isRequired,
  setStateCommentButton: PropTypes.func.isRequired,
  setErrorIsSubmiting: PropTypes.func.isRequired,
};
