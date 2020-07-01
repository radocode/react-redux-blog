import _ from 'lodash';
import jsonPlaceholder from '../apis/jsonPlaceholder'

// reusable approach, with lodash validating the unique ids and use them to fetch each user by calling
// the other action creators fetchPosts and fetchUsers
export const fetchPostsAndUsers = () => async (dispatch, getState) => {
  await dispatch(fetchPosts());

  // const userIds = _.uniq(_.map(getState().posts, 'userId'));
  // userIds.forEach(id => dispatch(fetchUser(id)));

  // lodash approach to chain functions, similar to RxJS
  _.chain(getState().posts)
    .map('userId')
    .uniq()
    .forEach(id => dispatch(fetchUser(id)))
    .value()
};

// defining a function thats going to return a function, ES2015 syntax
// redux thunk will pick it up, check if its a function
// and dispatch the result of it as a new action when it finishes
export const fetchPosts = () => async dispatch => {
  const response = await jsonPlaceholder.get('/posts');
  dispatch({ type: 'FETCH_POSTS', payload: response.data })
};

export const fetchUser = (id) => async dispatch => {
  const response = await jsonPlaceholder.get(`/users/${id}`);
  dispatch({ type: 'FETCH_USER', payload: response.data })
};

// memoizing approach, in order to avoid duplicate requests, made with lodash
// export const fetchUser = (id) => dispatch => _fetchUser(id, dispatch);
// const _fetchUser = _.memoize(async (id, dispatch) => {
//   const response = await jsonPlaceholder.get(`/users/${id}`);
//   dispatch({ type: 'FETCH_USER', payload: response.data })
// });
