import axios from "axios";
import { API_ENDPOINT } from "../constants";
import { useContext } from "react";
import { useState } from "react";
import { AuthContext } from './useAuth'


export const useCluhs = () => {
  const auth = useContext(AuthContext);
  const [cluhList, setCluhList] = useState([]);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [cluhRemoved, setCluhRemoved] = useState(null);
  const [cluhUpdated, setCluhUpdated] = useState(null);
  const [cluhLoaded, setCluhLoaded] = useState(null);


  const list = async () => {
    try {
        setProcessing(true);
        setError(null);
        const response = await axios.get(`${API_ENDPOINT}/cluhs?sort=dataCriacao,desc`, buildAuthHeader())
        console.log(response.data);
        const content = response.data.content;

        if (content.length === 1 && content[0].value && content[0].value.length === 0) {
            setCluhList([]);
        } else {
            setCluhList(content);
        }

        setProcessing(false);

    } catch (error) {
        handleError(error);
    }
}

const remove = async  (cluhToRemove) => {
  try {
    await  axios.delete(`${API_ENDPOINT}/cluhs/${cluhToRemove.id}`, buildAuthHeader());
    setCluhList(cluhList.filter(cluh => cluhToRemove.id !== cluh.id));
    setCluhRemoved(cluhToRemove);
  } catch (error) {
    handleError(error);
  }
}

const save = async (cluhToSave, onlyStatus = false) => {
  try {
    setProcessing(!onlyStatus);
    setCluhUpdated(null);
    setError(null);

    if (cluhToSave.id === 0) {
        await axios.post(`${API_ENDPOINT}/cluhs`, cluhToSave, buildAuthHeader());

    } else {
        await axios.put(`${API_ENDPOINT}/cluhs/${cluhToSave.id}`, cluhToSave, buildAuthHeader());
    }

    setProcessing(false);
    setCluhUpdated(cluhToSave);

  } catch (error) {
    handleError(error);
  }
}

const load = async (id) => {
  try {
      setProcessing(true);
      setError(null);
      setCluhLoaded(null);
      const response = await axios.get(`${API_ENDPOINT}/cluhs/${id}`, buildAuthHeader());
      setCluhLoaded(response.data);
      setProcessing(false);

  } catch (error) {
      handleError(error);
  }
}

const clearCluhRemoved = () => {
  setCluhRemoved(null);
}

const clearCluhUpdated = () => {
  setCluhUpdated(null);
}

const clearCluhLoaded = () => {
  setCluhLoaded(null);
}

 const buildAuthHeader = () => {
    return {
        headers: {
            'Authorization': `Bearer ${auth.credentials.token}`
        }
    }
  }

  const handleError = (error) => {
    console.log(error);
    const resp = error.response;

    if (resp && resp.status === 400 && resp.data) {
        setError(resp.data.error);
    } else {
        setError(error.message);
    }

    setProcessing(false);
}

return { cluhList, error, processing, cluhRemoved, cluhUpdated, cluhLoaded,
  list, remove, save, load, clearCluhRemoved, clearCluhUpdated, clearCluhLoaded };

}
