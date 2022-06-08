import { HIDE_LOADING, SHOW_LOADING } from './actionTypes';
import { AppDispatch } from './store';

const possibleErrorPaths = [
  'response.data.message.messages.0.message',
  'response.data.message.0.messages.0.message',
  'message',
];

export function handleNetworkError(e: any) {
  let error: string | null = null;
  possibleErrorPaths.forEach(paths => {
    let current: any = e;
    paths.split('.').forEach(path => {
      if (current && typeof current !== 'string') {
        current = current[path];
      }
    });
    if (!error && typeof current === 'string') {
      error = current;
    }
  });

  console.log(error || 'Network Error');
  return error || 'Network Error';
}

export async function handleCallApi(
  dispatch: AppDispatch,
  tryFunc: () => Promise<any>
) {
  let result;
  dispatch({ type: SHOW_LOADING });
  try {
    result = await tryFunc();
    dispatch({ type: HIDE_LOADING });
    return result;
  } catch (error) {
    result = handleNetworkError(error);
    dispatch({ type: HIDE_LOADING });
    throw result;
  }
}
