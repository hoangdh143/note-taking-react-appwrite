import api from "../api/api";
import { Server } from "../utils/config";
import { useEffect, useReducer } from "react";

export const FetchState = {
  FETCH_INIT: 0,
  FETCH_SUCCESS: 1,
  FETCH_FAILURE: 2,
};

export const useGetOneNotes = (stale, id) => {
  const reducer = (state, action) => {
    switch (action.type) {
      case FetchState.FETCH_INIT:
        return { ...state, isLoading: true, isError: false };
      case FetchState.FETCH_SUCCESS:
        return {
          ...state,
          isLoading: false,
          isError: false,
          oneNotes: action.payload ? action.payload[0] : {},
        };
      case FetchState.FETCH_FAILURE:
        return { ...state, isLoading: false, isError: true };
      default:
        throw new Error();
    }
  };

  const [state, dispatch] = useReducer(reducer, {
    isLoading: false,
    isError: false,
    oneNotes: {},
  });

  useEffect(() => {
    let didCancel = false;
    const getNotes = async () => {
      dispatch({ type: FetchState.FETCH_INIT });
      try {
        const data = await api.listDocumentsWithIds(Server.databaseID, Server.collectionNotesID, [id]);
        if (!didCancel) {
          dispatch({ type: FetchState.FETCH_SUCCESS, payload: data.documents });
        }
      } catch (e) {
        if (!didCancel) {
          dispatch({ type: FetchState.FETCH_FAILURE });
        }
      }
    };
    getNotes();
    return () => (didCancel = true);
  }, [stale]);

  return [state];
};

export const useGetChildren = (stale) => {
  const reducer = (state, action) => {
    switch (action.type) {
      case FetchState.FETCH_INIT:
        return { ...state, isLoading: true, isError: false };
      case FetchState.FETCH_SUCCESS:
        return {
          ...state,
          isLoading: false,
          isError: false,
          children: action.payload,
        };
      case FetchState.FETCH_FAILURE:
        return { ...state, isLoading: false, isError: true };
      default:
        throw new Error();
    }
  };

  const [state, dispatch] = useReducer(reducer, {
    isLoading: false,
    isError: false,
    children: [],
  });

  useEffect(() => {
    let didCancel = false;
    const getChildren = async () => {
      dispatch({ type: FetchState.FETCH_INIT });
      try {
        const data = await api.listDocumentsWithIds(Server.databaseID, Server.collectionNotesID, stale.childrenIds);
        if (!didCancel) {
          dispatch({ type: FetchState.FETCH_SUCCESS, payload: data.documents });
        }
      } catch (e) {
        if (!didCancel) {
          dispatch({ type: FetchState.FETCH_FAILURE });
        }
      }
    };
    getChildren();
    return () => (didCancel = true);
  }, [stale.childrenIds]);

  return [state];
};

export const useGetNotes = (stale) => {
  const reducer = (state, action) => {
    switch (action.type) {
      case FetchState.FETCH_INIT:
        return { ...state, isLoading: true, isError: false };
      case FetchState.FETCH_SUCCESS:
        return {
          ...state,
          isLoading: false,
          isError: false,
          notes: action.payload,
        };
      case FetchState.FETCH_FAILURE:
        return { ...state, isLoading: false, isError: true };
      default:
        throw new Error();
    }
  };

  const [state, dispatch] = useReducer(reducer, {
    isLoading: false,
    isError: false,
    notes: [],
  });

  useEffect(() => {
    let didCancel = false;
    const getNotes = async () => {
      dispatch({ type: FetchState.FETCH_INIT });
      try {
        const data = await api.listDocuments(Server.databaseID, Server.collectionNotesID);
        if (!didCancel) {
          dispatch({ type: FetchState.FETCH_SUCCESS, payload: data.documents });
        }
      } catch (e) {
        if (!didCancel) {
          dispatch({ type: FetchState.FETCH_FAILURE });
        }
      }
    };
    getNotes();
    return () => (didCancel = true);
  }, [stale]);

  return [state];
};

export const useGetTodos = (stale) => {
  const reducer = (state, action) => {
    switch (action.type) {
      case FetchState.FETCH_INIT:
        return { ...state, isLoading: true, isError: false };
      case FetchState.FETCH_SUCCESS:
        return {
          ...state,
          isLoading: false,
          isError: false,
          todos: action.payload,
        };
      case FetchState.FETCH_FAILURE:
        return { ...state, isLoading: false, isError: true };
      default:
        throw new Error();
    }
  };

  const [state, dispatch] = useReducer(reducer, {
    isLoading: false,
    isError: false,
    todos: [],
  });

  useEffect(() => {
    let didCancel = false;
    const getTodos = async () => {
      dispatch({ type: FetchState.FETCH_INIT });
      try {
        const data = await api.listDocuments(Server.databaseID, Server.collectionID);
        if (!didCancel) {
          dispatch({ type: FetchState.FETCH_SUCCESS, payload: data.documents });
        }
      } catch (e) {
        if (!didCancel) {
          dispatch({ type: FetchState.FETCH_FAILURE });
        }
      }
    };
    getTodos();
    return () => (didCancel = true);
  }, [stale]);

  return [state];
};

export const useGetUser = () => {
  const reducer = (state, action) => {
    switch (action.type) {
      case FetchState.FETCH_INIT:
        return { ...state, isLoading: true, isError: false };
      case FetchState.FETCH_SUCCESS:
        return {
          ...state,
          isLoading: false,
          isError: false,
          user: action.payload,
        };
      case FetchState.FETCH_FAILURE:
        return { ...state, isLoading: false, isError: true };
      default:
        throw new Error();
    }
  };

  const [state, dispatch] = useReducer(reducer, {
    isLoading: false,
    isError: true,
    data: [],
  });

  useEffect(() => {
    let didCancel = false;
    const getAccount = async () => {
      dispatch({ type: FetchState.FETCH_INIT });
      try {
        const account = await api.getAccount();
        if (!didCancel) {
          dispatch({ type: FetchState.FETCH_SUCCESS, payload: account });
        }
      } catch (e) {
        if (!didCancel) {
          dispatch({ type: FetchState.FETCH_FAILURE });
        }
      }
    };
    getAccount();
    return () => (didCancel = true);
  }, []);

  return [state, dispatch];
};
