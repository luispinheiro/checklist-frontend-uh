import React, { useContext, useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Spinner from './Spinner';
import Alert from './Alert';
import { useCluhs } from '../hooks/useCluhs'
import { AuthContext } from '../hooks/useAuth';
import Moment from 'react-moment';
import './index.css';

const CluhListTable = () => {
  const auth = useContext(AuthContext);
  const cluhs = useCluhs();
  const [ editId, setEditId ] = useState(0);

useEffect(() => {
    if (auth.credentials.username !== null) {
        cluhs.list();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
}, [auth.credentials]);

const  onDeleteHandler  =  ( cluhToDelete )  =>  {
  if  ( window.confirm ( "Deseja mesmo excluir esta tarefa?" ) )  {
      cluhs.remove ( cluhToDelete ) ;
  }
}

const onEditHandler = (cluhToEdit) => {
  setEditId(cluhToEdit.id);
}

useEffect(() => {
  if (cluhs.cluhRemoved !== null) {
      toast.success(`Tarefa ${cluhs.cluhRemoved.id} excluída!`,
          { position: toast.POSITION.BOTTOM_LEFT});
      cluhs.clearCluhRemoved();
  }

});

if (!auth.isAuthenticated()) {
    return <Redirect to="/login" />
}

if (editId > 0) {
  return <Redirect to={`/form/${editId}`} />
}

return (
  <>
      <h1>Lista de Checklists</h1>
      {cluhs.error && <Alert message={cluhs.error} />}
      {cluhs.processing ? <Spinner /> :
        <div className="table-responsive  bw-tabela-simples">
          <table className="table  table-hover">
              <thead className="thead-dark">
                  <tr>
                      <th scope="col">Data</th>
                      <th scope="col">Tag</th>
                      <th scope="col">Nivel</th>
                      <th scope="col">Abastecimento</th>
                      <th scope="col">condição</th>
                      <th scope="col">Observação</th>
                      <th scope="col">Ações</th>
                  </tr>
              </thead>

              <tbody>
                  {cluhs.cluhList.length === 0 ? <tr><td colSpan="10">Sem listagem cadastrados no momento!</td></tr> :
                      (
                          cluhs.cluhList.map(cluh =>
                              <tr key={cluh.id}>
                                  <td><Moment format="DD/MM/YYYY">{cluh.dataCriacao}</Moment></td>
                                  <td>{cluh.tag}</td>
                                  <td>{cluh.nivel}</td>
                                  <td>{cluh.abastecimento}</td>
                                  <td>{cluh.condicao}</td>
                                  <td>{cluh.observacao}</td>
                                  <td>
                                      <input
                                          type="button"
                                          className="btn btn-primary"
                                          value="Editar"
                                          onClick={() => onEditHandler(cluh)} />
                                      &nbsp;
                                      <input
                                          type="button"
                                          className="btn btn-danger"
                                          value="Excluir"
                                          onClick={() => onDeleteHandler(cluh)} />


                                  </td>
                              </tr>
                          )
                      )}
              </tbody>
          </table>
        </div>
      }
      <ToastContainer autoClose={1500} />
  </>
  );
}

export default CluhListTable;
